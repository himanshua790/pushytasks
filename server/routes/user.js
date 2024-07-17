const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });
    const user = await User.findOne({
      email: req.body.email,
      role: req.body.role,
    });
    if (user) {
      return res.status(409).send("User with given email already exist");
    }
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    await new User({ ...req.body, password: hashedPassword }).save();
    res
      .status(201)
      .send("User created successfully with role:" + req.body.role);
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
    const email = decodedToken.email;
    const user = await User.findOne({ email: email });
    res.send(user);
  } catch (error) {
    res.status(500).send("Internal server error.");
  }
});

module.exports = router;
