import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar.jsx";

const Layout = () => {
  const location = useLocation();

  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
      {location.pathname === "/signin" || location.pathname === "/signup" ? (
        <></>
      ) : (
        <div class="last-section">
          <div className="last-section-content">
            <img src="logo.png" width="100px" className="logo" />
            <div className="toho">
              <span>About us</span>
              <span>Privacy policy</span>
              <span>Terms of use</span>
            </div>
            <div className="social-media">
              <div className="social simage1"></div>
              <div className="social simage2"></div>
              <div className="social simage3"></div>
              <div className="social simage4"></div>
            </div>
          </div>
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              class="shape-fill"
            ></path>
          </svg>
        </div>
      )}
    </>
  );
};
export default Layout;
