import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
 import Register from "./pages/Register";
 import EventDetail from "./pages/EventDetail";

 import UserDashboard from "./pages/UserDashboard";
 import AdminDashboard from "./pages/AdminDashboard";
 import PaymentSuccess from "./pages/PaymentSuccess";
 import PaymentFailed from "./pages/PaymentFailed";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/events/:id" element={<EventDetail />} />

       <Route path="/dashboard" element={<UserDashboard />} /> 

        <Route path="/admin" element={<AdminDashboard />} />

         <Route path="/payment-success" element={<PaymentSuccess />} />

        <Route path="/payment-failed" element={<PaymentFailed />} /> 
      </Routes>
    </Router>
  );
}

export default App;
