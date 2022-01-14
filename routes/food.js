const express = require('express');
const router = express.Router();

const foodController = require('../controllers/foodController')
const errors = require('../middlewares/errors')
const jwtAuth = require('../middlewares/auth')
// GET /food/:id
router.get('/:id', errors.catchAsync(foodController.findOne))

// GET /food/
router.get('/',jwtAuth, errors.catchAsync(foodController.findAll))

// POST /food/
router.post('/', errors.catchAsync(foodController.create))

// PUT /food/
router.put('/', errors.catchAsync(foodController.update))

// DELETE /food/:slug
router.delete('/:slug', errors.catchAsync(foodController.remove))

module.exports = router;