const Card = require('../models/cardModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

exports.addCard = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //   const user = await User.findById(decoded.id);
  console.log(decoded);
  const newCard = await Card.create(req.body);
  await User.findByIdAndUpdate(decoded.id, {
    $push: { fidelityCards: newCard._id },
  });

  console.log(newCard);

  res.status(200).json({
    status: 'success',
  });
});

exports.getCards = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  const cards = user.fidelityCards;

  res.status(200).json({
    cards,
    status: 'success',
  });
});

exports.patchCard = catchAsync(async (req, res, next) => {
  console.log(req.params.id, req.body);
  const card = await Card.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    card,
    status: 'success',
  });
});

exports.deleteCard = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // remove card id from User's list
  await User.updateOne(
    { _id: decoded.id },
    { $pull: { fidelityCards: req.params.id } }
  );

  // remove card
  await Card.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
  });
});
