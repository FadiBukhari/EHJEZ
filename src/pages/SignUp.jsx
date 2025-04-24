import { useNavigate } from "react-router-dom";
import "./CSS/SignUp.scss";
const SignUp = () => {
  const navigate = useNavigate();
  const handleSignin = () => {
    navigate("/signin");
  };
  return (
    <>
      <div className="signup-container">
        <img src="logo.png" width="80px" className="logo" />
        <form className="signup-form">
          <label>Display name</label>
          <input type="text" className="input-form" />
          <label>Email</label>
          <input type="text" className="input-form" />

          <label>Password</label>

          <input type="password" className="input-form" />
          <label>Confirm Password</label>
          <input type="password" className="input-form" />
          <button type="submit">Create account</button>

          <div className="have-account">
            <p
              style={{
                textAlign: "center",
                opacity: 0.5,
                "margin-top": "15px",
                "margin-bottom": "15px",
              }}
            >
              Already have an account?
            </p>
            <p
              style={{
                textAlign: "center",
                "font-size": "18px",
                cursor: "pointer",
              }}
              onClick={handleSignin}
            >
              SignIn
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
export default SignUp;
