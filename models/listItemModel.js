const mongoose = require('mongoose');

const listItemSchema = new mongoose.Schema({
  item: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'bought', 'not_bought'],
    default: 'pending',
  },
});

const ListItem = mongoose.model('ListItem', listItemSchema);

module.exports = ListItem;
