const Market = require('../models/marketModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllMarkets = catchAsync(async (req, res, next) => {
  const markets = await Market.find();

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: markets.length,
    data: {
      markets,
    },
  });
});

exports.getOneMarket = catchAsync(async (req, res, next) => {
  const market = await Market.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      market: market,
    },
  });
});

exports.createMarket = catchAsync(async (req, res, next) => {
  // const newMarket = await Market.create(req.body);
  let newMarket = new Market();
  newMarket.name = req.body.name;
  newMarket.locations = [];
  newMarket.logo = req.file.location;

  newMarket.save();

  res.status(200).json({
    status: 'success',
    data: {
      market: newMarket,
    },
  });
});

exports.deleteMarket = catchAsync(async (req, res, next) => {
  const market = await Market.findByIdAndDelete(req.params.id);

  if (!market) {
    return next(new AppError('No market with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateMarket = catchAsync(async (req, res, next) => {
  const updateData = {};
  if (req.body.name) updateData.name = req.body.name;
  if (req.body.locations) updateData.locations = req.body.locations;
  if (req.file && req.file.location) updateData.logo = req.file.location;
  const market = await Market.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!market) {
    return next(new AppError('No market found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: market,
    },
  });
});
