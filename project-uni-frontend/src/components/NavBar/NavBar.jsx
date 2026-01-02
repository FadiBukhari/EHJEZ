import { Link, useLocation, useNavigate } from "react-router-dom";
import "./NavBar.scss";
import useAuthStore from "../../useStore";
import ProfileModal from "./ProfileModal";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const handleSignip = () => {
    navigate("/signin");
  };
  const handleHome = () => {
    navigate("/");
  };

  return (
    <div className="navbar">
      <img
        src="/logo.png"
        width="100px"
        className="nav-logo"
        onClick={handleHome}
      />
      <div className="navbar-links">
        {user?.role == "user" && (
          <>
            <Link
              to="/booking"
              className={`link ${
                location.pathname === "/booking" ? "selected" : ""
              }`}
            >
              Booking
            </Link>
            <Link
              to="/map"
              className={`link ${
                location.pathname === "/map" ? "selected" : ""
              }`}
            >
              📍 Find Study Houses
            </Link>
          </>
        )}
        {user?.role == "client" && (
          <>
            <Link
              to="/client/dashboard"
              className={`link ${
                location.pathname === "/client/dashboard" ? "selected" : ""
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/client/rooms"
              className={`link ${
                location.pathname === "/client/rooms" ? "selected" : ""
              }`}
            >
              Rooms
            </Link>
            <Link
              to="/client/bookings"
              className={`link ${
                location.pathname === "/client/bookings" ? "selected" : ""
              }`}
            >
              Bookings
            </Link>
            <Link
              to="/client/approve-bookings"
              className={`link ${
                location.pathname === "/client/approve-bookings"
                  ? "selected"
                  : ""
              }`}
            >
              Approve Bookings
            </Link>
            <Link
              to="/client/reviews"
              className={`link ${
                location.pathname === "/client/reviews" ? "selected" : ""
              }`}
            >
              Reviews
            </Link>
          </>
        )}
        {user?.role == "admin" && (
          <>
            <Link
              to="/admin/dashboard"
              className={`link ${
                location.pathname === "/admin/dashboard" ? "selected" : ""
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/admin/clients"
              className={`link ${
                location.pathname === "/admin/clients" ? "selected" : ""
              }`}
            >
              Clients
            </Link>
          </>
        )}
        {!user?.username ? (
          <button onClick={handleSignip}>SignUp</button>
        ) : (
          <ProfileModal />
        )}
      </div>
    </div>
  );
};
export default NavBar;
