const express = require('express');
const cardController = require('../controllers/cardController');

const router = express.Router();

router.route('/').get(cardController.getCards);
router.route('/').post(cardController.addCard);
router.route('/patch-card/:id').patch(cardController.patchCard);
router.route('/delete-card/:id').delete(cardController.deleteCard);

module.exports = router;
