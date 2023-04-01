const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please insert name'],
  },
  category: { type: mongoose.Schema.ObjectId, ref: 'Category' },
  brand: {
    type: String,
  },
  weight: {
    type: String,
  },
  price: {
    type: Number,
  },
  quantity: {
    type: Number,
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
