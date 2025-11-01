import { useLocation, useNavigate } from "react-router-dom";
import "./Payment.scss";

const Payment = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const room = state?.room || {};
  const { selectedDate, checkIn, checkOut } = state;
  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handlePayment = () => {
    navigate("/mybookings");
  };
  return (
    <div className="payment-page">
      <div className="payment-title">Payment Details</div>
      <div>
        <div className="payment-side-title">Booking Sumamry </div>
        <div className="payment-room-details">
          <div className="payment-smaller-details">
            <span>Room Type:</span>
            <span>{room.roomType}</span>
          </div>
          <div className="payment-smaller-details">
            <span>Date:</span>
            <span>{formattedDate}</span>
          </div>
        </div>
        <div className="payment-room-details">
          <div className="payment-smaller-details">
            <span>Time:</span>
            <span>
              {checkIn}-{checkOut}
            </span>
          </div>
          <div className="payment-smaller-details">
            <span>Total cost:</span>
            <span>{room.basePrice}</span>
          </div>
        </div>

        <div className="payment-side-title">Payment methods</div>
        <div className="payment-method">
          <button className="payment-button">CreditCard</button>
          <button className="payment-button">CliQ</button>
          <button className="payment-button">Paypal</button>
        </div>
        <form className="payment-form">
          <div className="payment-card-input">
            <label>CardNumber</label>
            <input type="text" placeholder="Enter card number" />
          </div>
          <div className="payment-labels-inner">
            <div className="payment-card-input">
              <label>Expiry Date</label>
              <input type="text" placeholder="MM/YY" />
            </div>
            <div className="payment-card-input">
              <label>CVV</label>
              <input type="text" placeholder="CVV" />
            </div>
          </div>
          <div className="payment-card-input">
            <label>Name on Card</label>
            <input type="number" placeholder="Enter name one card" />
          </div>
          <button onClick={handlePayment}>Confirm payment</button>
        </form>
      </div>
    </div>
  );
};
export default Payment;
