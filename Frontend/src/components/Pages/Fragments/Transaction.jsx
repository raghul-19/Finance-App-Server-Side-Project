import React, { useEffect, useState } from 'react'
import {HomePage, TransactionModel, DeleteModel,TransactionChart} from '../util/index'
import { Download, LoaderCircle, Mail, Trash, Trash2, TrendingDown, TrendingUp } from 'lucide-react'
import { useSelector } from 'react-redux'
import { SelectAllIncomes } from '../../../redux/Slice/incomeSlice'
import { SelectAllExpenses } from '../../../redux/Slice/expenseSlice'
import apiCalls from '../../../redux/utils/apiCalls'
import { toast } from 'react-toastify'
import { formatDate } from '../../../assets/data'

const Transaction = ({income}) => {

  const [incomeModel,setIncomeModel]=useState(false);
  const {fetchError,fetchLoading}=useSelector((state) => income?state.income:state.expense);
  const [deleteModel,setDeleteModel]=useState(false);
  const [selectedTransaction,setSelectedTransaction]=useState(null);
  const transactions=useSelector(income?SelectAllIncomes:SelectAllExpenses);
  const [downloadLoading,setDownloadLoading]=useState(false);
  const [emailLoading,setEmailLoading]=useState(false);
  const [delay,setDelay]=useState(true);


  useEffect(() => {
    if(selectedTransaction) {
      setDeleteModel(true);
    }
  },[selectedTransaction])

  useEffect(() => {
    const timeout=setTimeout(() => setDelay(false),1000);
    return () => clearTimeout(timeout); 
  })


 

  const transactionChartData=transactions && transactions.map((transaction) => {
    return ({date:transaction.date,amount:transaction.amount,time:transaction.createdAt});
  })
  console.log(transactionChartData?transactionChartData:null);
  
  const handleDataRender=() => {
    if(fetchLoading) {
      return Array.from({length:4},() => {
        return (
          <div className="flex max-[450px]:flex-col  px-3 py-4 rounded-md group border border-gray-200">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="flex flex-col justify-center">
                <div className="w-35 h-3 bg-gray-200 animate-pulse"></div>
                <div className="w-20 h-3 bg-gray-200 mt-1 animate-pulse"></div>
              </div>
            </div>
            <div className="ml-1 grow flex h-full max-[450px]:mt-4 max-[450px]:justify-start justify-end">
              <div className="flex gap-2 items-center flex-shrink-0">
                <div className="w-5 h-5  bg-gray-200 animate-pulse rounded-xs"></div>
                <div className="w-20 h-8 rounded-md bg-gray-200 animate-pulse"></div>
              </div>
            </div>

          </div>
        )
      })
    } else {
      if(!delay && transactions && transactions.length==0 && !fetchError) {
        return (
          <div className="mb-4/ mt-3 px-4 py-3 rounded-md bg-red-100 text-red-700 text-sm font-medium border border-red-300 shadow-sm w-fit">
              {income?"No incomes add yet":"No expenses add yet"}
          </div>
        )
      }
      const data=transactions && transactions.map((transaction) => {
        return (
          <div className="flex max-[450px]:flex-col  hover:bg-gray-100/60 px-3 py-4 rounded-md group">
              <div className="flex gap-4">
                  <div className="w-12 h-12  rounded-full flex justify-center items-center bg-gray-200">
                    <img src={transaction.imageUrl} className="w-12 h-12 rounded-full object-cover object-center" alt="" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="font-medium font-md line-clamp-1">{transaction.name}</div>
                    <div className="text-gray-500 text-sm">{formatDate(transaction.date)}</div>
                  </div>
                </div>
                <div className="ml-1 grow flex h-full max-[450px]:mt-4 max-[450px]:justify-start justify-end">
                  <div className="flex gap-2 items-center flex-shrink-0">
                    <Trash2 onClick={() => setSelectedTransaction(transaction)} className="hover:text-red-500 transition-colors duration-200 font-light w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 cursor-pointer"/>
                    <div className={`px-3 py-2 ${income?"bg-green-300/20":"bg-red-300/20"}  flex items-center rounded-sm`}>
                      <div className={`${income?"text-green-700":"text-red-700"}  text-sm font-bold`}>+{" "}₹{Math.round(parseFloat(transaction.amount)).toLocaleString('en-IN')}</div>
                      {income ?<TrendingUp strokeWidth={3} className={`w-5 h-5 text-green-700 ml-2`}/>:<TrendingDown strokeWidth={3} className={`w-5 h-5 text-red-700 ml-2 font-semibold`}/>}
                    </div>
                  </div>
                </div>
              </div>
        )
      })
      return data;

    }
  }


  const handleEmailRecords= async () => {

    try {
      setEmailLoading(true);
      await apiCalls.sendMailTransactionExcelDataSet(income);
      await new Promise(resolve => setTimeout(resolve,2000));
      setEmailLoading(false);
      toast.success("Email sent successfully");
    } catch(e) {``
      await new Promise(resolve => setTimeout(resolve,2000));
      setEmailLoading(false);
      console.log(e.message);
      toast.error("Something went wrong!");
    }
    
  }

  const handleDownLoadRecords= async () => {
    try {
      setDownloadLoading(true);
      const response=await apiCalls.fetchTransactionExcelDataSet(income);
      const url=URL.createObjectURL(response.data);
      const link=document.createElement("a");
      link.href=url;
      link.setAttribute("download",`${income?"income_records":"expense_records"}.xlsx`);
      document.body.appendChild(link);
      await new Promise(resolve => setTimeout(resolve,2000));
      setDownloadLoading(false);
      link.click();
      toast.success("Downloaded successfully");

    } catch(e) {
      await new Promise(resolve => setTimeout(resolve,2000));
      setDownloadLoading(false);
      toast.error("Something went wrong");
      console.log(e.message);
    }

  }
  return (
    <HomePage>
      <button onClick={() => setIncomeModel(true)} className="px-3 w-fit rounded-md py-3 outline-none bg-green-300/20 flex justify-center items-center cursor-pointer focus:ring-2 focus:ring-green-500 transition-colors duration-200">
        <div className="text-green-700 text-sm font-semibold">{income?"+ Add Income":"+ Add Expense"}</div>
      </button>
      <div className="mt-5 w-full px-5 py-6 bg-white shadow-lg rounded-xl">
        <div className="font-medium min-[500px]:text-lg text-xl">{income?"Income Overview":"Expense Overview"}</div>
        <div className="mt-1 flex justify-between items-center gap-3">
          <div className="font-medium text-sm text-gray-500">{income?"Track your earnings over time and analyse your income trends.":"Track your spending trends over time and gain insights into where your money goes."}</div>
        </div>
        <div className="w-full mt-5">
          <TransactionChart data={transactionChartData}/>
        </div>
      </div>
      <div className="w-full mt-5 px-5 py-6 bg-white shadow-lg rounded-xl">
        <div className="flex flex-col min-[500px]:flex-row min-[500px]:justify-between gap-4 min-[500px]:gap-2 items-center">
          <div className="font-medium min-[500px]:text-lg text-xl">{income?"Income Sources":"All Expenses"}</div>
          <div className="flex items-center gap-4">
            <div onClick={handleEmailRecords} className="px-4 bg-neutral-100/30 border border-gray-200 flex items-center justify-center gap-3 h-10 rounded-lg hover:text-purple-500 transition-colors duration-200 cursor-pointer">
              {emailLoading?<LoaderCircle className="w-4 h-4 animate-spin"/>:<Mail className="w-4 h-4"/>}
              <div className="text-sm font-semibold">Email</div>
            </div>
            <div onClick={handleDownLoadRecords}  className="px-4 bg-neutral-100/30 border border-gray-200 flex items-center justify-center gap-3 h-10 rounded-lg hover:text-purple-500 transition-colors duration-200 cursor-pointer">
              {downloadLoading?<LoaderCircle className="w-4 h-4 animate-spin"/>:<Download className="w-4 h-4"/>}
              <div className="text-sm font-semibold">Download</div>
            </div>
          </div>
        </div>
        <div className="mt-5 grid md:grid-cols-2 gap-4 w-full">
          {handleDataRender()}
        </div>
        {fetchError && 
            <div className="mb-4/ mt-3 px-4 py-3 rounded-md bg-red-100 text-red-700 text-sm font-medium border border-red-300 shadow-sm w-fit">
              {fetchError}
            </div>   
        }
      </div>
      {incomeModel && <TransactionModel setClose={setIncomeModel} income={income?true:false}/>}
      {deleteModel && <DeleteModel setOpen={setDeleteModel} income={income?selectedTransaction:null} setSource={setSelectedTransaction} expense={income?null:selectedTransaction}/>}
    </HomePage>
  )
}

export default Transaction;
