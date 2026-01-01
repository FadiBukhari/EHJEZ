const express = require("express");
const {
  createReview,
  getClientReviews,
  getUserReviews,
  canReviewBooking,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const authenticateToken = require("../middlewares/authenticateToken");
const authorizeUser = require("../middlewares/authorizeUser");

const router = express.Router();

// Create a review (users only)
router.post("/", authenticateToken, authorizeUser, createReview);

// Get reviews for a study house (public)
router.get("/client/:clientId", getClientReviews);

// Get user's own reviews
router.get("/my", authenticateToken, authorizeUser, getUserReviews);

// Check if user can review a booking
router.get("/can-review/:bookingId", authenticateToken, authorizeUser, canReviewBooking);

// Update a review
router.put("/:id", authenticateToken, authorizeUser, updateReview);

// Delete a review
router.delete("/:id", authenticateToken, authorizeUser, deleteReview);

module.exports = router;
