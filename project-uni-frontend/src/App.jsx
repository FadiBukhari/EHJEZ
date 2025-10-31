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
import Rooms from "./pages/Clientpages/Rooms/Rooms";
import AddRoom from "./pages/Clientpages/AddRoom/AddRoom";
import BookRoom from "./pages/Userpages/BookRoom/BookRoom";
import MyBookings from "./pages/Userpages/MyBookings/MyBookings";
import Payment from "./pages/Userpages/Payment/Payment";
import EditRoom from "./pages/Clientpages/EditRoom/EditRoom";
import Bookings from "./pages/Clientpages/Bookings/Bookings";
import ApproveBookings from "./pages/Clientpages/ApproveBookings/ApproveBookings";
import ClientDashboard from "./pages/Clientpages/Dashboard/Dashboard";
import Dashboard from "./pages/Adminpages/Dashboard/Dashboard";
import Clients from "./pages/Adminpages/Clients/Clients";
import AddClient from "./pages/Adminpages/Clients/AddClient";
import EditClient from "./pages/Adminpages/Clients/EditClient";
import StudyHouseMap from "./pages/Userpages/StudyHouseMap/StudyHouseMap";
import useAuthInit from "./hooks/useAuthInit";

function App() {
  // Initialize authentication from HTTP-only cookie on app load
  useAuthInit();

  return (
    <>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/map" element={<StudyHouseMap />} />
            <Route path="/contactus" element={<Contactus />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/joinus" element={<JoinUs />} />
            <Route path="/book/:id" element={<BookRoom />} />
            <Route path="/payment/:id" element={<Payment />} />
            <Route path="/mybookings" element={<MyBookings />} />
            <Route path="/client/rooms" element={<Rooms />} />
            <Route path="/client/rooms/new" element={<AddRoom />} />
            <Route path="/client/rooms/edit/:id" element={<EditRoom />} />{" "}
            <Route path="/client/bookings" element={<Bookings />} />
            <Route
              path="/client/approve-bookings"
              element={<ApproveBookings />}
            />
            <Route path="/client/dashboard" element={<ClientDashboard />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/clients" element={<Clients />} />
            <Route path="/admin/clients/new" element={<AddClient />} />
            <Route path="/admin/clients/:id/edit" element={<EditClient />} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}

export default App;
