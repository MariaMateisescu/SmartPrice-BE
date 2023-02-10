const express = require('express');
const locationController = require('../controllers/locationController');

const router = express.Router();

router
  .route('/')
  .get(locationController.getAllLocations)
  .post(locationController.createLocation);

router
  .route('/:id')
  .get(locationController.getOneLocation)
  .delete(locationController.deleteLocation)
  .patch(locationController.updateLocation);

module.exports = router;
