import React from 'react'
import {NavBar,SideBar} from './util/index'

const HomePage = ({children}) => {
  return (
    <div className="relative">
      <NavBar/>
      <div className="w-full pt-1  min-h-screen flex relative mt-20">
        <div className="max-[1110px]:hidden fixed top-20 left-0 inset-0 overflow-y-auto w-64 min-h-screen">
            <SideBar/>
        </div>
        <div className="max-[1110px]:mx-6 grow py-5 min-[1110px]:ml-70 min-[1110px]:mr-6">
            {children}
        </div>
      </div>
     
    </div>
  )
}

export default HomePage
