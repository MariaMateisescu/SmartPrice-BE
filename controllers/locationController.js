const Location = require('../models/locationModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllLocations = catchAsync(async (req, res, next) => {
  const locations = await Location.find();

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: locations.length,
    data: {
      locations,
    },
  });
});

exports.getOneLocation = catchAsync(async (req, res, next) => {
  const location = await Location.findById(req.params.id);
  console.log(req);

  res.status(200).json({
    status: 'success',
    data: {
      location: location,
    },
  });
});

exports.createLocation = catchAsync(async (req, res, next) => {
  const newLocation = await Location.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      location: newLocation,
    },
  });
});

exports.deleteLocation = catchAsync(async (req, res, next) => {
  const location = await Location.findByIdAndDelete(req.params.id);

  if (!location) {
    return next(new AppError('No location with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateLocation = catchAsync(async (req, res, next) => {
  const location = await Location.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!location) {
    return next(new AppError('No location found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: location,
    },
  });
});
