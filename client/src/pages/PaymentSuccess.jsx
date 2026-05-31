import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const PaymentSuccess = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full text-center border border-gray-100">

        <FaCheckCircle className="text-green-500 text-7xl mx-auto mb-6 drop-shadow-lg" />

        <h1 className="text-4xl font-black text-gray-900 mb-4">
          Booking Successful
        </h1>

        <p className="text-gray-500 text-lg mb-8">
          Your booking request has been submitted successfully.
        </p>

        <div className="space-y-4">
          <Link
            to="/dashboard"
            className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition"
          >
            View My Bookings
          </Link>

          <Link
            to="/"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-3 rounded-xl transition"
          >
            Browse Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;