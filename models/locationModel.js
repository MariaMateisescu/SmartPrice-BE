const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: [true, 'Please isnert location'],
  },
  address: {
    type: String,
    // required: [true, 'Please provide your email'],
  },
  openingHours: {
    type: String,
  },
  coordinates: [Number],
  productsList: [{ type: mongoose.Schema.ObjectId, ref: 'Product' }],
});
locationSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'productsList',
    select: '-__v',
  });
  next();
});
const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
