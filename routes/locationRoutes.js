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
  .patch(locationController.updateLocation);

// router
//   .route('/calculate-locations/:shoppingListId')
//   .get(locationController.calculateLocationsForListId);

router
  .route('/calculate-locations/:shoppingListId/within/:radius/center/:latlng')
  .get(locationController.calculateLocationsForListId);

router
  .route('/locations-within/:radius/center/:latlng')
  .get(locationController.getLocationsWithin);

router.route('/:id/:marketId').delete(locationController.deleteLocation);
module.exports = router;
