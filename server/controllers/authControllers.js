const User=require('../models/user');
const { sendOtpEmail } = require('../utils/email');
const OTP=require('../models/otp');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');


const generateToken=(id,role)=>{
  return jwt.sign({id,role},process.env.JWT_SECRET,{expiresIn:'7d'});
}



exports.registerUser=async(req,res)=>{
  const{name,email,password}=req.body;

let userExists=await User.findOne({email});
if(userExists){
  return res.status(400).json({error:'user already exist'});
}

const salt=await bcrypt.genSalt(10);
const hashedPassword=await bcrypt.hash(password,salt); 


  try{
    const user=await User.create({name,email,password:hashedPassword,role: 'user',isVerified:false});
   
  

    const otp=Math.floor(100000+Math.random()*900000).toString();
    console.log(`OTP for ${email}: ${otp}`);

    // await OTP.create({email,otp,action:'account_verification'});
    // await sendOtpEmail(email,otp,'account_verification');

    //   res.status(201).json({message:'user registerd successfully',
    //     email:user.email
    //   });
    await OTP.create({ email, otp, action: "account_verification" });

sendOtpEmail(email, otp, "account_verification").catch((err) => {
  console.log("Email send failed:", err.message);
});

res.status(201).json({
  message: "User registered successfully. OTP sent.",
  email: user.email,
});


  
  }catch(error){
    res.status(400).json({error: error.message});
  }


};


exports.loginUser=async(req,res)=>{
  const{email,password}=req.body;

  let user=await User.findOne({email});
  if(!user){
    return res.status(400).json({error:'Invalid credential,plz Sign up'});
  }

  const isMatch=await bcrypt.compare(password,user.password);
  if(!isMatch){
    return res.status(400).json({error:'Invaild credentials'});
  }

if(!user.isVerified && user.role==='user'){
  const otp=Math.floor(100000+Math.random()*900000).toString();
  await OTP.deleteMany({email,action:'account_verification'});
  await OTP.create({email,otp,action:'account_verification'});
  await sendOtpEmail(email,otp,'account_verification');
  return res.status(400).json({
    error:'Account not verified. a new OTp has been sent to your email.'
  });
}





 res.json({
  message:'Login successful',
  _id: user._id,
  name:user.name,
  email:user.email,
  role:user.role,
  token:generateToken(user._id,user.role)
 })

};


exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body || {};

    if (!email || !otp) {
      return res.status(400).json({
        error: "Email and OTP are required",
      });
    }

    const otpRecord = await OTP.findOne({
      email,
      otp,
      action: "account_verification",
    });

    if (!otpRecord) {
      return res.status(400).json({
        error: "Invalid or expired OTP",
      });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    await OTP.deleteMany({
      email,
      action: "account_verification",
    });

    res.json({
      message: "Account verified successfully",
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);

    res.status(500).json({
      error: error.message,
    });
  }
};

