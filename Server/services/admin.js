const { hash, compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");

const Admin = require("../models/Admin");
const AdminTask = require("../models/AdminTasks")


exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  console.log(req.body);
  try {
    const admin = await Admin.findOne({ username }).lean();
    if (!admin) return res.status(404).send("Invalid credentials");

    const isMatch = await compare(password, admin.password);
    if (!isMatch) return res.status(400).send("Invalid credentials...");
    const token = sign({ admin }, process.env.JWT_SECRET, {
      expiresIn: 360000,
    });
    return res.status(200).json({ token, admin });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.saveNewTask = async (req, res) => {
  try {
    var add_Task = req.body;
    await AdminTask.create(add_Task);
    res.status(200).send("Success");
  }
  catch (err) {
    res.status(400).send(err)
  }
};

exports.getTask = async (req, res) => {
  try {
    var tasks = await AdminTask.find({});
    res.status(200).send(tasks);
  }
  catch (err) {
    res.status(400).send(err)
  }
};


exports.updateNewTask = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("id", id);
    console.log(req.body);
    await AdminTask.findOneAndUpdate({ _id: id }, req.body);
    res.status(200).send("Success");
  }
  catch (err) {
    res.status(400).send(err)
  }
};


exports.deleteTask = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    await AdminTask.deleteOne({ _id: id });
    res.status(200).send("Success");
  }
  catch (err) {
    res.status(400).send(err)
  }
};

exports.getAuthAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req?.admin?._id).select("-password").lean();
    if (!admin)
      return res.status(400).send("Admin not found, Authorization denied..");
    return res.status(200).json({ ...admin });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
