import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { pages } from '../../assets/data'
import { useLocation,useNavigate} from 'react-router-dom'
import { AppContext } from '../Pages/util/AppContext'


const SideBar = () => {

  const location=useLocation();
  const navigate=useNavigate();
  const profile=useContext(AppContext);
  return (
    <div className="p-3 h-[100%]  w-64 bg-white">
      <div className="flex flex-col items-center h-full mt-2">
        <div className="w-20 h-20 rounded-full shadow-md">
            <img src={assets.test} className="w-full h-full rounded-full object-cover" alt="" />
        </div>
        <div className="mt-4 font-medium text-md tracking-wide">{profile && profile.name}</div>
        <div className="mt-8 w-full  flex flex-col gap-3">
          {pages.map((page,index) => {
            return (
                <div onClick={() => navigate(page.link)} className={`flex justify-start gap-2 px-2 py-3 items-center hover:text-white cursor-pointer  rounded-md hover:bg-violet-800 ${page.link===location.pathname?"bg-violet-800 text-white":""}`} key={index}>
                    <page.image className={`${page.link===location.pathname?"text-white":""} hover:text-white`}/>
                    <div className="font-medium  text-md">{page.name}</div>
                </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SideBar
