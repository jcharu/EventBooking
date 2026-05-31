const Booking=require('../models/booking');
const OTP=require('../models/otp');
const Event=require('../models/event');
const { sendOtpEmail, sendBookingEmail } = require('../utils/email');
const booking = require('../models/booking');

const generateOtp=()=>{
  return Math.floor(100000+Math.random()*900000).toString();
}

exports.sendBookingOTP = async (req, res) => {
  try {
    const otp = generateOtp();

    console.log(`Booking OTP for ${req.user.email}: ${otp}`);

    await OTP.deleteMany({
      email: req.user.email,
      action: "event_booking",
    });

    await OTP.create({
      email: req.user.email,
      otp,
      action: "event_booking",
    });

    await sendOtpEmail(req.user.email, otp, "event_booking");

    res.json({
      message: "OTP sent. Check terminal if email does not arrive.",
    });
  } catch (error) {
    console.log("Send booking OTP error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.bookEvent=async(req,res)=>{
  const{eventId,otp}=req.body;
  const otpRecord=await OTP.findOne({email:req.user.email,otp,    action:'event_booking'});
  if(!otpRecord){
    return res.status(400).json({error:'invaild or expried otp'});
  }

  const event=await Event.findById(eventId);
  if(!event){
    return res.status(404).json({error:'event not found'});
  }

  if(event.availableSeats <= 0){
    return res.status(400).json({error:'No seats available'});
  }

  const existingBooking=await Booking.findOne({userId:req.user._id,eventId})
  if(existingBooking){
    return res.status(400).json({error:'u have already booked this event'});
  }

  const booking=await Booking.create({
    userId:req.user._id,
     eventId,
    status:'pending',
    paymentStatus:'non_paid',
    amount:event.ticketPrice
  });

  await OTP.deleteMany({email:req.user.email,action:'event_booking'});
  res.status(201).json({message:'booking created.plz check ur email'});
}

  exports.confirmBooking=async(req,res)=>{
    const paymentStatus=req.body.paymentStatus;
    if(!['paid','non_paid'].includes(paymentStatus)){
      return res.status(400).json({error:"invaild payment status"});
    }
    const booking=await Booking.findById(req.params.id).populate('eventId');
    if(!booking){
      return res.status(404).json({error:'Booking not founund'});
    }

    if(booking.status==='confirmed'){
      return res.status(400).json({error:'Booking is already confirmed'});
    }
const event=await Event.findById(booking.eventId._id);
    if(event.totalSeats<=0){
      return res.status(400).json({error:'no seats avaiable'});
    }

    booking.status='confirmed';

    if(paymentStatus){
      booking.paymentStatus=paymentStatus;
    }
    await booking.save();
    event.tatalSeats -=1;
    await event.save();

    await sendBookingEmail(req.user.email,event.title,booking._id);

    res.json({message:'booking confirmed'});

  }

  exports.getMyBookings=async(req,res)=>{
    const bookings=await Booking.find({userId:req.user._id}).populate('eventId');
    res.json(bookings);
  }

  exports.cancelBookings = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (booking.status === "confirmed") {
      const event = await Event.findById(booking.eventId);

      if (event) {
        event.availableSeats += 1;
        await event.save();
      }
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
  exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate("eventId");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking rejected successfully", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




