const mongoose = require("mongoose")
const priorityEnums = Object.freeze(['low', 'medium', 'high'])

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: String },
    priority: { type: String, enum: priorityEnums, required: true},
    list: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true },
});

const taskModel = mongoose.model('Task', TaskSchema);

module.exports = {
    taskModel,
    priorityEnums
}