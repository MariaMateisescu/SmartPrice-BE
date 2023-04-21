const express = require('express');
const shoppingListController = require('../controllers/shoppingListController');

const router = express.Router();

router
  .route('/create-shopping-list')
  .post(shoppingListController.createShoppingList);

router
  .route('/get-shopping-lists')
  .get(shoppingListController.getShoppingLists);

router
  .route('/get-shopping-lists/:id')
  .get(shoppingListController.getOneShoppingList);

router
  .route('/patch-shopping-list/:id')
  .patch(shoppingListController.patchShoppingList);

router
  .route('/delete-shopping-list/:id')
  .delete(shoppingListController.deleteShoppingList);

router
  .route('/end-shopping-list/:id')
  .patch(shoppingListController.endShoppingList);

router.route('/create-list-item').post(shoppingListController.createListItem);

module.exports = router;
