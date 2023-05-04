const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

router
  .route('/')
  .get(categoryController.getAllCategories)
  .post(categoryController.createCategory);

router.route('/:id').get(categoryController.getOneCategory);
router
  .route('/:locationId/:categoryId')
  .get(categoryController.getOneCategoryInLocation);

module.exports = router;
