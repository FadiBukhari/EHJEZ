import { useEffect } from "react";
import "./AlertModal.scss";

const AlertModal = ({ isOpen, onClose, title, message, type = "info" }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      case "info":
      default:
        return "ⓘ";
    }
  };

  return (
    <div className="alert-modal-overlay" onClick={onClose}>
      <div className="alert-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className={`alert-modal-header ${type}`}>
          <div className="alert-icon">{getIcon()}</div>
          <h2>{title}</h2>
        </div>
        <div className="alert-modal-body">
          <p>{message}</p>
        </div>
        <div className="alert-modal-footer">
          <button className={`modal-btn ok-btn ${type}`} onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
