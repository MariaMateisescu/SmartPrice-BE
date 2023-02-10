const mongoose = require('mongoose');

const marketSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: [true, 'Please isnert location'],
  },
  locations: [{ type: mongoose.Schema.ObjectId, ref: 'Location' }],
  logo: {
    type: String,
  },
});

marketSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'locations',
    select: '-__v',
  });
  next();
});
const Market = mongoose.model('Market', marketSchema);

module.exports = Market;
