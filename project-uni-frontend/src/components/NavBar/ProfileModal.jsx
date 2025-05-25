import { useState, useRef, useEffect } from "react";
import "./ProfileModal.scss";
import useLogout from "../../hooks/useLogout";
import useAuthStore from "../../useStore";
import { Link } from "react-router-dom";

const ProfileModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const { user } = useAuthStore();
  const logout = useLogout();
  return (
    <div className="profile-container" ref={modalRef}>
      <button
        className="profile-image-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Profile menu"
      >
        <img src="/profile.svg" alt="Profile" className="profile-image" />
      </button>

      {isOpen && (
        <div className="profile-modal">
          <div className="profile-modal-header">
            <div className="profile-info">
              <h4>{user.username}</h4>
            </div>
          </div>

          <div className="profile-modal-menu">
            <Link to="/profile" className="modal-menu-item">
              My Profile
            </Link>
            <Link to="/mybookings" className="modal-menu-item">
              My Bookings
            </Link>
            <button className="modal-menu-item" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileModal;
