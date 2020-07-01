const mongoose = require('mongoose');

const memeSchema = new mongoose.Schema({
  top: {
    type: String
  },
  image: {
    type: String,
    required: true
  },
  bottom: {
    type: String
  }
});

module.exports = mongoose.model('Meme', memeSchema);
