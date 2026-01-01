const { Review, Booking, User, Client, Room } = require("../models");

// Create a review (only after completed booking)
exports.createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;
    const userId = req.user.userId;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Find the booking
    const booking = await Booking.findOne({
      where: { id: bookingId, customerId: userId },
      include: [{ model: Room, as: "room" }],
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if booking is completed (approved and date has passed)
    if (booking.status !== "approved") {
      return res.status(400).json({ 
        message: "You can only review after your booking is approved" 
      });
    }

    // Check if booking date has passed
    const bookingDate = new Date(booking.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (bookingDate > today) {
      return res.status(400).json({ 
        message: "You can only review after your booking date has passed" 
      });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({ where: { bookingId } });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this booking" });
    }

    // Create the review
    const review = await Review.create({
      userId,
      clientId: booking.room.clientId,
      bookingId,
      rating,
      comment: comment || null,
    });

    res.status(201).json({ 
      message: "Review submitted successfully", 
      review 
    });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get reviews for a study house (client)
exports.getClientReviews = async (req, res) => {
  try {
    const { clientId } = req.params;

    const reviews = await Review.findAll({
      where: { clientId },
      include: [
        { 
          model: User, 
          as: "user", 
          attributes: ["id", "username"] 
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

    res.json({
      reviews,
      averageRating: parseFloat(averageRating),
      totalReviews: reviews.length,
    });
  } catch (error) {
    console.error("Get client reviews error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get user's reviews
exports.getUserReviews = async (req, res) => {
  try {
    const userId = req.user.userId;

    const reviews = await Review.findAll({
      where: { userId },
      include: [
        {
          model: Client,
          as: "client",
          include: [{ model: User, as: "user", attributes: ["username"] }],
        },
        {
          model: Booking,
          as: "booking",
          include: [{ model: Room, as: "room", attributes: ["name"] }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(reviews);
  } catch (error) {
    console.error("Get user reviews error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Check if user can review a booking
exports.canReviewBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.userId;

    const booking = await Booking.findOne({
      where: { id: bookingId, customerId: userId },
    });

    if (!booking) {
      return res.json({ canReview: false, reason: "Booking not found" });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({ where: { bookingId } });
    if (existingReview) {
      return res.json({ canReview: false, reason: "Already reviewed", review: existingReview });
    }

    // Check if booking is approved
    if (booking.status !== "approved") {
      return res.json({ canReview: false, reason: "Booking not approved yet" });
    }

    // Check if booking date has passed
    const bookingDate = new Date(booking.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (bookingDate > today) {
      return res.json({ canReview: false, reason: "Booking date has not passed yet" });
    }

    res.json({ canReview: true });
  } catch (error) {
    console.error("Can review booking error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.userId;

    const review = await Review.findOne({ where: { id, userId } });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Validate rating
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    await review.update({
      rating: rating || review.rating,
      comment: comment !== undefined ? comment : review.comment,
    });

    res.json({ message: "Review updated successfully", review });
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const review = await Review.findOne({ where: { id, userId } });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await review.destroy();
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ error: error.message });
  }
};
