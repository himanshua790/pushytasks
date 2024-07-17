const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

router.post("/", async (req, res) => {
  try {
    const { metamaskAddress } = req.body;
    const user = await User.findOne({ metamaskAddress });

    if (user) {
      const token = jwt.sign(
        { metamaskAddress: user.metamaskAddress },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
      );
      res
        .status(200)
        .send({ token: token, message: "Token stored successfully" });
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
