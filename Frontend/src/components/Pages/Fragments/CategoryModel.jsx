import { X, ChevronDown, Image, LoaderCircle } from 'lucide-react'
import React, { useState, useRef, useEffect} from 'react'
import { useSelector , useDispatch} from 'react-redux';
import {actiontypes} from '../../../redux/utils/actionTypes';
import { restoreCategorySuccess } from '../../../redux/Slice/categorySlice';

const CategoryModel = ({isClose, onCategoryTypeChange,category}) => {
  const {loading,error,success}=useSelector((state) => state.category);
  const dispatch=useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Income');
  const [categoryName,setCategoryName]=useState("");
  const dropdownRef = useRef(null);
  const fileRef=useRef(null);
  const addRef=useRef(null);
  const [image,setImage]=useState(null);
  const [imageCheck,setImageCheck]=useState("");
  const options = ['Income', 'Expense'];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if(category) {
      setCategoryName(category.name);
      const type=category.type.charAt(0).toUpperCase()+category.type.slice(1);
      setSelectedOption(type);
    }
  },[])

  useEffect(() => {

    if(success) {
      setCategoryName("");
      setImage(null);
      setSelectedOption("Income");
      dispatch(restoreCategorySuccess());
      isClose(false);
    }

  },[success])

  useEffect(() => {
    if((category || image) && categoryName.trim() && selectedOption.trim()) {
      addRef.current.disabled=false;
    } else {
      addRef.current.disabled=true;
    }
  },[image,categoryName,selectedOption]);

  const handleImageUpload=(e) => {

    const selectedFile=e.target.files[0];
    if(selectedFile && (selectedFile.name.toLowerCase().endsWith(".jpg") || selectedFile.name.toLowerCase().endsWith(".png"))) {
      setImage(selectedFile);
      setImageCheck("");
    } else {
      setImage(null);
      setImageCheck("Choose valid image file");
    }
  }

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    
    if (onCategoryTypeChange) {
      onCategoryTypeChange(option);
    }
    
    console.log('Selected Category Type:', option);
  };

  const handleAddCategory=async () => {
    const data=new FormData();
    const newCategory={
      name:categoryName,
      email:localStorage.getItem("email"),
      type:selectedOption,
    };
    console.log(newCategory);
    console.log(localStorage.getItem("token"));
    data.append("data",new Blob([JSON.stringify(newCategory)],{type:"application/json"}));
    data.append("file",image);
    dispatch({type:actiontypes.ADD_CATEGORY,payload:data});

  }
  const handleUpdateCategory=() => {
    const data=new FormData();
    const updateCategory={
      name:categoryName,
      email:localStorage.getItem("email"),
      type:selectedOption,
      categoryId:category.categoryId,
      imageUrl:category.imageUrl,

    };
    data.append("data",new Blob([JSON.stringify(updateCategory)],{type:"application/json"}));
    if(image) {
      data.append("file",image);
    }
    dispatch({type:actiontypes.UPDATE_CATEGORY,payload:data});
  }
  return (
    <div className="w-full h-full fixed  bg-black/40 backdrop-blur-sm flex justify-center items-center  z-30 inset-0 p-3">
      <div className="bg-white w-full sm:w-150 shadow-md rounded-md">
        <div className="flex flex-col divide-y-1 divide-gray-300">
            <div className="py-4 px-5 flex justify-between items-center gap-2">
                <div className="font-bold text-lg">{category?"Update Category":"Add Category"}</div>
                <div className="flex items-center">
                    <button onClick={() => isClose(false)} className="w-8 h-8 bg-gray-200 rounded-sm flex items-center justify-center cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-100">
                        <X className="w-4 h-4"></X>
                    </button>
                </div>
            </div>
            <div className="p-5 md:p-6">
                <div className="mt-3 flex gap-4 items-center">
                  <div className="cursor-pointer w-12 h-12 rounded-md bg-purple-500/20 flex justify-center items-center shadow-md outline-none">
                    {(!image && !category)?<Image className="text-purple-500"/>:<img src={image?URL.createObjectURL(image):category.imageUrl} className="w-full h-full rounded-md object-cover object-center"/>}
                    <input onChange={handleImageUpload} ref={fileRef}  type="file" className="hidden"/>
                  </div>
                  <div onClick={() => fileRef.current.click()} className="font-medium text-md cursor-pointer hover:text-purple-500">{!image && !category?"Pick one":"Change icon"}</div>
                  
                </div>
                {imageCheck &&
                  <div className="mt-3 px-4 py-3 rounded-md bg-red-100 text-red-700 text-sm font-medium border border-red-300 shadow-sm">
                    {imageCheck}
                  </div>
                }
                <div className="mt-6 font-medium text-md">Category Name</div>
                <input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} type="text" className="w-full focus:shadow-md  px-2 py-2 text-sm border focus:border-2 focus:border-blue-500 border-gray-200 outline-none mt-2 rounded-md" placeholder='e.g., Freelance,Salary,Groceries...' />
                <div className="mt-3 font-medium text-md">Category Type</div> 
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-transparent w-full mt-2 text-sm border border-gray-200 outline-none px-2 py-2 rounded-md relative focus:border-2 focus:border-blue-500 flex justify-between items-center"
                  >
                    <span>{selectedOption}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                      {options.map((option) => (
                        <div
                          key={option}
                          onClick={() => handleOptionClick(option)}
                          className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-500 hover:text-white transition-colors duration-150"
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="w-full flex justify-end">
                  <button onClick={category?handleUpdateCategory:handleAddCategory} ref={addRef} className="flex justify-center focus:ring-2 outline-none transition-colors duration-200  focus:ring-offset-2 focus:ring-blue-500 cursor-pointer  mt-3 bg-purple-500 rounded-md text-sm font-medium text-white disabled:bg-blue-300 disabled:cursor-not-allowed items-center p-2">
                    {loading && <LoaderCircle className="w-4 h-4 animate-spin mr-1"/>}
                    <div>{category?(loading?"Updating...":"Update Category"):(loading?"Adding...":"Add Category")}</div>
                  </button>
                </div>
                {error && 
                  <div className="mt-4 px-4 py-3 rounded-md bg-red-100 text-red-700 text-sm font-medium border border-red-300 shadow-sm">
                  {error}
                </div>
                
                }
            </div>
        </div>
        
      </div>
    </div>
  )
}

export default CategoryModel
