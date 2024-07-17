const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const jwt = require('jsonwebtoken');

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ metamaskAddress: req.body.metamaskAddress });
    if (user) {
      return res.status(409).send("User with given MetaMask address already exists");
    }

    await new User({ ...req.body }).save();
    res.status(201).send("User created successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error.");
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
    const user = await User.findOne({ metamaskAddress });
    res.send(user);
  } catch (error) {
    res.status(500).send("Internal server error.");
  }
});

module.exports = router;
