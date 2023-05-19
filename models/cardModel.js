const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  code: {
    type: String,
  },
  format: {
    type: String,
  },
  name: {
    type: String,
  },
  color: {
    type: String,
  },
});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
