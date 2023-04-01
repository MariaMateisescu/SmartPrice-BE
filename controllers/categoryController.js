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
  const location = Location.findById;

  // const location = await Location.findById(req.params.locationId);
  // const productsInCategory = await Product.find({ category: req.params.id });
  // const filteredProducts = productsInCategory.filter((...product) =>
  //   location.productsList.includes(product._id)
  // );
  // console.log(location);
  // console.log('---------------');
  // console.log(productsInCategory);
  // console.log(filteredProducts);

  res.status(200).json({
    status: 'success',
    results: filteredProducts.length,
    data: {
      filteredProducts,
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
