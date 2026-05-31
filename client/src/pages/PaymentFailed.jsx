import React from "react";
import { Link } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

const PaymentFailed = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full text-center border border-gray-100">

        <FaTimesCircle className="text-red-500 text-7xl mx-auto mb-6 drop-shadow-lg" />

        <h1 className="text-4xl font-black text-gray-900 mb-4">
          Booking Failed
        </h1>

        <p className="text-gray-500 text-lg mb-8">
          We couldn't process your booking request. Please try again later.
        </p>

        <div className="space-y-4">
          <Link
            to="/"
            className="block w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition"
          >
            Return to Events
          </Link>

          <Link
            to="/dashboard"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-3 rounded-xl transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;