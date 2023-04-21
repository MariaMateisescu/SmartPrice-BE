const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please insert a category name'],
  },
  icon: {
    type: String,
  },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
