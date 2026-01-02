import { useState, useEffect } from "react";
import API from "../../../services/api";
import "./Reviews.scss";

const Reviews = () => {
  const [reviewData, setReviewData] = useState({
    reviews: [],
    averageRating: 0,
    totalReviews: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, 5, 4, 3, 2, 1

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await API.get("/reviews/my-reviews");
      setReviewData(res.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`star ${star <= rating ? "filled" : ""}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  const getFilteredReviews = () => {
    if (filter === "all") return reviewData.reviews;
    return reviewData.reviews.filter(
      (review) => review.rating === parseInt(filter)
    );
  };

  const filteredReviews = getFilteredReviews();

  if (loading) {
    return (
      <div className="reviews-page">
        <div className="loading">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="reviews-page">
      <div className="reviews-header">
        <h1>Customer Reviews</h1>
        <p className="subtitle">See what customers are saying about your study house</p>
      </div>

      {/* Rating Overview */}
      <div className="rating-overview">
        <div className="overall-rating">
          <div className="big-rating">{reviewData.averageRating}</div>
          {renderStars(Math.round(reviewData.averageRating))}
          <p className="total-reviews">
            Based on {reviewData.totalReviews} review{reviewData.totalReviews !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="rating-distribution">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = reviewData.distribution[rating] || 0;
            const percentage = reviewData.totalReviews > 0 
              ? (count / reviewData.totalReviews) * 100 
              : 0;
            
            return (
              <div 
                key={rating} 
                className={`distribution-row ${filter === String(rating) ? "active" : ""}`}
                onClick={() => setFilter(filter === String(rating) ? "all" : String(rating))}
              >
                <span className="rating-label">{rating} ★</span>
                <div className="bar-container">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="count">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Info */}
      {filter !== "all" && (
        <div className="filter-info">
          <span>Showing {filter}-star reviews</span>
          <button onClick={() => setFilter("all")}>Clear filter</button>
        </div>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="avatar">
                    {review.user?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="reviewer-details">
                    <h4>{review.user?.username || "Anonymous"}</h4>
                    <span className="review-date">{formatDate(review.createdAt)}</span>
                  </div>
                </div>
                <div className="review-rating">
                  {renderStars(review.rating)}
                </div>
              </div>
              
              {review.booking?.room && (
                <div className="room-info">
                  <span className="room-badge">
                    🚪 Room {review.booking.room.roomNumber} • {review.booking.room.roomType}
                  </span>
                </div>
              )}

              {review.comment && (
                <p className="review-comment">{review.comment}</p>
              )}
            </div>
          ))
        ) : (
          <div className="no-reviews">
            {filter !== "all" ? (
              <>
                <p>No {filter}-star reviews yet</p>
                <button onClick={() => setFilter("all")}>View all reviews</button>
              </>
            ) : (
              <>
                <div className="no-reviews-icon">📝</div>
                <h3>No reviews yet</h3>
                <p>When customers leave reviews, they'll appear here</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
