import React, { useEffect, useRef, useState } from 'react'
import {HomePage} from './util/index'
import { Calendar, ChevronDown, LoaderCircle, Search, TrendingDown, TrendingUp } from 'lucide-react'
import {CalendarComponent} from './util/index'
import { formatDate } from '../../assets/data'
import apiCalls from '../../redux/utils/apiCalls'


const Filter = ()  => {

  const [startDate,setStartDate]=useState(null);
  const [endDate,setEndDate]=useState(null);
  const [startDateCalenderOpen,setStartDateCalenderOpen]=useState(false);
  const [endDateCalenderOpen,setEndDateCalenderOpen]=useState(false);
  const [typeOpen,setTypeOpen]=useState(false);
  const typeRef=useRef(null);
  const startDateRef=useRef(null);
  const endDateRef=useRef(null);
  const [type,setType]=useState("Income");
  const [sortType,setSortType]=useState("Date");
  const [sortTypeOpen,setSortTypeOpen]=useState(false);
  const sortRef=useRef(null);
  const [orderType,setOrderType]=useState("Descending");
  const [orderTypeOpen,setOrderTypeOpen]=useState(false);
  const orderRef=useRef(null);
  const [filteredData,setFilteredData]=useState([]);
  const [error,setError]=useState(null);
  const [loading,setLoading]=useState(false);
  const buttonRef=useRef(null);
  const [keyword,setKeyword]=useState("");
  const [isIncome,setIsIncome]=useState(false);

  


  useEffect(() => {
    const handleClickEvent=(event) => {
       if(startDateCalenderOpen && !startDateRef.current.contains(event.target)) {
         setStartDateCalenderOpen(false);
       } 
       if(typeOpen && !typeRef.current.contains(event.target)) {
         setTypeOpen(false);
       }

       if(endDateCalenderOpen && !endDateRef.current.contains(event.target)) {
         setEndDateCalenderOpen(false);
       }

       if(sortTypeOpen && !sortRef.current.contains(event.target)) {
         setSortTypeOpen(false);
       }
       if(orderTypeOpen && !orderRef.current.contains(event.target)) {
         setOrderTypeOpen(false);
       }
    }

    document.addEventListener("mousedown",handleClickEvent);
    return () => document.removeEventListener("mousedown",handleClickEvent);
  })

  useEffect(() => {

    if(type.trim() && startDate && endDate && sortType.trim() && orderType.trim()) {
      buttonRef.current.disabled=false;
    } else {
      buttonRef.current.disabled=true;
    }
    
  },[type,startDate,endDate,sortType,orderType])

  const handleFilterProcess=async () => {

    setLoading(true);
    const request={
      order:orderType,
      field:sortType,
      startDate:startDate,
      endDate:endDate,
      keyword:keyword,
    }
    try {
      const response= await apiCalls.fetchFilteredData(type.toLowerCase(),request);
      await new Promise(resolve => setTimeout(resolve,2000));
      if(response.data.length==0) {
        setFilteredData([]);
        throw new Error();
      }
      setFilteredData(response.data);
      if(type.toLowerCase()==="income") {
        setIsIncome(true);
      } else {
        setIsIncome(false);
      }
      setError(null);
    } catch(e) {
      await new Promise(resolve => setTimeout(resolve,2000));
      console.log(e.message);
      setError("No records available under your filter condition");
    }
    
    setLoading(false);

  }

  return (
    <HomePage>
      <div className="flex flex-col">
        <div className="font-bold text-xl">Filter Transactions</div>
        <div className="mt-5 bg-white rounded-xl shadow-lg px-5 py-6 flex flex-col">
          <div className="font-semibold text-lg">Select the filters</div>
          <div className="mt-5 grid-cols-1 min-[400px]:grid-cols-2 min-[600px]:grid-cols-3 grid min-[750px]:grid-cols-4 min-[900px]:grid-cols-5 gap-2 space-y-3">
            <div className="flex flex-col gap-2">
              <div className="font-medium">Type</div>
              <div className="relative" ref={typeRef}>
                <button onClick={() => setTypeOpen(!typeOpen)} className="flex focus:border-blue-500  outline-none cursor-pointer items-center justify-between border-2 w-full p-2 gap-2 rounded-md">
                  <span  className="font-medium">{type}</span>
                  <ChevronDown strokeWidth={3} className={`w-5 h-5 cursor-pointer transition-transform duration-200 ${typeOpen?"rotate-180":""}`}/>
                </button>
                {typeOpen  && <div className="absolute w-full top-[120%] bg-white shadow-lg rounded-md flex flex-col z-20">
                  <div onClick={() => {setType("Income"); setTypeOpen(false);}} className="px-3 py-2 hover:bg-blue-500 hover:text-white transition-colors duration-200 rounded-md font-medium cursor-pointer">Income</div>
                  <div onClick={() => {setType("Expense"); setTypeOpen(false)}} className="px-3 py-2 hover:bg-blue-500 hover:text-white transition-colors duration-200 rounded-md font-medium cursor-pointer">Expense</div>
                </div>}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-medium">Start Date</div>
              <div className="relative" ref={startDateRef}>
                <button className="p-2 flex focus:border-blue-500 justify-between gap-2 items-center w-full border-2 rounded-md">
                  <span className="font-medium">{startDate? startDate:"yyyy-mm-dd"}</span>
                  <Calendar   onClick={()=>setStartDateCalenderOpen(true)} className="w-5 h-5 hover:text-blue-500 duration-200 cursor-pointer"/>
                </button>
                {startDateCalenderOpen && <CalendarComponent up={false} setDate={setStartDate} onClose={() => setStartDateCalenderOpen(false)}/>}
              </div> 
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-medium">End Date</div>
              <div className="relative" ref={endDateRef}>
                <button className="p-2 flex focus:border-blue-500 justify-between gap-2 items-center w-full border-2 rounded-md">
                  <span className="font-medium">{endDate? endDate:"yyyy-mm-dd"}</span>
                  <Calendar   onClick={()=>setEndDateCalenderOpen(true)} className="w-5 h-5 hover:text-blue-500 duration-200 cursor-pointer"/>
                </button>
                {endDateCalenderOpen && <CalendarComponent up={false} setDate={setEndDate} onClose={() => setEndDateCalenderOpen(false)}/>}
              </div> 
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-medium">Sort Field</div>
              <div className="relative">
                <button onClick={() => setSortTypeOpen(!sortTypeOpen)} className="p-2 focus:border-blue-500 cursor-pointer border-2 flex justify-between items-center w-full rounded-md gap-2">
                  <span className="font-medium">{sortType}</span>
                  <ChevronDown strokeWidth={3} className={`w-5 h-5 transition-transform duration-200 ${sortTypeOpen?"rotate-180":""}`}/>
                </button>
                {sortTypeOpen && <div  ref={sortRef} className="absolute max-h-30 overflow-y-auto hide-scrollbar w-full top-[120%] rounded-md bg-white shadow-lg z-20">
                  <div onClick={() =>{setSortType("Date"); setSortTypeOpen(false)}} className="px-3 py-2 hover:bg-blue-500 hover:text-white font-medium cursor-pointer rounded-md text-md">Date</div>
                  <div onClick={() =>{setSortType("Amount"); setSortTypeOpen(false)}} className="px-3 py-2 hover:bg-blue-500 hover:text-white font-medium cursor-pointer rounded-md text-md">Amount</div>
                  <div onClick={() =>{setSortType("Name"); setSortTypeOpen(false)}} className="px-3 py-2 hover:bg-blue-500 hover:text-white font-medium cursor-pointer rounded-md text-md">Name</div>
                  
                </div>}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-medium">Sort Order</div>
              <div className="relative">
                <button onClick={() => setOrderTypeOpen(!orderTypeOpen)} className="p-2 focus:border-blue-500 cursor-pointer border-2 flex justify-between items-center w-full rounded-md gap-2">
                  <span className="font-medium">{orderType}</span>
                  <ChevronDown strokeWidth={3} className={`w-5 h-5 transition-transform duration-200 ${sortTypeOpen?"rotate-180":""}`}/>
                </button>
                {orderTypeOpen && <div ref={orderRef} className="absolute max-h-30 overflow-y-auto hide-scrollbar w-full top-[120%] rounded-md bg-white shadow-lg z-20">
                  <div onClick={() =>{setOrderType("Ascending"); setOrderTypeOpen(false)}} className="px-3 py-2 hover:bg-blue-500 hover:text-white font-medium cursor-pointer rounded-md text-md">Ascending</div>
                  <div onClick={() =>{setOrderType("Descending"); setOrderTypeOpen(false)}} className="px-3 py-2 hover:bg-blue-500 hover:text-white font-medium cursor-pointer rounded-md text-md">Descending</div>
                </div>}
              </div>
            </div>

          </div>  

          <div className="mt-7  w-full sm:w-100 flex flex-col gap-2">
            <div className="font-medium">Search</div>
            <div className="flex gap-3 items-center">
              <input value={keyword} onChange={(e) => setKeyword(e.target.value)} type="text" className="p-2 border-2 text-base focus:border-blue-500 outline-none font-medium rounded-md" placeholder='Search...' />
              <button onClick={handleFilterProcess} ref={buttonRef} className="flex disabled:bg-blue-300 disabled:cursor-not-allowed justify-center items-center w-10 h-10 bg-purple-500 rounded-md cursor-pointer  outline-none active:bg-purple-300 transition-colors duration-200">
                {loading ?<LoaderCircle strokeWidth={3} className="w-5 h-5 animate-spin text-white"/> :<Search strokeWidth={3} className="text-white w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
        <div className="mt-5 bg-white rounded-xl shadow-lg px-5 py-6 flex flex-col gap-3">
          <div className="font-semibold text-lg">Transactions</div>
          {(filteredData.length===0 && !error) && 
            <div className="text-md font-medium text-gray-500">Select the filters and click apply to filter the transactions.</div>
          }
          { error &&
             <div className="mb-4/ mt-3 px-4 py-3 rounded-md bg-red-100 text-red-700 text-sm font-medium border border-red-300 shadow-sm w-fit">
                  {error}
             </div> 
          }
          <div className="grid grid-cols-1">
            {
              filteredData && filteredData.map((transaction) => {
                return (
                  <div className="flex max-[550px]:flex-col  px-3 py-4 hover:bg-gray-100/60 w-full rounded-md">
                    <div className="flex">
                      <div className="w-12 h-12 rounded-full bg-gray-200">
                        <img src={transaction.imageUrl} className="w-full h-full object-cover object-center rounded-full" alt="" />
                      </div>
                      <div className="flex flex-col justify-center ml-4">
                        <div className="font-medium text-md line-clamp-1">{transaction.name}</div>
                        <div className="text-gray-500 text-sm line-clamp-1">{formatDate(transaction.date)}</div>
                      </div>
                    </div>
                    <div className="flex grow min-[550px]:ml-4 h-full  items-center max-[550px]:justify-start justify-end ">
                      <div className={`flex items-center justify-center gap-2 px-3 py-2 ${isIncome?"bg-green-300/20":"bg-red-300/20"} rounded-sm flex-shrink-0`}>
                        <div className={`text-sm font-bold ${isIncome?"text-green-700":"text-red-700"}`}>+{" "}₹{Math.round(parseFloat(transaction.amount)).toLocaleString('en-IN')}</div>
                        {isIncome?<TrendingUp strokeWidth={3} className="w-5 h-5 text-green-700" />:<TrendingDown strokeWidth={3} className="w-5 h-5 text-red-700" />}
                      </div>
                    </div>
                  </div>
                )
              })
              
              
            }
          </div>
        </div>
      </div>
    </HomePage>
  )
}

export default Filter

