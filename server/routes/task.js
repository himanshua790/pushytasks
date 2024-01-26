const express = require("express");
const router = express.Router();
const { DynamoDB } = require("aws-sdk");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
var docClient = new DynamoDB.DocumentClient();

router.post("/create-task", async (req, res) => {
  try {
    const token = req.header("token");
    if (!token) {
      return res.status(401).json({ error: "Token is missing" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const email = decodedToken.email;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ error: "Something went wrong!" });
    }
    const userId = user._id.toString();
    const itemId = uuidv4();
    var item = {
      id: itemId,
      userId: userId,
      taskTitle: req.body.taskTitle,
      taskDetail: req.body.taskDetail,
      taskDeadline: req.body.taskDeadline,
    };

    var dbParam = {
      TableName: "tasks",
      Item: item,
    };

    docClient.put(dbParam, function (err, data) {
      if (err) {
        return res.status(500).send("Error :", err);
      }
    });
    var params = {
      TableName: "tasks",
      Key: { id: itemId, userId: userId },
    };

    docClient.get(params, function (err, data) {
      if (err) {
        return res.status(404).send(err);
      } else {
        return res.status(200).send(data.Item);
      }
    });
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
    const email = decodedToken.email;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ error: "Something went wrong!" });
    }
    const userId = user._id.toString();

    const queryParams = {
      TableName: "tasks",
      FilterExpression: "userId = :value",
      ExpressionAttributeValues: {
        ":value": userId,
      },
    };
    const result = await docClient.scan(queryParams).promise();
    return res.status(200).send(result.Items); 
  } catch (error) {
    console.log(error);
  }
});

router.post("/edit", async (req, res) => {
  try {
    const taskId = req.body.id;

    var item = {
      id: taskId,
      userId: req.body.userId,
      taskTitle: req.body.taskTitle,
      taskDetail: req.body.taskDetail,
      taskDeadline: req.body.taskDeadline,
    };

    var dbParam = {
      TableName: "tasks",
      Item: item,
    };

    docClient.put(dbParam, function (err, data) {
      if (err) {
        return res.status(500).send("Error :", err);
      }
    });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const taskId = req.body.id;
    const userId = req.body.userId;
    var params = {
      TableName: "tasks",
      Key: {
        id: taskId,
        userId: userId,
      },
    };
    //  console.log(params)

    docClient.delete(params, function (err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        return res.status(200).send("Task deleted successfully");
      }
    });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
