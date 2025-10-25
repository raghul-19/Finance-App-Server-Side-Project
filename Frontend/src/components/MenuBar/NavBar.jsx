import React,{useContext, useEffect, useRef, useState} from 'react'
import { assets } from '../../assets/assets'
import {LogOut, Menu, User, X} from 'lucide-react'
import SideBar from './SideBar';
import { AppContext } from '../Pages/util/AppContext';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useNavigate } from 'react-router-dom';


const NavBar = () => {
  
  const userProfile=useContext(AppContext);
  const [profile,setProfile]=useState(false);
  const [loading,setLoading]=useState(false);
  const [mobileMenu,setMobileMenu]=useState(false);
  const sideBarRef=useRef(null);
  const profileRef=useRef(null);
  const navigate=useNavigate();

  useEffect(() => {
    const handleOutsideClick=(event) => {
        if(mobileMenu && !sideBarRef.current.contains(event.target)) {
            setMobileMenu(false);
        } else if(profile && !profileRef.current.contains(event.target)) {
            setProfile(false);
        } else if(!profile && profileRef.current.contains(event.target)) {
            setProfile(true);
        }
    }

    document.body.addEventListener('mousedown',handleOutsideClick);

    return () => document.body.removeEventListener('mousedown',handleOutsideClick);
  })

  const handleLogOut=async () => {
    setLoading(true);
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    await new Promise(resolve => setTimeout(resolve,2000));
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
      
      </div>}
  
        <div className="w-full  border-2 border-gray-200/20 backdrop-blur-md bg-white fixed top-0 z-30">
            <div className="flex justify-between items-center gap-2 h-full px-4 py-2">
                <div className="flex items-center  h-full">
                <div className="min-[1110px]:hidden mr-1 flex items-center">
                {mobileMenu ? <X onClick={() => setMobileMenu(!mobileMenu)} className="text-2xl cursor-pointer"/>:<Menu onClick={() => setMobileMenu(!mobileMenu)} className="text-2xl cursor-pointer"/>}
                </div>
                <div className="w-15 h-15">
                    <img src={assets.navLogo} className="w-full h-full" alt="" />
                </div>
                <div className="text-lg font-bold">Money Manager</div>
                </div>
                <div ref={profileRef}  className={`w-10 ${profile?"border-3 border-purple-500":""} cursor-pointer h-10 rounded-full bg-gray-100 shadow-md flex items-center justify-center relative`}>
                    <User className="text-purple-500" />
                    <div className={` ${profile?"block absolute":"hidden"}  p-3 bg-white shadow-md right-0 z-50 translate-y-21`}>
                        <div className="flex gap-2">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex justify-center items-center">
                                <User className="text-purple-500" />
                            </div>
                            <div className="flex flex-col">
                                <div className="font-medium text-base">{userProfile && userProfile.name}</div>
                                <div className="text-sm">{userProfile && userProfile.email}</div>
                            </div>
                        </div>

                        <div onClick={handleLogOut} className="flex items-center gap-2 w-full shadow-md mt-4 px-2 py-2 hover:bg-blue-500 hover:text-white hover:rounded-sm transition-all duration-200">
                            <LogOut className="w-5 h-5"></LogOut>
                            <div className="text-md font-medium">Log out</div>
                        </div>

                    </div>
                </div>
            
            </div>
            {mobileMenu && (
                <div ref={sideBarRef} className="min-[1110px]:hidden min-h-screen bg-white fixed  top-[110%] left-0    w-64  shadow-lg border-t border-gray-200 z-20">
      
                        <SideBar/>
                    
                </div>
            )}
        </div>
        
    </>
  )
}

export default NavBar
