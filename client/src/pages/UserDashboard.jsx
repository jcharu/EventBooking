import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTicketAlt, FaCircle, FaTimesCircle } from "react-icons/fa";

import api from "../utils/axios";
import { useAuth } from "../context/AuthContext";

const UserDashboard = () => {
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      const { data } = await api.get("/bookings/my");
      setBookings(data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      await api.delete(`/bookings/${bookingId}`);
      setBookings(bookings.filter((booking) => booking._id !== bookingId));
      setMsg("Booking cancelled successfully");
    } catch (err) {
      setError(err.response?.data?.error || "Cancel failed");
    }
  };

  const getInitial = () => {
    return user?.name ? user.name.charAt(0).toUpperCase() : "U";
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-10 flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-black text-gray-900">
            {getInitial()}
          </div>

          <div>
            <h1 className="text-4xl font-black text-gray-900">
              Welcome, {user?.name || "User"}!
            </h1>

            <p className="text-gray-500 mt-2 flex items-center gap-2">
              <FaCircle className="text-green-500 text-xs" />
              User Dashboard
            </p>
          </div>
        </section>

        {msg && (
          <div className="mb-5 bg-green-50 text-green-700 border border-green-100 p-3 rounded-lg text-center font-semibold">
            {msg}
          </div>
        )}

        {error && (
          <div className="mb-5 bg-red-50 text-red-600 border border-red-100 p-3 rounded-lg text-center font-semibold">
            {error}
          </div>
        )}

        <section>
          <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
            <FaTicketAlt />
            My Bookings requests
          </h2>

          {loading ? (
            <div className="text-center py-20 text-xl font-semibold">
              Loading bookings...
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-10 text-center text-gray-500">
              No booking requests found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {bookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  onCancel={() => handleCancel(booking._id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const BookingCard = ({ booking, onCancel }) => {
  const event = booking.eventId;

  return (
    <div
  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between"
  style={{ minHeight: "280px" }}
>
      <div>
        <div className="flex justify-between gap-4 mb-8">
          <h3 className="text-xl font-black text-gray-900 leading-snug">
            {event?.title || "Deleted Event"}
          </h3>

          <div className="flex flex-col gap-2 items-end">
            <span
              className={`text-xs font-black px-3 py-1 rounded ${
                booking.status === "confirmed"
                  ? "bg-green-100 text-green-700"
                  : booking.status === "cancelled"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {booking.status?.toUpperCase()}
            </span>

            <span
              className={`text-xs font-black px-3 py-1 rounded ${
                booking.paymentStatus === "paid"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {booking.paymentStatus === "paid" ? "PAID" : "NOT PAID"}
            </span>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <b>Date:</b>{" "}
            {event?.date ? new Date(event.date).toLocaleDateString() : "N/A"}
          </p>

          <p>
            <b>Amount:</b>{" "}
            {booking.amount === 0 ? "Free" : `₹${booking.amount}`}
          </p>

          <p>
            <b>Requested:</b>{" "}
            {booking.createdAt
              ? new Date(booking.createdAt).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-8">
        {event?._id ? (
          <Link
            to={`/events/${event._id}`}
            className="text-gray-900 font-semibold hover:underline"
          >
            View Event
          </Link>
        ) : (
          <span className="text-gray-400 font-semibold">View Event</span>
        )}

        {booking.status !== "cancelled" && (
          <button
            onClick={onCancel}
            className="text-red-500 font-semibold flex items-center gap-1 hover:text-red-700"
          >
            <FaTimesCircle />
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;