const mongoose = require("mongoose");
const AdminDashboardTask = new mongoose.Schema(
  {
    Title: {
      type: String,
      trim: true,
      required: [true, "Title is required"],
    }, 
    Description: {
        type: String,
        trim: true,
        required: [true, "Description is required"],
      },
      Duration:{
        type:String,
        trim: true,
        required: [true, "Duration is required"],

      },
      Assigned: {
        type:String,
        trim: true,
        required: [true, "Assigned is required"],
      },
      Status: {
        type: String,
        trim: true,
        required: [true, "Status is required"],
      },
      Notification: {
        type: Boolean,
        trim: true,
        required: [true, "Notification is required"],
      },
      Comments: {
        type: String,
        trim: true,
        required: [true, "Comments  is required"],
      },
      Created_At:{
        type: String,
        trim: true,
        required: [true, "createdAt  is required"],

      }
  },
  {timestamps:true}
);
 
module.exports = mongoose.model("Admin_task", AdminDashboardTask);