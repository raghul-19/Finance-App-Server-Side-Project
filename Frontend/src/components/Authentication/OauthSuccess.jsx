import React, {useState,useEffect } from 'react'
import {useSearchParams} from 'react-router-dom'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useNavigate } from 'react-router-dom';

const OauthSuccess = () => {

  const [searchParams]=useSearchParams();
  const [loading,setLoading]=useState(false);
  const navigate=useNavigate();
  useEffect(() => {
    const getLoggedInCredentials=async () => {
      setLoading(true);
      localStorage.setItem("email",searchParams.get("email"));
      localStorage.setItem("token",searchParams.get("token"));
      await new Promise(resolve => setTimeout(resolve,2000));
      navigate("/");
      setLoading(false);
    }
    getLoggedInCredentials();
  },[])

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
    </>
  )

}

export default OauthSuccess;
