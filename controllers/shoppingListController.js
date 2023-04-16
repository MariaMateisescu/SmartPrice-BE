const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const ShoppingList = require('../models/shoppingListModel');
const ListItem = require('../models/listItemModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

exports.createShoppingList = catchAsync(async (req, res, next) => {
  const savedListItems = [];
  for (const product of req.body.selectedProducts) {
    const res = await ListItem.create({
      item: product,
    });
    savedListItems.push(res._id);
  }
  console.log(savedListItems);
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  const newShoppingList = await ShoppingList.create({
    name: req.body.name,
    listItems: savedListItems,
  });
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const user = await User.updateOne(
    { _id: decoded.id },
    { $push: { shoppingLists: newShoppingList._id } }
  );

  res.status(200).json({
    user,
    status: 'success',
  });
});

exports.getShoppingLists = catchAsync(async (req, res, next) => {
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
    shoppingLists: user.shoppingLists,
    status: 'success',
  });
});

exports.getOneShoppingList = catchAsync(async (req, res, next) => {
  const list = await ShoppingList.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      list: list,
    },
  });
});

exports.patchShoppingList = catchAsync(async (req, res, next) => {
  const list = await ShoppingList.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  console.log(req.body);
  if (!list) {
    return next(new AppError('No list found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      list: list,
    },
  });
});

exports.createListItem = catchAsync(async (req, res, next) => {
  const newListItem = await ListItem.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      listItem: newListItem,
    },
  });
});
