import React, { useEffect, useRef, useState } from 'react'
import { assets } from '../../assets/assets'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
const PasswordReset = () => {

  const location=useLocation();
  const [email,setEmail]=useState("");
  const [valid,setValid]=useState(null);
  const [error,setError]=useState("");
  const [newPassword,setNewPassword]=useState("");
  const [confirmPassword,setConfirmPassword]=useState("");
  const submitRef=useRef(null);
  const [loading,setLoading]=useState(false);
  const navigate=useNavigate();
  

  useEffect(() => {
    const queryParams=new URLSearchParams(location.search);
    setEmail(queryParams.get("email"));
    const status=queryParams.get("status");
    if(status==="valid") {
        setValid(true);
    } else {
        setValid(false);
    }
    
  },[])

  useEffect(() => {

    if(!valid) return;

    if(newPassword===confirmPassword && newPassword.trim().length>0 && (newPassword.length>=4 && newPassword.length<=20) && (confirmPassword.length>=4 && confirmPassword.length<=20)) {
        submitRef.current.disabled=false;
    } else {
        submitRef.current.disabled=true;
    }

  },[confirmPassword,newPassword,valid])

  const handleChangePassword= async() => {
    setLoading(true);
    try {
        await axios.put(`http://localhost:8080/profile/changePassword?email=${email}&password=${confirmPassword}`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        navigate("/login");
        
    } catch(e) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log(e.message);
        setError("Internal Server Error");
    }
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
        {
            !valid &&
            <div className="absolute w-screen min-h-screen bg-white z-30 gap-1 flex flex-col items-center justify-center">
                    <div className="w-100 p-2 border border-gray-200 ring-2 ring-red-500  rounded-md">
                        <div className="flex flex-col justify-center items-center p-6">
                            <div className="text-red-500 text-6xl mb-4">⚠️</div>
                            <div className="font-bold text-xl text-gray-800 mb-2">Token Expired</div>
                            <div className="font-medium text-md text-gray-600 text-center mb-4">
                                The password reset link has expired or is invalid. Please request a new password reset link.
                            </div>
                            <button 
                                onClick={() => navigate('/login')} 
                                className="px-6 py-2 cursor-pointer  bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
                            >
                                Back to Login
                            </button>
                        </div>
                    </div>
            </div>
        }
        <div className="w-full h-screen flex justify-center items-center p-3">
        <div className="flex sm:w-[800px] sm:h-[450px] w-full h-screen flex-col-reverse sm:flex-row shadow-md rounded-lg">
            <div className="sm:w-1/2 sm:h-full w-full h-[60%] p-3 flex flex-col justify-center">
                <div className="font-bold text-center text-2xl">Password Reset</div>
                <div className="font-medium text-base mt-6">New Password</div>
                <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" className="w-full p-2 rounded-sm border outline-none border-gray-300 mt-2 text-base" placeholder='Enter your new password'/>
                <div className="font-medium text-base mt-6">Confirm Password</div>
                <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" className="w-full p-2 rounded-sm border outline-none border-gray-300 mt-2 text-base" placeholder='Confirm your password'/>
                {error && <div className="mb-4 px-4 py-3 rounded-md bg-red-100 text-red-700 text-sm font-medium border border-red-300 shadow-sm mt-5">
                {"Invalid username or password"}
                </div>}
                <button onClick={handleChangePassword} ref={submitRef} className="w-full h-12 p-2 flex cursor-pointer disabled:cursor-not-allowed disabled:bg-blue-300 justify-center items-center bg-blue-500 rounded-sm mt-4 text-white font-medium">Change Password</button>
            </div>
            <div className="sm:w-1/2 sm:h-full w-full h-[40%]">

                <img src={assets.reset} className="w-full h-full object-cover object-center" alt="" />
            
            </div>
        </div>
        </div>
    </>
  )
}

export default PasswordReset;
