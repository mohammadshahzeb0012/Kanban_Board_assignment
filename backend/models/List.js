const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board',
    required: true,
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
}, { timestamps: true });

const listModel = module.exports = mongoose.model('List', ListSchema);

module.exports = {
    listModel
}