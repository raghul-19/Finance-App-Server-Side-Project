import { X , Image, ChevronDown, Calendar, LoaderCircle} from 'lucide-react'
import React,{useEffect, useRef, useState} from 'react'
import {CalendarComponent} from '../util/index'
import { useDispatch, useSelector } from 'react-redux'
import { SelectAllCategories } from '../../../redux/Slice/categorySlice'
import { actiontypes } from '../../../redux/utils/actionTypes'
import { restoreIncomeSuccess } from '../../../redux/Slice/incomeSlice'
import { restoreExpenseSucess } from '../../../redux/Slice/expenseSlice'

const TransactionModel = ({setClose,income}) => {
  
  
  const [open,setOpen]=useState(false);
  const {error,loading,success}=useSelector((state) => income?state.income:state.expense);
  const [calenderOpen,setCalenderOpen]=useState(false);
  const dispatch=useDispatch();
  const [date,setDate]=useState(null);
  const typeRef=useRef(null);
  const calenderRef=useRef(null);
  const categories=useSelector(SelectAllCategories);
  const submitRef=useRef(null);
  const [name,setName]=useState("");
  const [image,setImage]=useState("");
  const [type,setType]=useState({
    name:"",
    id:"",
  });
  const [amount,setAmount]=useState("");
  const fileRef=useRef(null);
  const [imageCheck,setImageCheck]=useState(null);
  const [categoryOptions,setCategoryOptions]=useState([]);

  useEffect(() => {
    let categoryData=[];
    if(categories && income) {
        categoryData=categories.filter((category) => category.type.toLowerCase()==="income");
    } else if(categories && !income) {
        categoryData=categories.filter((category) => category.type.toLowerCase()==="expense");
    }
    setCategoryOptions(categoryData);
  },[income,categories])


  useEffect(() => {
    const EventClickCheck=(event) => {
        if(open && !typeRef.current.contains(event.target)) {
            setOpen(false);
        }
        if(setCalenderOpen && !calenderRef.current.contains(event.target)) {
            setCalenderOpen(false);
        }
    }
    document.body.addEventListener("mousedown",EventClickCheck);
    return () => document.body.removeEventListener("mousedown",EventClickCheck);
  });

  useEffect(() => {
    if(image && name.trim() && type.name && date && amount) {
        submitRef.current.disabled=false;
    } else {
        submitRef.current.disabled=true;
    }
  })

  useEffect(() => {
    if(success) {
        setName("");
        setAmount("");
        setDate(null);
        setType({name:"",id:""});
        dispatch(income?restoreIncomeSuccess():restoreExpenseSucess());
        setClose(false);
    }
  },[success])

  const uploadImageFile=(e) => {
    const file=e.target.files[0];
    if(file && (file.name.toLowerCase().endsWith(".jpg") || file.name.toLowerCase().endsWith(".png"))) {
        setImage(file);
        setImageCheck(null);
    } else {
        setImageCheck("Choose valid image format");
    }
  }


  const handleAddTransaction=() => {
    const data=new FormData();
    const newTransactionData={
        name:name,
        amount:amount,
        category_id:type.id,
        date:date,
        email:localStorage.getItem("email"),
    }

    data.append("data",new Blob([JSON.stringify(newTransactionData)],{type:"application/json"}));
    data.append("file",image);
    if(income) {
        dispatch({type:actiontypes.ADD_INCOME,payload:data});
    } else {
        dispatch({type:actiontypes.ADD_EXPENSE,payload:data});
    }

  }

    

  return (
    <div className="fixed overflow-y-auto  w-full h-full  flex justify-center items-center backdrop-blur-sm bg-black/40 z-30 inset-0 p-3">
        <div className="bg-white rounded-md shadow-md sm:w-150 w-full overflow-y-auto">
            <div className="flex flex-col divide-y-1 divide-gray-300">
                <div className="flex justify-between gap-2 items-center px-5 py-4">
                    <div className="font-semibold text-lg">{income?"Add Income":"Add Expense"}</div>
                    <div className="flex items-center">
                        <button className="w-8 h-8 bg-gray-200 rounded-sm flex items-center justify-center focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 outline-none cursor-pointer" onClick={() => setClose(false)}>
                            <X strokeWidth={3} className="w-4 h-4"/>
                        </button>
                    </div>
                </div>
                <div className="p-5 md:p-6">
                    <div className="flex gap-4 items-center mt-3">
                        <div className="w-12 h-12 cursor-pointer rounded-md shadow-md bg-purple-500/20 outline-none flex justify-center items-center">
                            {image?<img src={URL.createObjectURL(image)} className="w-full h-full object-cover object-center rounded-md"/>:<Image className="text-purple-500"/>}
                            <input onChange={uploadImageFile} ref={fileRef} type="file" className="hidden"/>
                        </div>
                        <div onClick={() => fileRef.current.click()} className="font-medium text-md hover:text-purple-500 transition-colors duration-200 cursor-pointer">{image?"Change icon":"Pick one"}</div>
                    </div>
                    {imageCheck &&
                        <div className="mt-3 px-4 py-3 rounded-md bg-red-100 text-red-700 text-sm font-medium border border-red-300 shadow-sm">
                            {imageCheck}
                        </div>
                    }
                    <div className="mt-6 font-medium">{income?"Income Name":"Expense Name"}</div>
                    <input onChange={(e) => setName(e.target.value)} value={name} type="text" className="p-2 w-full border border-gray-200 text-sm mt-2 rounded-md outline focus:border-2 focus:shadow-md focus:border-blue-500 outline-none" placeholder='e.g., Salary, Freelance, Bonus'/>
                    <div className="mt-3 font-medium">{income?"Income Type":"Expense Type"}</div>
                    <div className="relative mt-2">
                        <button onClick={() => setOpen(!open)} className="cursor-pointer w-full p-2 border rounded-md border-gray-200 focus:border-2 focus:shadow-md focus:border-blue-500 outline-none flex items-center justify-between gap-2">
                            <span className="text-sm font-medium">{type.name?type.name:"Select Category"}</span>
                            <ChevronDown  className={`w-4 transition-transform duration-200 h-5 cursor-pointer ${open?'rotate-180':""}`} />
                        </button>
                        {open && <div ref={typeRef} className="absolute w-full max-h-40 overflow-y-auto hide-scrollbar bg-white left-0 shadow-lg z-20 rounded-md border top-[112%] border-gray-200 outline-none">
                            {categoryOptions && categoryOptions.map((category,index) => {
                                return (
                                    <div onClick={() => {setType({name:category.name,id:category.categoryId}); setOpen(false)}} key={index} className="font-medium text-sm px-3 py-2 flex items-center cursor-pointer hover:bg-blue-500 hover:text-white transition-colors duration-200 rounded-md">{category.name}</div>
                                )
                            })}
                           
                        </div>}
                    </div>
                    <div className="mt-3 font-medium">Amount</div>
                    <input onChange={(e) => setAmount(e.target.value)} value={amount} placeholder="e.g., 500.00" type="number" className="mt-2 w-full p-2 border border-gray-200 focus:border-2 focus:border-blue-500 focus:shadow-md rounded-md outline-none text-sm"/>
                    <div className="font-medium mt-3">Date</div>
                    <div className="relative mt-2">
                        <button className="p-2 w-full border border-gray-200 text-sm mt-2 rounded-md  focus:border-2 focus:shadow-md focus:border-blue-500 outline-none flex justify-between items-center gap-2">
                            <span className="font-medium text-sm">{date?date:"dd/mm/yyy"}</span>
                            <Calendar className="w-4 h-4 hover:text-blue-500 transition-colors duration-200 cursor-pointer" onClick={() => setCalenderOpen(!calenderOpen)}/>
                        </button>
                        {calenderOpen && <div ref={calenderRef}><CalendarComponent  up={true} setDate={setDate} onClose={() => setCalenderOpen(false)}/></div>}
                    </div>

                    <div className="mt-5 flex justify-end">
                        
                        <button onClick={handleAddTransaction} ref={submitRef} className="disabled:cursor-not-allowed disabled:bg-blue-300  cursor-pointer p-2 flex justify-center items-center bg-purple-500 text-white font-medium  transition-colors duration-200 rounded-md text-sm">
                            {loading && <LoaderCircle className="w-4 h-4 animate-spin mr-1"/>}
                            <div>{income?"Add Income":"Add Expense"}</div>
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

export default TransactionModel;
