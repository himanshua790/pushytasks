const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  metamaskAddress: { type: String, required: true, unique: true },
  tasks : [{ type: mongoose.Schema.Types.Mixed }],  // Array of tasks
  role: { type: String, required: true, default: "user" },  // Default role
  org: { type: mongoose.Schema.Types.ObjectId, ref: "Org" },
});

const User = mongoose.model("User", userSchema);

const validate = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(50).required(),
    metamaskAddress: Joi.string().required(),
    role: Joi.string().valid("admin", "user").required(),
    org: Joi.string()
  });
  return schema.validate(data);
};

module.exports = { User, validate };
