const mongoose = require("mongoose");
const schema = mongoose.Schema(
  {
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"admins",
      required:true
    },
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      message: "Title validation failed",
    },
    description: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 100,
      message: "description validation failed",
    },
    duedate: {
      type: Date,
      message: "dueDate validation failed",
    },
    priority: {
      type: Number,
      default:'3',
      enum: [3, 2, 1],
    },
    status: { 
      type: String,
      default:"Pending",
      enum: ["Pending", "In progress", "Completed"],
    },
  },
  {
    timestamps: true,
  }
);
const task = mongoose.model("task", schema);
module.exports = task;
