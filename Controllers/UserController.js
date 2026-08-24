const User = require("../Models/Users");
const bcrypt = require("bcryptjs");

//create a new user
exports.createUser = async (req, res) => {
    try {
        //request body
        const { name, email, password, gender, phone, role, hasAdminAccess } = req.body;

        //check if all required fields are provided
        if (!name || !email || !password || !gender || !phone || !role) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        //email check
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        //phone number check
        const existingPhone = await User.findOne({ phone: req.body.phone });
        if (existingPhone) {
            return res.status(400).json({ message: "Phone number already exists" });
        }

        //encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //create new user
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            gender: req.body.gender,
            phone: req.body.phone,
            role: req.body.role, //default role is 'user' if not provided
            hasAdminAccess: req.body.hasAdminAccess || false //default is false if not provided
        });

        await user.save();
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error: error.message });
    }

};


//login user
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        //check if all required fields are provided
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        //check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        //check if password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        //generate a token (you can use JWT or any other method to generate a token)
        //const token = generateToken(user); //implement your token generation logic here

        const jwt = require("jsonwebtoken");
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};