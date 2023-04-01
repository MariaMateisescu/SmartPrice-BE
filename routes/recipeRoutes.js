const express = require('express');
const recipeController = require('../controllers/recipeController');

const router = express.Router();

router.route('/savedRecipes').get(recipeController.getSavedRecipes);
router.route('/unsave/:recipeId').patch(recipeController.unsaveRecipe);
router.route('/save/:recipeId').patch(recipeController.saveRecipe);
module.exports = router;
