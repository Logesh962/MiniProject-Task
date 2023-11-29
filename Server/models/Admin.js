const mongoose = require('mongoose');
 
const admin = new mongoose.Schema(
{
    username:{
        type:String,
        unique: true,
        trim: true,
        required:[true, "Username required"]
    } ,
    email: {
        type: String,
        unique: true,
        trim: true,
        required: [true, "Email is required"],
    },
    password:{
        type:String,
        unique: true,
        trim: true,
        required:[true,"Password required"]
    }
})
 
module.exports = mongoose.model("Admin",admin);

