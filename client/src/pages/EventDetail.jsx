import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaChair,
  FaMoneyBillWave,
} from "react-icons/fa";

import api from "../utils/axios";
import { useAuth } from "../context/AuthContext";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
      } catch (err) {
        setError("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleBooking = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setBookingLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      if (!showOTP) {
        await api.post("/bookings/send-otp");
        setShowOTP(true);
        setSuccessMsg("OTP sent. Enter OTP to confirm booking.");
      } else {
        await api.post("/bookings", {
          eventId: event._id,
          otp,
        });

        setSuccessMsg("Booking requested! Awaiting admin confirmation.");
        setShowOTP(false);
        setOtp("");

        setEvent({
          ...event,
          availableSeats: event.availableSeats - 1,
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Booking failed"
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Loading event details...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-20 text-xl text-red-500">
        {error || "Event not found"}
      </div>
    );
  }

  const isSoldOut = event.availableSeats <= 0;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="h-72 bg-gray-900">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
              {event.category || "Event"}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 md:p-14">
          <div>
            <span className="inline-block bg-gray-100 text-gray-800 px-4 py-1 rounded-full text-sm font-bold uppercase mb-6">
              {event.category}
            </span>

            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
              {event.title}
            </h1>

            <p className="text-gray-500 text-lg leading-relaxed">
              {event.description}
            </p>
          </div>

          <div className="bg-gray-50 rounded-3xl p-8 shadow-sm">
            <h2 className="text-2xl font-black text-gray-900 mb-8">
              Booking Details
            </h2>

            <DetailRow
              icon={<FaMoneyBillWave />}
              label="Ticket Price"
              value={event.ticketPrice === 0 ? "Free" : `₹${event.ticketPrice}`}
              green={event.ticketPrice === 0}
            />

            <DetailRow
              icon={<FaChair />}
              label="Availability"
              value={`${event.availableSeats} / ${event.totalSeats}`}
            />

            <DetailRow
              icon={<FaCalendarAlt />}
              label="Date"
              value={new Date(event.date).toLocaleDateString()}
            />

            <DetailRow
              icon={<FaMapMarkerAlt />}
              label="Location"
              value={event.location}
            />

            {showOTP && (
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength="6"
                className="w-full mt-4 mb-4 px-4 py-3 rounded-xl border border-gray-300 text-center font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-gray-700"
              />
            )}

            <button
              onClick={handleBooking}
              disabled={bookingLoading || isSoldOut}
              className="w-full bg-gray-950 text-white py-4 rounded-xl font-black mt-6 hover:bg-black transition disabled:opacity-60"
            >
              {bookingLoading
                ? "Processing..."
                : showOTP
                ? "Verify OTP & Confirm"
                : isSoldOut
                ? "Sold Out"
                : "Confirm Registration"}
            </button>

            {error && (
              <p className="text-red-500 mt-4 text-center font-medium bg-red-50 p-3 rounded-lg">
                {error}
              </p>
            )}

            {successMsg && (
              <p className="text-green-600 mt-4 text-center font-medium bg-green-50 p-3 rounded-lg">
                {successMsg}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ icon, label, value, green }) => {
  return (
    <div className="flex items-center gap-5 mb-6">
      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-800 shadow-sm">
        {icon}
      </div>

      <div>
        <p className="text-xs font-black text-gray-400 uppercase">{label}</p>
        <p
          className={`text-lg font-black ${
            green ? "text-green-500" : "text-gray-900"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
};

export default EventDetail;