const mongose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    hasAdminAccess: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["superadmin", "storekeeper", "salesperson",],
        //default: "salesperson"
    },
        //Date created and updated at

},
{timestamps: true}
);

//create model from schema
const User = mongose.model("User", UserSchema);

module.exports = User; //export the model to use in other files