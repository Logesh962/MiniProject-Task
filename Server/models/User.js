const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password is required"],
    },
    empId: {
      type: Number,
      trim: true,
      required: [true, "eid is required"],
    }

  },{timestamps:true},
  
);

module.exports = mongoose.model("UsersList", userSchema);
