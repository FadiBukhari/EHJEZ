import { Link, useLocation, useNavigate } from "react-router-dom";
import "./NavBar.scss";
import useAuthStore from "../../useStore";
import ProfileModal from "./ProfileModal";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  console.log("User in NavBar:", user);
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
              to="/contactus"
              className={`link ${
                location.pathname === "/contactus" ? "selected" : ""
              }`}
            >
              Contact us
            </Link>
            <Link
              to="/booking"
              className={`link ${
                location.pathname === "/booking" ? "selected" : ""
              }`}
            >
              Booking
            </Link>
            <Link
              to="/joinus"
              className={`link ${
                location.pathname === "/joinus" ? "selected" : ""
              }`}
            >
              Join Us
            </Link>
          </>
        )}
        {user?.role == "admin" && (
          <Link
            to="/admin/rooms"
            className={`link ${
              location.pathname === "/admin/rooms" ? "selected" : ""
            }`}
          >
            Rooms
          </Link>
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
