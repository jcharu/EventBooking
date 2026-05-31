const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const User = require('./models/user');
const Event = require('./models/event');
const Booking = require('./models/booking');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await User.deleteMany();
    await Event.deleteMany();
    await Booking.deleteMany();

    const hashedPassword = await bcrypt.hash('123456', 10);

    const users = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: hashedPassword,
        role: 'admin',
        isVerified: true
      },
      {
        name: 'Riya Sharma',
        email: 'riya@gmail.com',
        password: hashedPassword,
        role: 'user',
        isVerified: true
      },
      {
        name: 'Aarav Mehta',
        email: 'aarav@gmail.com',
        password: hashedPassword,
        role: 'user',
        isVerified: true
      },
      {
        name: 'Neha Jain',
        email: 'neha@gmail.com',
        password: hashedPassword,
        role: 'user',
        isVerified: true
      }
    ]);

    const admin = users[0];

    const events = await Event.insertMany([
      {
        title: 'Tech Summit 2026',
        description: 'Annual technology conference for developers',
        date: new Date('2026-08-20'),
        location: 'Jaipur',
        category: 'Technology',
        totalSeats: 250,
        availableSeats: 248,
        ticketPrice: 999,
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
        createdBy: admin._id
      },
      {
        title: 'Music Night',
        description: 'Live music concert with famous artists',
        date: new Date('2026-07-15'),
        location: 'Udaipur',
        category: 'Music',
        totalSeats: 500,
        availableSeats: 499,
        ticketPrice: 799,
       imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
        createdBy: admin._id
      },
      {
        title: 'Startup Expo',
        description: 'Meet startup founders and investors',
        date: new Date('2026-09-10'),
        location: 'Ahmedabad',
        category: 'Business',
        totalSeats: 150,
        availableSeats: 150,
        ticketPrice: 1200,
        imageUrl: 'https://images.unsplash.com/photo-1515169067868-5387ec356754',
        createdBy: admin._id
      },

      {
  title: 'Global Leaders Business Summit',
  description: 'Connect with top business leaders, entrepreneurs and industry experts from around the world.',
  date: new Date('2026-07-21'),
  location: 'Mumbai',
  category: 'Business',
  totalSeats: 200,
  availableSeats: 200,
  ticketPrice: 1500,
  imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865',
  createdBy: admin._id
},
{
  title: 'Modern Art Expo 2026',
  description: 'Explore stunning artworks, creative exhibitions and meet talented artists.',
  date: new Date('2026-08-05'),
  location: 'Delhi',
  category: 'Art',
  totalSeats: 300,
  availableSeats: 300,
  ticketPrice: 500,
  imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b',
  createdBy: admin._id
},
{
  title: 'Cloud Computing Architecture Seminar',
  description: 'Learn modern cloud technologies, AWS, Azure and scalable system design from experts.',
  date: new Date('2026-08-18'),
  location: 'Bangalore',
  category: 'Cloud Computing',
  totalSeats: 100,
  availableSeats: 100,
  ticketPrice: 800,
  imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
  createdBy: admin._id
}
    ]);

    await Booking.insertMany([
      {
        userId: users[1]._id,
        eventId: events[0]._id,
        status: 'confirmed',
        paymentStatus: 'paid',
        amount: events[0].ticketPrice
      },
      {
        userId: users[2]._id,
        eventId: events[1]._id,
        status: 'pending',
        paymentStatus: 'non_paid',
        amount: events[1].ticketPrice
      }
    ]);

    console.log('Seed data inserted successfully');
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedData();
