const express = require('express');
const {
    getAllOpenings,
    deleteOpening
} = require('../controllers/openings');
const { authenticate, isBusinessOwner } = require('../middlewares/auth');

const router = express.Router();

// Get All Openings
router.get('/', authenticate, getAllOpenings);

// Delete Opening
router.delete('/:id', authenticate, deleteOpening);

module.exports = router;
