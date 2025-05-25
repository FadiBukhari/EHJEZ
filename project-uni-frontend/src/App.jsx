import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Publicpages/Home/Home";
import SignIn from "./pages/Publicpages/SignIn/SignIn";
import Layout from "./components/NavBar/Layout";
import SignUp from "./pages/Publicpages/SignUp/SignUp";
import Booking from "./pages/Userpages/Booking/Booking";
import Contactus from "./pages/Userpages/Contactus/Contactus";
import Profile from "./pages/Userpages/Profile/Profile";
import JoinUs from "./pages/Userpages/JoinUs/JoinUs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Rooms from "./pages/Adminpages/Rooms/Rooms";
import AddRoom from "./pages/Adminpages/AddRoom/AddRoom";
import BookRoom from "./pages/Userpages/BookRoom/BookRoom";
import MyBookings from "./pages/Userpages/MyBookings/MyBookings";
import Payment from "./pages/Userpages/Payment/Payment";
import EditRoom from "./pages/Adminpages/EditRoom/EditRoom";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/contactus" element={<Contactus />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/joinus" element={<JoinUs />} />
            <Route path="/book/:id" element={<BookRoom />} />
            <Route path="/payment/:id" element={<Payment />} />
            <Route path="/mybookings" element={<MyBookings />} />
            <Route path="/admin/rooms" element={<Rooms />} />
            <Route path="/admin/rooms/new" element={<AddRoom />} />{" "}
            <Route path="/admins/rooms/edit/:id" element={<EditRoom />} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}

export default App;
