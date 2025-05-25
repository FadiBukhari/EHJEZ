import { useNavigate } from "react-router-dom";
import "./Payment.scss";
import API from "../../../services/api";
const Payment = () => {
  // const { id: roomId } = useParams();
  const navigate = useNavigate();
  const handlePayment = () => {
    // try {
    //   API.put(`/bookings/${roomId}/status`, { status: "approved" });
    //   navigate("/mybookings");
    // } catch (error) {
    //   console.error("Error during payment:", error);
    // }
    navigate("/mybookings");
  };
  return (
    <div>
      Hello in payment
      <button onClick={handlePayment}>Pay</button>
    </div>
  );
};
export default Payment;
