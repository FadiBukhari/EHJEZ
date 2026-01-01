import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import NavBar from "./NavBar.jsx";
import ChatWidget from "../ChatWidget";
import "./Footer.scss";

const Layout = () => {
  const location = useLocation();

  // Scroll to top whenever the route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
      <ChatWidget />
      {location.pathname === "/signin" || location.pathname === "/signup" ? (
        <></>
      ) : (
        <footer className="footer-section">
          <svg
            className="footer-wave"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="shape-fill"
            ></path>
          </svg>
          <div className="footer-content">
            <div className="footer-column footer-brand">
              <img src="/logo.png" alt="EHJEZ Logo" className="footer-logo" />
              <p className="footer-description">
                Your trusted platform for room booking and management.
              </p>
            </div>

            <div className="footer-column">
              <h3 className="footer-title">Company</h3>
              <ul className="footer-links">
                <li>
                  <a href="#about">About Us</a>
                </li>
                <li>
                  <a href="#privacy">Privacy Policy</a>
                </li>
                <li>
                  <a href="#terms">Terms of Use</a>
                </li>
                <li>
                  <a href="#contact">Contact</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-title">Quick Links</h3>
              <ul className="footer-links">
                <li>
                  <a href="/booking">Browse Rooms</a>
                </li>
                <li>
                  <a href="/joinus">Join Us</a>
                </li>
                <li>
                  <a href="/contactus">Contact Us</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-title">Connect With Us</h3>
              <div className="social-media">
                <a
                  href="#facebook"
                  className="social simage1"
                  aria-label="Facebook"
                ></a>
                <a
                  href="#twitter"
                  className="social simage2"
                  aria-label="Twitter"
                ></a>
                <a
                  href="#instagram"
                  className="social simage3"
                  aria-label="Instagram"
                ></a>
                <a
                  href="#linkedin"
                  className="social simage4"
                  aria-label="LinkedIn"
                ></a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} EHJEZ. All rights reserved.</p>
          </div>
        </footer>
      )}
    </>
  );
};
export default Layout;
