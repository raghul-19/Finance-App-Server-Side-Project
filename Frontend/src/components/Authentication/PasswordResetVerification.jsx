
import React,{useEffect, useRef, useState} from 'react'
import { assets } from '../../assets/assets'
import axios from 'axios';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useNavigate } from 'react-router-dom';


const PasswordResetVerification = () => {

  const [error,setError]=useState("");
  const [email,setEmail]=useState('');
  const submitRef=useRef(null);
  const [success,setSuccess]=useState(false);
  const [loading,setLoading]=useState(false);
  const navigate=useNavigate();

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  useEffect(() => {
     if(success) return;
     const emailStatus=validateEmail(email);
     submitRef.current.disabled=!emailStatus;
  },[email,success]);

  const handlePassetResetLinkSubmission= async () => {
    setLoading(true);
    setTimeout(() => setLoading(false),2000);
    try {
        await axios.get(`http://localhost:8080/profile/password_reset_email?email=${email}`);
        setSuccess(true);

    } catch(e) {
        console.log(e.message);
        setError("Incorrect email or user yet to be registered");
    }
  }

  const handleReturnToLogin= async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve,3000));
    navigate("/login");
    setLoading(false);
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
            
            </div>
        }

        <div className="w-full h-screen flex justify-center items-start sm:items-center p-3">
            <div className="flex  flex-col sm:w-[500px] sm:h-[550px]  w-full h-screen p-2 shadow-md rounded-xl">
            <div className="flex flex-col justify-start sm:justify-center items-center w-full">
                    <img src={assets.logo} className="w-40 h-40 object-contain object-center rounded-full" alt="" />
                    <div className="text-2xl font-bold w-full text-center">Reset your password</div>
                    <div className="text-center text-base font-light mt-3">{success?"Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.":"Enter your user account's verified email address and we will send you a password reset link."}</div>
                    {success && <div onClick={handleReturnToLogin} className="text-center cursor-pointer mt-3 text-blue-500 font-medium hover:underline underline-offset-2">Return to sign in</div>}
            </div>
            {!success && <div className="w-full flex flex-col items-start mt-5">
                    <div className="text-lg font-medium ">Email</div>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder='Enter your email address' className="w-full text-base mt-2 p-2 border border-gray-300 rounded-sm outline-none"/>
                    {error && 
                        <div className="flex items-center justify-center w-full mt-3">
                            <div className="px-4 py-3 rounded-md bg-red-100 text-red-700 text-sm font-medium border border-red-300 shadow-sm">
                                {error}
                            </div>
                        </div>
                    }
                    <button onClick={handlePassetResetLinkSubmission} ref={submitRef} className="w-full p-2 h-12 font-medium cursor-pointer disabled:bg-blue-300 disabled:cursor-not-allowed mt-6 rounded-md text-white text-sm bg-blue-500 flex justify-center items-center">
                        Send Password reset email
                    </button>
            </div>}
            </div>
        </div>
    </>
  )
}

export default PasswordResetVerification
