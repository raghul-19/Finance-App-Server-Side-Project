
import axios from 'axios';
import React,{useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../util/AppContext';
import { useDispatch } from 'react-redux';
import { actiontypes } from '../../../redux/utils/actionTypes';

const AppContextProvider = ({children}) => {

  const [profile,setProfile]=useState(null);
  const dispatch=useDispatch();
  const navigate=useNavigate();
  useEffect(() => {
    const fetchUserProfile=async () => {

        const email=localStorage.getItem("email");
        const token=localStorage.getItem("token");

        try {
            if(!email || !token) {
                throw new Error("User is not logged in yet");
            }
            const response=await axios.get(`http://localhost:8080/getProfile?email=${email}`,{
                headers:{
                    "Authorization":`Bearer ${token}`
                }
            });

            setProfile(response.data);
            await dispatch({type:actiontypes.FETCH_CATEGORY});
            await dispatch({type:actiontypes.FETCH_INCOME});
            await dispatch({type:actiontypes.FETCH_EXPENSE});
        } catch (e) {
            console.log(e.message);
            navigate("/login");
            
        }
    }
    fetchUserProfile();
  },[navigate])
  return (
    <AppContext.Provider value={profile}>
        {children}
    </AppContext.Provider>
  )
}

export default AppContextProvider
