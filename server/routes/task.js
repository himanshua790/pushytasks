// routes/task.js
const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const { Task, validateTask } = require("../models/task");
const jwt = require("jsonwebtoken");
const { ethers } = require("ethers");

router.post("/create-task", async (req, res) => {
  try {
    const token = req.header("token");
    if (!token) {
      return res.status(401).json({ error: "Token is missing" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const metamaskAddress = decodedToken.metamaskAddress;
    const user = await User.findOne({
      metamaskAddress: metamaskAddress,
    }).lean();

    if (!user) {
      return res.status(401).json({ error: "Something went wrong!" });
    }

    const { error } = validateTask({
      ...req.body,
      userId: user._id.toString(),
    });
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const task = new Task({
      userId: user._id,
      taskTitle: req.body.taskTitle,
      taskDetail: req.body.taskDetail,
      taskDeadline: req.body.taskDeadline,
      reward: req.body.reward,
      status: req.body.status,
    });

    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

router.get("/", async (req, res) => {
  try {
    const token = req.header("token");
    if (!token) {
      return res.status(401).json({ error: "Token is missing" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const metamaskAddress = decodedToken.metamaskAddress;
    const user = await User.findOne({ metamaskAddress: metamaskAddress });

    if (!user) {
      return res.status(401).json({ error: "Something went wrong!" });
    }

    const tasks = await Task.find().lean();
    res.status(200).send(tasks);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

router.post("/edit", async (req, res) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ error: "Token is missing" });
    }

    const token = authHeader.split(" ")[1]; // Get the token from "Bearer <token>"
    if (!token) {
      return res.status(401).json({ error: "Token is missing" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const email = decodedToken.email;
    const user = await User.findOne({ email: email }).lean();
    if (!user) {
      return res.status(401).json({ error: "Something went wrong!" });
    }
    if (user.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const { error } = validateTask(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const task = await Task.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });

    if (!task) return res.status(404).send("Task not found");
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.body.id);
    if (!task) return res.status(404).send("Task not found");

    res.status(200).send("Task deleted successfully");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

router.post("/accept", async (req, res) => {
  try {
    const { metamaskAddress, taskId, signature, message } = req.body;

    // Verify the signature
    const isValidSignature = await ethers.verifyMessage(
      message,
      signature,
      metamaskAddress
    );
    if (!isValidSignature) {
      return res.status(400).send({ message: "Invalid signature" });
    }

    // Find the user and the task
    const user = await User.findOne({ metamaskAddress }).lean();
    const task = await Task.findById(taskId);

    if (!user || !task) {
      return res.status(404).send({ message: "User or Task not found" });
    }

    // Process the task acceptance (customize as per your logic)
    task.assignTo = user._id;
    await task.save();

    res.status(200).send({ message: "Task accepted successfully" });
  } catch (error) {
    console.error("Error accepting task:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router;
module.exports = router;
