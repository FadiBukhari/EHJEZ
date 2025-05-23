import { useNavigate } from "react-router-dom";
import "./SignIn.scss";
const SignIn = () => {
  const navigate = useNavigate();
  const handleSignip = () => {
    navigate("/signup");
  };
  return (
    <>
      <div className="signin-container">
        <img src="logo.png" width="80px" className="logo" />
        <form className="signin-form">
          <label>Email</label>
          <input type="text" className="input-form" />

          <div className="password">
            <label>Password</label>
            <p className="forgot-password">Forgot your password?</p>
          </div>
          <input type="password" className="input-form" />
          <button type="submit">Sign In</button>
          <div className="remember-me-container">
            <input type="checkbox" />
            <label className="remember-me">Remember me</label>
          </div>
          <div className="no-account">
            <p
              style={{
                textAlign: "center",
                opacity: 0.5,
                "margin-top": "15px",
                "margin-bottom": "15px",
              }}
            >
              Don't have an account yet?
            </p>
            <p
              style={{
                textAlign: "center",
                "font-size": "18px",
                cursor: "pointer",
              }}
              onClick={handleSignip}
            >
              Create your new account
            </p>
          </div>
        </form>
        <div className="last">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#E4E4FA"
              fill-opacity="1"
              d="M0,0L80,10.7C160,21,320,43,480,85.3C640,128,800,192,960,192C1120,192,1280,128,1360,96L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>
    </>
  );
};
export default SignIn;
