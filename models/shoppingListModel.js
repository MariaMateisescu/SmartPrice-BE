const mongoose = require('mongoose');

const shoppingListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please insert name'],
    default: new Date().toLocaleDateString('fr-FR'),
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'active'],
    default: 'pending',
  },
  listItems: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'ListItem',
    },
  ],
  timeStarted: { type: Number, default: 0 },
  timeEnded: { type: Number, default: 0 },
});

shoppingListSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'listItems',
    select: '-__v',
  });
  next();
});

const ShoppingList = mongoose.model('ShoppingList', shoppingListSchema);

module.exports = ShoppingList;
