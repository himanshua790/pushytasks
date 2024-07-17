// models/task.js
const mongoose = require('mongoose');
const Joi = require('joi');

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taskTitle: { type: String, required: true },
  taskDetail: { type: String, required: true },
  taskDeadline: { type: Date, required: true },
  reward: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'draft', 'completed'], required: true },
});

const Task = mongoose.model('Task', taskSchema);

const validateTask = (task) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    taskTitle: Joi.string().required(),
    taskDetail: Joi.string().required(),
    taskDeadline: Joi.date().required(),
    reward: Joi.number().required(),
    status: Joi.string().valid('pending', 'draft', 'completed').required(),
  });
  return schema.validate(task);
};

module.exports = { Task, validateTask };
