import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import Home from "./pages/Home/Home";
import SignIn from "./pages/SignIn/SignIn";

import Layout from "./components/NavBar/Layout";
import SignUp from "./pages/SignUp/SignUp";
import Booking from "./pages/Booking/Booking";
import Contactus from "./pages/Contactus/Contactus";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/contactus" element={<Contactus />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
