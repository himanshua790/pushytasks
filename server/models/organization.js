// models/task.js
const mongoose = require("mongoose");
const Joi = require("joi");

const orgSchema = new mongoose.Schema({
  name: { type: String, required: true },
  channel: { type: String },
});

const Org = mongoose.model("Org", orgSchema);

const validateOrg = (org) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    channel: Joi.string(),
  });
  return schema.validate(org);
};

module.exports = { Org, validateOrg };
