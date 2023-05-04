const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const Location = require('../models/locationModel');

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find();

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: {
      categories,
    },
  });
});

exports.getOneCategory = catchAsync(async (req, res, next) => {
  const productsInCategory = await Product.find({ category: req.params.id });
  const category = await Category.findById(req.params.id);

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: productsInCategory.length,
    data: {
      productsInCategory,
      category,
    },
  });
});

exports.getOneCategoryInLocation = catchAsync(async (req, res, next) => {
  const location = await Location.findById(req.params.locationId);
  const productsInCategoryInLocation = location.productsList.filter(
    (product) => product.category._id == req.params.categoryId
  );

  res.status(200).json({
    status: 'success',
    results: productsInCategoryInLocation.length,
    data: {
      productsInCategoryInLocation,
    },
  });
});

exports.createCategory = catchAsync(async (req, res, next) => {
  const newCategory = await Category.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      category: newCategory,
    },
  });
});
