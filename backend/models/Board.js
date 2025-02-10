// models/Board.js
const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'My Kanban Board',
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List'
  }],
}, { timestamps: true });

const boardModel = mongoose.model('Board', BoardSchema);

module.exports = {
    boardModel
}