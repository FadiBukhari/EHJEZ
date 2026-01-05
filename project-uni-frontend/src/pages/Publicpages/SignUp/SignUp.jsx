import { useNavigate } from "react-router-dom";
import "./SignUp.scss";
import { useState } from "react";
import API from "../../../services/api";
import { toast } from "react-toastify";

const SignUp = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.password !== confirmPassword) {
        return toast.error("Passwords do not match");
      }
      if (form.password.length < 6) {
        return toast.error("Password must be at least 6 characters");
      }
      if (!/^\d{10}$/.test(form.phoneNumber)) {
        return toast.error("Phone number must be exactly 10 digits");
      }
      // All public registrations are users only
      await API.post("users/register", { ...form, role: "user" });
      toast.success("Registration successful! Please sign in.");
      navigate("/signin");
    } catch (err) {
      console.error("Register failed", err); // Shown via interceptor
    }
  };
  const handleSignin = () => {
    navigate("/signin");
  };
  return (
    <>
      <div className="signup-container">
        <img src="/logo.png" width="80px" className="logo" />
        <form className="signup-form" onSubmit={handleSubmit}>
          <label>Display name</label>
          <input
            type="text"
            className="input-form"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <label>Email</label>
          <input
            type="email"
            className="input-form"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>

          <input
            type="password"
            className="input-form"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <label>Confirm Password</label>
          <input
            type="password"
            className="input-form"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <label>Phone Number</label>
          <input
            type="tel"
            className="input-form"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={(e) => {
              const value = e.target.value;
              // Only allow digits and max length of 10
              if (/^\d*$/.test(value) && value.length <= 10) {
                setForm({ ...form, phoneNumber: value });
              }
            }}
            pattern="\d{10}"
            maxLength="10"
            title="Phone number must be exactly 10 digits"
            required
          />

          <button type="submit">Create account</button>

          <div className="have-account">
            <p
              style={{
                textAlign: "center",
                opacity: 0.5,
                marginTop: "15px",
                marginBottom: "15px",
              }}
            >
              Already have an account?
            </p>
            <p
              style={{
                textAlign: "center",
                fontSize: "18px",
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
