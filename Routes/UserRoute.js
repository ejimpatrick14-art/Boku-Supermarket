const express = require("express");
const router = express.Router(); 

//import the user controller
const userController = require("../Controllers/UserController");

// Define the routes
router.post("/createuser", userController.createUser);
router.post("/loginuser", userController.loginUser);

//export the router to use in other files
module.exports = router;