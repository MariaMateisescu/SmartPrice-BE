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
  coordinates: {
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
  },
  coordinatesGeoJSON: {
    // GeoJSON
    type: {
      type: String,
      default: 'Point',
      enum: ['Point'],
    },
    coordinates: [Number],
    address: String,
    description: String,
  },
  productsList: [{ type: mongoose.Schema.ObjectId, ref: 'Product' }],
});

locationSchema.index({ coordinatesGeoJSON: '2dsphere' });

locationSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'productsList',
    select: '-__v',
    populate: {
      path: 'category',
      select: '-__v',
    },
  });
  next();
});
const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
