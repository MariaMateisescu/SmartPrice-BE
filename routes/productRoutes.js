const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router
  .route('/')
  .get(productController.getAllProducts)
  .post(productController.createProduct);

router.route('/:id').patch(productController.updateProduct);

router.route('/:id/:locationId').delete(productController.deleteProduct);

router.route('/get-unique-names').get(productController.getUniqueProductNames);
router
  .route('/get-unique-names/:id')
  .get(productController.getUniqueNamesInOneCategory);
module.exports = router;
