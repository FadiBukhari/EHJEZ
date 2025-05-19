import { Link, useNavigate } from "react-router-dom";
import "./NavBar.scss";

const NavBar = () => {
  const navigate = useNavigate();
  const handleSignip = () => {
    navigate("/signin");
  };
  const handleHome = () => {
    navigate("/");
  };
  return (
    <div className="navbar">
      <img
        src="logo.png"
        width="100px"
        className="nav-logo"
        onClick={handleHome}
      />
      <div className="navbar-links">
        <Link className="link">Contact us</Link>
        <Link to="/booking" className="link selected">
          Booking
        </Link>
        <button onClick={handleSignip}>SignUp</button>
      </div>
    </div>
  );
};
export default NavBar;
