// const express=require('express');
// const dotenv=require('dotenv');
// const cors=require('cors');
// const mongoose=require('mongoose');



// dotenv.config();

// const app=express();
// app.use(cors());
// app.use(express.json());

// app.use('/api/auth',authRoutes);
// app.use('/api/auth',eventRoutes);
// app.use('/api/auth',bookingRoutes);


// mongoose.connect(process.env.MONGODB_URI)
// .then(()=>{
//   console.log('connected to MonogoDB');
// })
// .catch((error)=>{
//   console.log('Errorconnecting to MonogoDB:',error);
// });




// app.get('/',(req,res)=>{
//    res.send("Backend running");
// });



// const PORT=process.env.PORT||5000;
// app.listen(PORT,()=>{
//   console.log("run");
// })




// const express = require('express');
// const dotenv = require('dotenv');
// const mongoose = require('mongoose');

// const authRoutes=require('./routes/auth');

// dotenv.config();

// const app = express();

// app.use(express.json());

// app.use('/api/auth',authRoutes);


// mongoose.connect(process.env.MONGODB_URI)
// .then(() => {
//    console.log('MongoDB connected');
// })
// .catch((error) => {
//    console.log(error);
// });

// app.listen(5000, () => {
//   console.log('Server started');
// });




const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const mongoose=require('mongoose');

const authRoutes=require('./routes/auth');
const eventRoutes=require('./routes/events');
const bookingRoutes=require('./routes/booking');

dotenv.config();

const app=express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
 app.use('/api/bookings', bookingRoutes);

mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
  console.log('connected to MonogoDB');
})
.catch((error)=>{
  console.log('Errorconnecting to MonogoDB:',error);
});

app.get('/',(req,res)=>{
   res.send("Backend running");
});

const PORT=process.env.PORT||5000;

app.listen(PORT,()=>{
  console.log("run");
});