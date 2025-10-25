import React, { useState, useRef, useEffect } from 'react';
import { assets } from '../../assets/assets';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


const AccountActivation = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputsRef = useRef([]);
  const [error,setError]=useState("");
  const [timeLeft,setTimeLeft]=useState(120);
  const confirmRef=useRef(null);
  const navigate=useNavigate();
  const [loading,setLoading]=useState(false);
  const generateOtp=async () => {
    try {
      await axios.get(`http://localhost:8080/profile/generateOtp?email=${localStorage.getItem("email")}`);
    } catch(e) {
      setError("Internal server error");
      setTimeLeft(0);
      console.log(e.message);
    }
  }
  useEffect(() => {
    generateOtp();
  },[]);


  useEffect(() => {
   const isOtpFullFilled=otp.every((digit) => digit!=="");
   if(confirmRef.current) {
    confirmRef.current.disabled=!isOtpFullFilled;
    
   }
   
    
  },[otp]);

  useEffect(()=> {
    if(timeLeft==0) {
      setError("Sent OTP expired");
      setOtp(["","","",""]);
      return;
    }
    const timeout=setTimeout(() => {
      setTimeLeft(prev => prev-1);
    },1000);
    return () => clearTimeout(timeout);
  },[timeLeft])


  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputsRef.current[index - 1].focus();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleOtpVerification= async () => {
    setLoading(true);
    let otpNumber="";
    otp.forEach((digit) =>{
      otpNumber=otpNumber+digit;
    })

    console.log("otp number "+otpNumber);

    try {
      await axios.get(`http://localhost:8080/profile/activate?email=${localStorage.getItem("email")}&otpNumber=${otpNumber}`)
      await new Promise(resolve => setTimeout(resolve,2000));
      navigate("/login");

    } catch(e) {
      console.log(e.message);
      setError("Invalid OTP or OTP got expired");
    }
    setLoading(false);
    setOtp(["","","",""]);
  }
  return (
    <>
      {loading && 
      <div className="absolute w-screen min-h-screen bg-white z-30 gap-1 flex flex-col items-center justify-center">
        <div>
        <DotLottieReact
          src="https://lottie.host/d95b7397-e18c-4855-bc72-a35d547f31c6/WQgX9AIY7H.lottie"
          loop
          autoplay
          style={{ width: '400px', height: '400px' }}
        />
        </div>
      
      </div>}
      <div className="p-6 w-screen h-screen flex justify-center items-center">
        <div className="w-[700px]  h-screen sm:h-[500px] flex sm:flex-row flex-col-reverse  shadow-lg rounded-lg p-3">
          <div className="flex flex-col justify-center items-center gap-3 w-full sm:w-[50%] sm:h-full h-[60%]">
            <div className="font-bold text-2xl">Verify Your account</div>
            <div className="font-medium text-center text-base text-gray-400">{`Please enter OTP recieved on the email example@gmail.com`}</div>
            <div className="flex gap-4 justify-between">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-14 h-14 text-center text-2xl font-bold border-2 border-blue-500 shadow-md outline-none rounded-lg focus:outline-none  focus:border-green-500 caret-green-500"
              />
            ))}
        
          </div>
          {error && 
              <div className="px-4 py-3 rounded-md bg-red-100 text-red-700 text-sm font-medium border border-red-300 shadow-sm">
                {error}
              </div>} 
          {timeLeft!=0 &&
            <>
            <div className="flex gap-2 items-center">
              <div className="text-center font-semibold text-sm">{formatTime(timeLeft)}</div> 
              
            </div>
            </>      
          }
          <input type="button" value="Confirm" ref={confirmRef}  onClick={handleOtpVerification} className="w-30 h-10 flex items-center justify-center rounded-md text-sm font-semibold disabled:cursor-not-allowed hover:bg-green-500 disabled:bg-blue-300  cursor-pointer  transition-all duration-200  bg-blue-500  outline-none text-white "/>
          {timeLeft==0 && <div className="text-center cursor-pointer mt-3  text-blue-500 underline-offset-2 hover:underline text-sm">Resend OTP</div>}
          </div>
          <div className="sm:w-1/2 w-full h-[40%] sm:h-full">
            <img src={assets.otpImage} className="w-full h-full object-center object-contain sm:object-cover" alt="" />
          </div>
          
        </div>
      </div>
    </>
  );
};

export default AccountActivation;

