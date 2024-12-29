const express = require('express');
const {
  bookingController,
  resetSeatsController,
  getSeats,
  getBookedSeats,
} = require('../controllers/seatController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = express.Router();

// Book seats - Authenticated users can book seats
router.post('/book', authMiddleware, bookingController);

// Get all seats - Any user (if needed) can view all available seats
router.get('/seats', getSeats);

// Get booked seats for a specific user - Only authenticated user can check their booked seats
router.get('/booked-seats/:user_id', authMiddleware, getBookedSeats);

// Reset all seats - Admin only
router.post('/reset', authMiddleware, adminMiddleware, resetSeatsController);

module.exports = router;
