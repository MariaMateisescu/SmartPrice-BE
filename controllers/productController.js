const Product = require('../models/productModel');
const Location = require('../models/locationModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find();

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products,
    },
  });
});

exports.getUniqueProductNames = catchAsync(async (req, res, next) => {
  const productNames = await Product.distinct('name');
  console.log(productNames);

  res.status(200).json({
    status: 'success',
    data: {
      productNames,
    },
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body);
  const records = await Location.find({
    _id: { $in: req.body.selectedLocations },
  });
  console.log(records);
  console.log(req.body.selectedLocations);
  records.forEach((loc) => {
    Location.findOneAndUpdate(
      { _id: loc._id },
      { $push: { productsList: newProduct._id } },
      function (error, success) {
        if (error) {
          console.log(error);
        } else {
          console.log(success);
        }
      }
    );
  });
  res.status(200).json({
    status: 'success',
    data: {
      product: newProduct,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const location = await Location.updateOne(
    { _id: req.params.locationId },
    { $pull: { productsList: req.params.id } }
  );
  if (!location) {
    return next(new AppError('No product with that ID', 404));
  }

  res.json({
    status: 'success',
    data: null,
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: product,
    },
  });
});
