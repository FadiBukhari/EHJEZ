import { Link, useNavigate } from "react-router-dom";
import "./CSS/NavBar.scss";

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
        <button onClick={handleSignip}>SignUp</button>
        {/**
         
         <Link>Home</Link>
         <Link>Contact us</Link>
         <Link>Booking</Link>
         
         
         */}
      </div>
    </div>
  );
};
export default NavBar;
