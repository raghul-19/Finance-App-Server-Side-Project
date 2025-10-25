import React, { useEffect, useState } from 'react'
import {HomePage,CategoryModel} from './util/index'
import {Pencil} from 'lucide-react'
import {useSelector } from 'react-redux';
import {SelectAllCategories } from '../../redux/Slice/categorySlice';

const Category = () => {

  const [createCategory,setCreateCategory]=useState(false);
  const {fetchError,fetchLoading,success}=useSelector((state) => state.category);
  const categories=useSelector(SelectAllCategories);
  const [updateCategory,setUpdateCategory]=useState(null);
  const [delay,setDelay]=useState(true);
  
  
  useEffect(() => {
    if(!createCategory) {
      setUpdateCategory(null);
    }
  },[createCategory,success])

  useEffect(() => {
    const timeout=setTimeout(() => setDelay(false),1000);
    return () => clearTimeout(timeout);
  })

  

  const handleUpdateCategory=(category) => {
    setUpdateCategory(category);
    setCreateCategory(true);
  }

  const handleDataRender=() => {
    if(fetchLoading) {
      const data=Array.from({length:6},(index) => {
        return (
          <div key={index} className="flex gap-3 px-3 py-4 border shadow-md border-gray-200 animate-pulse group rounded-md w-70">
          <div className="flex  items-center justify-center w-15 h-15 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="flex-col justify-center h-full flex gap-2">
            <div className="bg-gray-200 animate-pulse w-20 h-3"></div>
            <div className="bg-gray-200 animate-pulse w-20 h-3"></div>
          </div>
          <div className="grow h-full flex items-center justify-end">
            <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-full"></div>
          </div>
        </div>
        )
      })
      return data;

    } else {
      
      if(!delay && categories && categories.length==0 && !fetchError) {
        return (
          <div className="mb-4/ mt-3 px-4 py-3 rounded-md bg-red-100 text-red-700 text-sm font-medium border border-red-300 shadow-sm w-fit">
                No categories added yet.
          </div>
        );
      }
      const data=categories && categories.map((category,index) => {
        const type=category.type.charAt(0).toUpperCase()+category.type.slice(1);
        return (
          <div key={index} className="flex gap-3 px-3 py-4  hover:bg-gray-100/60 group rounded-md max-w-80">
              <div className="flex  items-center justify-center w-15 h-15 rounded-full bg-gray-100">
                <img src={category.imageUrl} className="w-full h-full rounded-full object-cover object-center" alt="" />
              </div>
              <div className="flex-col justify-center h-full flex">
                <div className="font-medium text-md line-clamp-1">{category.name}</div>
                <div className="text-gray-400 text-base">{type}</div>
              </div>
              <div className="flex items-center justify-end grow opacity-0 group-hover:opacity-100">
                <div onClick={()=>handleUpdateCategory(category)} className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-gray-200 cursor-pointer  flex items-center justify-center">
                  <Pencil className="hover:text-purple-500 w-5 h-5"/>
                </div>
              </div>
            </div>
        )
      })
      return data;
    }
  }
  return (
    <HomePage>
      <div className="flex flex-col w-full">
        <div className="flex gap-3 justify-between items-center max-[400px]:flex-col">
          <div className="font-bold text-2xl">All Categories</div>
          <button onClick={() => setCreateCategory(true)} className="px-5 py-3 rounded-md text-sm font-semibold cursor-pointer outline-none bg-green-200/30 text-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-100">+ Add Category</button>
        </div>
        <div className="w-full p-4 bg-white mt-8 rounded-sm flex flex-col">
          <div className="font-bold text-lg">Category Sources</div>
           <div className={`mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4`}>
            {handleDataRender()}
          </div>
          {fetchError && 
            <div className="mb-4/ mt-3 px-4 py-3 rounded-md bg-red-100 text-red-700 text-sm font-medium border border-red-300 shadow-sm w-fit">
              {fetchError}
            </div>
            
          }
          
        </div>
        {createCategory && 
          <CategoryModel isClose={setCreateCategory} category={updateCategory}/>
        }
      </div>
    </HomePage>
  )
}

export default Category
