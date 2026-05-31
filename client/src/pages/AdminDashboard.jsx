import React, { useEffect, useState } from "react";
import {
  FaRupeeSign,
  FaUser,
  FaHourglassHalf,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import api from "../utils/axios";

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    title: "",
    category: "",
    date: "",
    location: "",
    totalSeats: "",
    ticketPrice: "",
    imageUrl: "",
    description: "",
  });

  const fetchData = async () => {
    try {
      const eventsRes = await api.get("/events");
      setEvents(eventsRes.data);

      try {
        const bookingRes = await api.get("/bookings/admin/all");
        setBookings(bookingRes.data);
      } catch {
        setBookings([]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalRevenue = bookings
    .filter((b) => b.status === "confirmed" && b.paymentStatus === "paid")
    .reduce((sum, b) => sum + Number(b.amount || 0), 0);

  const paidClients = bookings.filter(
    (b) => b.status === "confirmed" && b.paymentStatus === "paid"
  ).length;

  const pendingRequests = bookings.filter((b) => b.status === "pending").length;

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    try {
      await api.post("/events", {
        ...form,
        totalSeats: Number(form.totalSeats),
        ticketPrice: Number(form.ticketPrice),
      });

      setMsg("Event created successfully");
      setShowForm(false);
      setForm({
        title: "",
        category: "",
        date: "",
        location: "",
        totalSeats: "",
        ticketPrice: "",
        imageUrl: "",
        description: "",
      });

      fetchData();
    } catch (err) {
      setMsg(err.response?.data?.error || "Event create failed");
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;

    try {
      await api.delete(`/events/${id}`);
      setEvents(events.filter((event) => event._id !== id));
    } catch (err) {
      setMsg(err.response?.data?.error || "Delete failed");
    }
  };

  const handleConfirmBooking = async (bookingId, paymentStatus) => {
    try {
      await api.put(`/bookings/${bookingId}/confirm`, { paymentStatus });
      fetchData();
    } catch (err) {
      setMsg(err.response?.data?.error || "Confirm failed");
    }
  };

  const handleRejectBooking = async (bookingId) => {
  try {
    await api.put(`/bookings/admin/${bookingId}/reject`);
    fetchData();
  } catch (err) {
    setMsg(err.response?.data?.error || "Reject failed");
  }
};

  if (loading) {
    return (
      <div className="text-center py-20 text-xl font-bold">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <section className="bg-black text-white rounded-3xl p-8 md:p-10 shadow-xl mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          <div>
            <h1 className="text-4xl font-black mb-2">Admin Dashboard</h1>
            <p className="text-gray-300">
              Manage events and manually confirm bookings.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-black px-6 py-3 rounded-xl font-black hover:bg-gray-100"
          >
            + Create New Event
          </button>
        </section>

        {msg && (
          <div className="mb-6 bg-gray-900 text-white p-3 rounded-xl text-center">
            {msg}
          </div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <StatCard
            title="TOTAL REVENUE"
            value={`₹${totalRevenue}`}
            icon={<FaRupeeSign />}
            color="text-green-600"
          />
          <StatCard
            title="PAID CLIENTS"
            value={paidClients}
            icon={<FaUser />}
            color="text-blue-600"
          />
          <StatCard
            title="PENDING REQUESTS"
            value={pendingRequests}
            icon={<FaHourglassHalf />}
            color="text-yellow-600"
          />
        </section>

        {showForm && (
          <section className="bg-white rounded-2xl shadow-sm p-8 mb-10">
            <h2 className="text-3xl font-black mb-6">Create New Event</h2>

            <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input
                placeholder="Event Title"
                className="input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />

              <input
                placeholder="Category (e.g., Tech, Music)"
                className="input"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              />

              <input
                type="date"
                className="input"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />

              <input
                placeholder="Location"
                className="input"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                required
              />

              <input
                type="number"
                placeholder="Total Seats"
                className="input"
                value={form.totalSeats}
                onChange={(e) => setForm({ ...form, totalSeats: e.target.value })}
                required
              />

              <input
                type="number"
                placeholder="Ticket Price (0 for free)"
                className="input"
                value={form.ticketPrice}
                onChange={(e) =>
                  setForm({ ...form, ticketPrice: e.target.value })
                }
                required
              />

              <input
                placeholder="Image URL"
                className="input md:col-span-2"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />

              <textarea
                placeholder="Event Description"
                className="input md:col-span-2 h-28"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
              />

              <button className="md:col-span-2 bg-gray-950 text-white py-4 rounded-xl font-black hover:bg-black">
                Create Event
              </button>
            </form>
          </section>
        )}

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-black mb-6">
              <span className="text-sm mr-3 text-gray-500">{events.length}</span>
              All Events
            </h2>

            <div className="bg-white rounded-2xl shadow-sm divide-y">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="p-5 flex justify-between items-center gap-4"
                >
                  <div>
                    <h3 className="font-black text-gray-900">{event.title}</h3>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt />{" "}
                        {new Date(event.date).toLocaleDateString()}
                      </span>

                      <span className="text-green-600 font-semibold">
                        {event.availableSeats}/{event.totalSeats} seats
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteEvent(event._id)}
                    className="text-red-500 border border-red-100 px-4 py-2 rounded-lg font-bold hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-black mb-6">
              <span className="text-sm mr-3 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                {bookings.length}
              </span>
              Booking Requests
            </h2>

           <div className="space-y-6 overflow-y-auto pr-2" style={{ maxHeight: "700px" }}>
              {bookings.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-gray-500 text-center">
                  No booking requests found.
                </div>
              ) : (
                bookings.map((booking) => (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    onPaid={() => handleConfirmBooking(booking._id, "paid")}
                    onUndecided={() =>
                      handleConfirmBooking(booking._id, "non_paid")
                    }
                    onReject={() => handleRejectBooking(booking._id)}
                  />
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-2xl p-7 shadow-sm flex justify-between items-center">
      <div>
        <p className="text-gray-500 font-black text-sm tracking-wider">{title}</p>
        <h3 className={`text-4xl font-black mt-2 ${color}`}>{value}</h3>
      </div>

      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-xl">
        {icon}
      </div>
    </div>
  );
};

const BookingCard = ({ booking, onPaid, onUndecided, onReject }) => {
  const event = booking.eventId;
  const user = booking.userId;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-yellow-400">
      <div className="flex justify-between gap-3 mb-5">
        <h3 className="text-xl font-black text-gray-900">
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

      <div className="space-y-2 text-sm text-gray-600 mb-5">
        <p>
          <b>USER:</b> {user?.name || "Unknown"}{" "}
          <span className="text-gray-400">({user?.email || "no email"})</span>
        </p>
        <p>
          <b>AMOUNT:</b>{" "}
          <span className="text-green-600 font-bold">
            {booking.amount === 0 ? "Free" : `₹${booking.amount}`}
          </span>
        </p>
        <p>
          <b>DATE:</b> {new Date(booking.createdAt).toLocaleString()}
        </p>
        <p>
          <b>SEATS:</b>{" "}
          <span className="text-green-600 font-bold">
            {event?.availableSeats}
          </span>{" "}
          remaining of {event?.totalSeats}
        </p>
      </div>

      {booking.status === "pending" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={onPaid}
            className="bg-green-50 text-green-700 py-3 rounded-lg font-black hover:bg-green-100"
          >
            ✓ Approve as Paid
          </button>

          <button
            onClick={onUndecided}
            className="bg-gray-100 text-gray-900 py-3 rounded-lg font-black hover:bg-gray-200"
          >
            ✓ Approve Undecided
          </button>

          <button
            onClick={onReject}
            className="bg-red-50 text-red-600 py-3 rounded-lg font-black hover:bg-red-100"
          >
            × Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;