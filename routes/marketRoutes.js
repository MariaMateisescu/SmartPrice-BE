const express = require('express');
const marketController = require('../controllers/marketController');
const upload = require('../middlewares/upload-photo');
const router = express.Router();

router
  .route('/')
  .get(marketController.getAllMarkets)
  .post(upload.single('logo'), marketController.createMarket);

router
  .route('/:id')
  .get(marketController.getOneMarket)
  .delete(marketController.deleteMarket)
  .patch(marketController.updateMarket);

module.exports = router;
