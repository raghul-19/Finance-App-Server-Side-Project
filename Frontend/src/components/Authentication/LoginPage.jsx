import React,{useState} from 'react'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useNavigate } from 'react-router-dom';
import { EyeOff,Eye } from 'lucide-react';

const LoginPage = () => {
  
  const [login,setLogin]=useState(true);
  const [error,setError]=useState('');
  const [user,setUser]=useState({
    name:'',
    email:'',
    password:'',
  });
  const [loading,setLoading]=useState(false);
  const navigate=useNavigate();
  const [visibility,setVisibility]=useState(false);

  

  const handleUserData=(e) => {
    setUser(prev => ({...prev,[e.target.name]:e.target.value}));
  }

  const handleToggle=() => {
    setLogin(!login);
    setError('');
  }

  const createImageFile=async () => {
    try {
      const response=await fetch(assets.user);
      const blob=await response.blob();
      if(blob) {
        const imageFile=new File([blob],"user.png",{type:blob.type});
        return imageFile;
        
      } else {
        throw new Error();
      }

    } catch(e) {
      console.log(e.message);
    }
  }

  const handleForgotPassword= async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve,2000));
    navigate("/password_reset_verification");
    setLoading(false);
  }

  const handleOauth2Login=(registrationId) => {
    window.location.href="http://localhost:8080/oauth2/authorization/"+registrationId;
  }

  const handleVerifyUserData=async () => {
    setLoading(true);
  
    if(login) {
      if(user.email.trim() && user.password.trim()) {
        try {
          const response=await axios.post("http://localhost:8080/api/auth/login",{
            email:user.email,
            password:user.password,
          });
          await new Promise(resolve => setTimeout(resolve,3000));
          if(response.data==="Account is not activated") {
            localStorage.setItem("email",user.email);
            navigate("/activate");
            return;
          } 
          localStorage.setItem('token',response.data.token);
          localStorage.setItem('email',response.data.email);
          setError('');
          setUser(prev => ({...prev, email:"",password:""}));
          navigate("/");
        } catch(e) {
          console.log(e.message);
          await new Promise(resolve =>setTimeout(resolve,2000));
          setError("Invalid username or password");
        }
 
      } else {
        setError("Fill all the details");
      }
    } else {
      if(user.email.trim() && user.password.trim() && user.name.trim()) {
        try {
          const userData={name:user.name, password:user.password, email:user.email}
          const formData=new FormData();
          formData.append("data",new Blob([JSON.stringify(userData)],{ type: "application/json" }))
          const imageFile=await createImageFile();
          formData.append("file",imageFile);
          await axios.post("http://localhost:8080/profile/register",formData,{
            headers: {
              "Content-Type": "multipart/form-data",
            }});
          localStorage.setItem("email",user.email);
          await new Promise(resolve => setTimeout(resolve,3000));
          navigate("/activate");
          setError('');
          setUser(({name:"", email:"",password:""}));
        } catch(e) {
          console.log(e.message);
          await new Promise(resolve =>setTimeout(resolve,2000));
          setError("Please ensure all fields are filled out correctly.");
        }
      } else {
        setError("Fill all the details");
      }
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
      
      </div>}
      <div className="w-full min-h-screen p-6 flex justify-center items-center">
        <div className="w-full max-w-[800px]   h-[700px] sm:h-[500px] rounded-2xl shadow-lg overflow-hidden relative">
          <div className={`absolute w-full h-[30%] border-red-500 sm:h-full   sm:w-1/2  bg-blue-500 ${login?"rounded-b-[30%] sm:rounded-r-[30%] sm:rounded-l-none":"rounded-t-[30%] sm:rounded-l-[30%] sm:rounded-r-none"} z-20 transition-all duration-700 ease-in-out ${login?"translate-y-0 sm:translate-x-0 sm:translate-y-0":"translate-y-[233.33%] sm:translate-x-full sm:translate-y-0"}`}>
              <div className="flex justify-center items-center flex-col h-full gap-2">
                <div className="text-xl sm:text-3xl font-bold text-white">{login?"Hello, Welcome!":"Welcome Back!"}</div>
                <div className="text-base sm:text-md font-light text-white">{login?"Don't have a account?":"Already have an account?"}</div>
                <button className="border-white hover:bg-white hover:text-blue-500 transition-all duration-200 border-2 cursor-pointer h-10 text-sm font-medium tracking-wide w-40 mt-2 flex items-center justify-center text-white rounded-sm outline-none" onClick={handleToggle}>{login?"Register":"Login"}</button>
              </div>  
            </div>
            <div className={` absolute sm:w-1/2 z-10 w-full h-[70%] sm:h-full flex flex-col gap-4 justify-center items-center px-4 transition-all duration-700 ease-in-out ${login? "translate-y-[40%] sm:translate-y-0 sm:translate-x-full":"-translate-y-3 sm:translate-y-0 sm:translate-x-0"}`}
            >
              <div className="text-3xl tracking-wide font-bold">{login?"Login":"Registration"}</div>
              {!login && <div className="flex w-full  shadow-md bg-white justify-between rounded-md outline-none">
              <input value={user.name} type="text"className="w-full custom-autofill bg-white custom-autofill   text-base pl-4 py-3 outline-none"  placeholder='Username' name='name' onChange={handleUserData}/>
              <div className="w-[25%] bg-white flex justify-end items-center outline-none pr-2">
                  <img src={assets.user} alt="" className="w-5 h-5" />
              </div>
            
            </div>}
            <div className="flex w-full shadow-md  bg-white justify-between rounded-md outline-none">
              <input value={user.email} type="email"className="w-full custom-autofill  text-base pl-4 py-3 outline-none"  placeholder='Email' name='email' onChange={handleUserData}/>
              <div className="w-[25%] flex bg-white  justify-end items-center outline-none pr-2">
                  <img src={assets.email} alt="" className="w-5 h-5"  />
              </div>
            
            </div>
            <div className="flex w-full shadow-md bg-gray-200 justify-between rounded-md outline-none">
            <input value={user.password} type={visibility?"text":"password"} className="password-input custom-autofill bg-white w-full  text-base pl-4 py-3 outline-none"  placeholder='Password' name='password' onChange={handleUserData}/>
            <div className="w-[25%] bg-white flex justify-end items-center outline-none pr-2">
                {!visibility?<EyeOff onClick={() => setVisibility(!visibility)} className="w-5 h-5 cursor-pointer"/>:<Eye onClick={() => setVisibility(!visibility)} className="w-5 h-5 cusor-pointer"/>}
            </div>
            </div>
            {login && <div onClick={handleForgotPassword} className="text-center text-sm tracking-tight font-light cursor-pointer">Forgot Password?</div>}
            <button className="w-full px-2 py-3 bg-blue-500 flex items-center justify-center font-semibold text-md text-white rounded-md cursor-pointer outline-none" onClick={handleVerifyUserData}>{login?"Log in":"Sign up"}</button>
            {error && <div className="mb-4 px-4 py-3 rounded-md bg-red-100 text-red-700 text-sm font-medium border border-red-300 shadow-sm">
              {error}
            </div>}
            <div className="text-center font-light text-sm">or login with social platforms</div>
            <div className="flex gap-2 mt-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-md border-2 shadow-sm cursor-pointer border-gray-300" onClick={() => handleOauth2Login("google")}>
                  <img src={assets.google}  alt="" className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-md cursor-pointer border-2 shadow-sm  border-gray-300" onClick={() => handleOauth2Login("github")}>
                  <img src={assets.github}  alt="" className="w-5 h-5" />
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage
