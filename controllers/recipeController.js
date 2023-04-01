const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

exports.getSavedRecipes = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  res.status(200).json({
    savedRecipes: user.savedRecipes,
    status: 'success',
  });
});

exports.saveRecipe = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const user = await User.updateOne(
    { _id: decoded.id },
    { $push: { savedRecipes: req.params.recipeId } }
  );

  res.status(200).json({
    user: user,
    status: 'success',
  });
});

exports.unsaveRecipe = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const user = await User.updateOne(
    { _id: decoded.id },
    { $pull: { savedRecipes: req.params.recipeId } }
  );
  res.status(200).json({
    user: user,
    status: 'success',
  });
});
