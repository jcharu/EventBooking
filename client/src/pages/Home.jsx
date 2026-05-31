import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaRegClock,
  FaShieldAlt,
} from "react-icons/fa";
import api from "../utils/axios";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get("/events");
         console.log("EVENTS DATA:", data);
        setEvents(data);
      } catch (error) {
        console.log("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) =>
    event.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="relative bg-black text-white rounded-3xl overflow-hidden shadow-2xl mb-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501281668745-f7f57925c3b4')] bg-cover bg-center opacity-30"></div>
          <div
  className="absolute inset-0"
  style={{
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.8), black)",
  }}
></div>

          <div className="relative z-10 text-center py-24 px-6">
            <span className="inline-block bg-white/20 text-white px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-8">
              Welcome to Eventora
            </span>

            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-8">
              Find Your Next
              <br />
              <span className="text-gray-300">Unforgettable</span>
              <br />
              Experience
            </h1>

            <p className="text-gray-300 max-w-3xl mx-auto text-lg md:text-xl mb-10 leading-relaxed">
              Discover the best tech conferences, late-night music festivals,
              and hands-on workshops happening directly in your area. Secure
              your spot today.
            </p>

            <div className="max-w-2xl mx-auto relative">
              <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search events by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full py-5 pl-14 pr-6 rounded-full text-black bg-white outline-none text-lg shadow-xl"
              />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
          <FeatureCard
            icon={<FaRegClock />}
            title="Fast Booking"
            text="Secure your tickets instantly with our fast streamlined booking infrastructure built for speed."
          />

          <FeatureCard
            icon={<FaTicketAlt />}
            title="Seamless Access"
            text="Download tickets instantly or manage them right from your personal dashboard with ease."
          />

          <FeatureCard
            icon={<FaShieldAlt />}
            title="Secure Platform"
            text="All transactions and registrations are secured with modern authentication and OTP verification."
          />
        </section>

        <section>
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-4xl font-black text-gray-900">
              Upcoming Events
            </h2>

            <p className="text-gray-500 font-semibold">
              {filteredEvents.length} results found
            </p>
          </div>

          {loading ? (
            <div className="text-center text-xl font-semibold py-20">
              Loading events...
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center text-xl text-gray-500 py-20">
              No events found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </section>

        <footer className="mt-24 py-10 border-t text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <FaTicketAlt className="text-2xl text-gray-900" />
            <span className="text-2xl font-black text-gray-900">
              Eventora
            </span>
          </div>

          <p className="text-gray-500 max-w-lg mx-auto text-sm">
            The simplest, most dynamic way to manage, discover, and host
            world-class events in your local city.
          </p>
        </footer>
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, text }) => {
  return (
    <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100 hover:shadow-xl transition">
      <div className="w-20 h-20 bg-gray-950 text-white rounded-2xl mx-auto flex items-center justify-center text-3xl mb-8 shadow-lg">
        {icon}
      </div>

      <h3 className="text-2xl font-black text-gray-900 mb-5">{title}</h3>

      <p className="text-gray-500 leading-relaxed">{text}</p>
    </div>
  );
};

const EventCard = ({ event }) => {
  const availableSeats = event.availableSeats ?? event.totalSeats;
  const totalSeats = event.totalSeats || 1;
  const seatPercent = (availableSeats / totalSeats) * 100;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition border border-gray-100">
      <div className="relative h-56 bg-gray-200">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
            {event.category || "Event"}
          </div>
        )}

        <div className="absolute top-4 right-4 bg-white text-gray-900 px-4 py-2 rounded-full font-black shadow">
          ₹{event.ticketPrice}
        </div>
      </div>

      <div className="p-7">
        <p className="text-sm font-black text-gray-700 uppercase tracking-widest mb-4">
          {event.category}
        </p>

        <h3 className="text-2xl font-black text-gray-900 mb-5 leading-snug">
          {event.title}
        </h3>

        <div className="space-y-3 text-gray-500 mb-6">
          <div className="flex items-center gap-3">
            <FaCalendarAlt />
            <span>
              {new Date(event.date).toLocaleDateString(undefined, {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <FaMapMarkerAlt />
            <span>{event.location}</span>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div
            className="bg-gray-900 h-2 rounded-full"
            style={{ width: `${seatPercent}%` }}
          ></div>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          {availableSeats} of {totalSeats} seats remaining
        </p>

        <Link
          to={`/events/${event._id}`}
          className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-900 py-4 rounded-xl font-black transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default Home;