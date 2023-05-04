const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const ShoppingList = require('../models/shoppingListModel');
const ListItem = require('../models/listItemModel');
const Product = require('../models/productModel');
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
    isRecipe: req.body.isRecipe,
  });
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const user = await User.updateOne(
    { _id: decoded.id },
    { $push: { shoppingLists: newShoppingList._id } }
  );

  res.status(200).json({
    user,
    newListId: newShoppingList._id,
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

exports.getActiveShoppingList = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  const list = await ShoppingList.find({
    _id: { $in: user.shoppingLists },
    status: 'active',
  });

  res.status(200).json({
    status: 'success',
    data: {
      list: list,
    },
  });
});

exports.getCategoryStatistics = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  const lists = await ShoppingList.find({
    _id: { $in: user.shoppingLists },
    status: 'completed',
    isRecipe: { $eq: 0 },
  });
  let mergedListItems = [];
  lists.forEach((list) => mergedListItems.push(...list.listItems));
  let filteredMergedListItems = mergedListItems.filter(
    (item) => item.status === 'bought'
  );

  const map = new Map();
  filteredMergedListItems.forEach((item) => {
    if (map.has(item.item)) {
      const number = map.get(item.item) + 1;
      map.set(item.item, number);
    } else {
      map.set(item.item, 1);
    }
  });

  let categoryStatistics = [];
  await (async () => {
    for await (const entry of Array.from(map.entries())) {
      const product = await Product.findOne({
        name: entry[0],
      });
      categoryStatistics.push({
        category: product.category.name,
        freq: entry[1],
      });
    }
  })();
  const categoryFreqSum = {};

  for (let i = 0; i < categoryStatistics.length; i++) {
    const category = categoryStatistics[i].category;
    const freq = categoryStatistics[i].freq;
    if (category in categoryFreqSum) {
      categoryFreqSum[category] += freq;
    } else {
      categoryFreqSum[category] = freq;
    }
  }

  const sortedCategoryFreqSum = Object.fromEntries(
    Object.entries(categoryFreqSum).sort((a, b) => b[1] - a[1])
  );

  const entries = Object.entries(sortedCategoryFreqSum);

  let leastFrequentEntries;
  let othersFreqSum;
  let compressedCategoryFreqSum;
  if (entries.length > 6) {
    leastFrequentEntries = entries.slice(-(entries.length - 5));
    othersFreqSum = leastFrequentEntries.reduce(
      (acc, [_, freq]) => acc + freq,
      0
    );
    const remainingEntries = entries.slice(0, -(entries.length - 5));

    compressedCategoryFreqSum = Object.fromEntries([
      ...remainingEntries,
      ['Others', othersFreqSum],
    ]);
  } else {
    compressedCategoryFreqSum = Object.fromEntries(entries);
  }

  console.log(compressedCategoryFreqSum);

  res.status(200).json({
    status: 'success',
    data: {
      compressedCategoryFreqSum,
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

exports.deleteShoppingList = catchAsync(async (req, res, next) => {
  const list = await ShoppingList.findByIdAndDelete(req.params.id);

  const itemIDsToDelete = list.listItems.map((it) => it._id);
  const itemsToDelete = await ListItem.deleteMany({
    _id: { $in: itemIDsToDelete },
  });

  if (!list) {
    return next(new AppError('No list with that ID', 404));
  }

  res.json({
    status: 'success',
    data: null,
  });
});

exports.endShoppingList = catchAsync(async (req, res, next) => {
  const list = await ShoppingList.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
      timeEnded: req.body.timeEnded,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!list) {
    return next(new AppError('No list found with that ID', 404));
  }
  const boughtItems = await ListItem.updateMany(
    { item: { $in: req.body.boughtItems }, _id: { $in: list.listItems } },
    { $set: { status: 'bought' } }
  );
  const notBoughtItems = await ListItem.updateMany(
    { item: { $nin: req.body.boughtItems }, _id: { $in: list.listItems } },
    { $set: { status: 'not_bought' } }
  );

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
