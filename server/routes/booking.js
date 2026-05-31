// const express=require('express');
// const router=express.Router();

// const{protect,admin}=require('../middlewares/auth');
// const { verifyOtp } = require('../controllers/authControllers');
// const {
//   bookEvent,
//   getMyBooking,
//   confirmBooking,
//   cancelBooking
// } = require('../controllers/bookingControllers');

// router.post('/',protect,bookEvent);
// router.post('/send-otp',protect,sendBookingOTP);
// router.get('/my',protect,getMyBooking);
// router.put('/:id/confirm',protect,admin,confirmBooking);
// router.delete('/:id',protect,cancelBooking);

// module.exports=router;
const express = require('express');
const router = express.Router();

const { protect, admin } = require('../middlewares/auth');

const {
  sendBookingOTP,
  bookEvent,
  getMyBookings,
  getAllBookings,
  confirmBooking,
  cancelBookings,
  rejectBooking
} = require('../controllers/bookingControllers');

router.post('/send-otp', protect, sendBookingOTP);

router.post('/', protect, bookEvent);

router.get('/my', protect, getMyBookings);

router.get('/admin/all', protect, admin, getAllBookings);

router.put('/:id/confirm', protect, admin, confirmBooking);

router.put('/admin/:id/reject', protect, admin, rejectBooking);

router.delete('/:id', protect, cancelBookings);

module.exports = router;