const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
});

// Define the Note model with the schema
const Note = mongoose.model('Note', noteSchema);

module.exports = Note;