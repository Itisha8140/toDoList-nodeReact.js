const taskModel = require("../models/taskModel");
const mongoose = require("mongoose");
const ApiFeatures = require("../utlis/apifeature");
const taskCreate = async (req, res) => {
  if (!req.user || !req.user.id) {
    console.log();
    return res.status(401).json({ error: "Unauthorized" });
  }
  const {
    body: { id, title, description, duedate, priority, status },
  } = req;
  console.log(req.user.id);
  try {
    if (id) {
      const editValue = {
        title,
        description,
        duedate,
        priority: +priority,
        status,
        user: req.user.id,
      };
      const task = await taskModel.findOneAndUpdate(
        { _id: id },
        { $set: editValue },
        { new: true }
      );
      return res.json(
        responses.OK({
          success: true,
          task: task,
        })
      );
    }
    const task = await taskModel.create({
      title,
      description,
      duedate,
      priority: +priority,
      status,
      user: req.user.id,
    });

    res.status(201).json({ success: true, task });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      console.error("vali", error);
      return res.status(500).json({ error: error.message });
    } else {
      console.error("Error creating Location:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
const taskView = async (req, res) => {
  try {
    const taskCount = await taskModel
      .find({ user: req.user.id })
      .countDocuments();
    const apiFeature = new ApiFeatures(
      taskModel.find({ user: req.user.id }),
      req.query
    )
      .search()
      .filter()
      .sort();

    let task = await apiFeature.query;

    let filterTaskCount = task.length;

    apiFeature.pagination();

    task = await apiFeature.query.clone();

    return res.json({
      success: true,
      task: task,
      taskCount,
      resultPerPage: Number(req.query.resultPerPage),
      filterTaskCount,
    });
  } catch (error) {
    console.error("Error getTask Location:", error);
    return res
      .status(500)
      .json({ success: false, mag: "Error getTask Location:" });
  }
};
const taskFindOne = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid delete ID" });
    }
    const data = await taskModel.findById(id);
    return res.status(200).json({ sucssee: true, data });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      console.error(error.message);
      return res.status(500).json({ error: error.message });
    } else {
      console.error("Error creating Location:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
const deleteRecord = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid delete ID" });
    }
    const data = await taskModel.findByIdAndDelete(id);
    return res.status(200).json({ sucssee: true, msg: "Record is delete !!" });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      console.error(error.message);
      return res.status(500).json({ error: error.message });
    } else {
      console.error("Error creating Location:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
const updatedRecod = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid delete ID" });
    }
    const data = await taskModel.findByIdAndUpdate(id, req.body);
    return res.status(200).json({ sucssee: true, data });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      // Handle validation error
      console.error(error.message);
      return res.status(500).json({ error: error.message });
    } else {
      console.error("Error creating Location:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

module.exports = {
  taskCreate,
  taskView,
  taskFindOne,
  deleteRecord,
  updatedRecod,
};
