import { useNavigate } from "react-router-dom";
import "./SignIn.scss";
import useAuthStore from "../../../useStore";
import { useState } from "react";
import API from "../../../services/api.js";

const SignIn = () => {
  const navigate = useNavigate();
  const handleSignin = () => {
    navigate("/signup");
  };
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuthStore();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/users/login", form);
      login(res.data.user, res.data.token);
      localStorage.setItem("token", res.data.token);

      navigate("/");
    } catch (err) {
      console.error("Login failed", err); // Error is shown via interceptor
    }
  };
  return (
    <>
      <div className="signin-container">
        <img src="/logo.png" width="80px" className="logo" />
        <form className="signin-form" onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            className="input-form"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <div className="password">
            <label>Password</label>
            <p className="forgot-password">Forgot your password?</p>
          </div>
          <input
            type="password"
            className="input-form"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
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
              onClick={handleSignin}
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
