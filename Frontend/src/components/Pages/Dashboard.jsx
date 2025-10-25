import React, { useEffect, useState } from 'react'
import {FinancialOverviewChart, HomePage} from './util/index'
import { ArrowRight, BringToFront, TrendingDown, TrendingUp, Wallet, WalletCards } from 'lucide-react'
import { formatDate } from '../../assets/data'
import apiCalls from '../../redux/utils/apiCalls'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  
  const [dashboardData,setDashBoardData]=useState([]);
  const [loading,setLoading]=useState(true);
  const navigate=useNavigate();
  const [delay,setDelay]=useState(true);
  const [error, setError]=useState("");
  
  useEffect(() => {
    const timeout=setTimeout(() => setDelay(false),1000);
    const handleFetchDashboardDataSet=async () => {
      setLoading(true);
      try {
        const response=await apiCalls.fetchDashboardDataSet();
        await new Promise(resolve => setTimeout(resolve,2000));
        setLoading(false);
        setDashBoardData(response.data);
       
      } catch(e) {
        await new Promise(resolve => setTimeout(resolve,2000));
        console.log(e.message);
        setLoading(false);
        setError("Internal server error");
      }
      
    }
    handleFetchDashboardDataSet();

    return () => clearTimeout(timeout)

  },[])

  const handleRecentTransactionsRender=() => {
    if(loading) {
      const data=
      Array.from({length:5}, () => {
        return transactionLoadingSchema();
      })
      return data;
    } else {
      if(!delay && dashboardData &&  dashboardData.RecentTransactions.length===0) {
        return( 
          <div className="mb-4/ mt-3 px-4 py-3 rounded-md bg-red-100 text-red-700 text-sm font-medium border border-red-300 shadow-sm w-fit">
                No incomes and expenses are added yet!
          </div>
        )
      }
      const data= dashboardData.RecentTransactions &&
        dashboardData.RecentTransactions.map((transaction) => {
          return (
            <div className="flex flex-col min-[500px]:flex-row px-3 py-4 hover:bg-gray-100/60 rounded-md w-full space-y-3">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex justify-center items-center">
                  <img src={transaction.imageUrl} className="w-full h-full rounded-full object-cover object-center" alt="" />
                </div>
                <div className="flex justify-center flex-col">
                  <div className="font-medium text-md line-clamp-1">{transaction.name}</div>
                  <div className="text-gray-500 text-sm line-clamp-1">{formatDate(transaction.date)}</div>
                </div>
              </div>
              <div className="grow flex min-[500px]:justify-end justify-start items-center">
                <div className={`px-3 py-2 ${transaction.type.toLowerCase()==="income"?"bg-green-300/20":"bg-red-300/20"}  flex justify-center items-center gap-1 rounded-sm flex-shrink-0`}>
                  <div className={`text-sm font-bold ${transaction.type.toLowerCase()==="income"?"text-green-700":"text-red-700"} `}>+{" "}₹{Math.round(parseFloat(transaction.amount)).toLocaleString('en-IN')}</div>
                  {transaction.type.toLowerCase()==="income"?<TrendingUp strokeWidth={3} className="w-5 h-5 text-green-700"/>:<TrendingDown strokeWidth={3} className="w-5 h-5 text-red-700"/>}
                </div>
              </div>
            </div>
          )
        })
      return data;

    }
  }
  const handleRecentIncomesRender=() => {
    if(loading) {
      const data=
      Array.from({length:5}, () => {
        return transactionLoadingSchema();
      })
      return data;
    } else {
      if(!delay && dashboardData &&  dashboardData.Latest5Incomes.length===0) {
        return( 
          <div className="mb-4/ mt-3 px-4 py-3 rounded-md bg-red-100 text-red-700 text-sm font-medium border border-red-300 shadow-sm w-fit">
                No incomes are added yet!
          </div>
        )
      }
      const data= dashboardData.Latest5Incomes &&
        dashboardData.Latest5Incomes.map((income) => {
          return (
            <div className="flex flex-col min-[500px]:flex-row px-3 py-4 hover:bg-gray-100/60 rounded-md w-full space-y-3">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex justify-center items-center">
                  <img src={income.imageUrl} className="w-full h-full rounded-full object-cover object-center" alt="" />
                </div>
                <div className="flex justify-center flex-col">
                <div className="font-medium text-md line-clamp-1">{income.name}</div>
                <div className="text-gray-500 text-sm line-clamp-1">{formatDate(income.date)}</div>
                </div>
              </div>
              <div className="grow flex min-[500px]:justify-end justify-start items-center">
                <div className={`px-3 py-2 bg-green-300/20  flex justify-center items-center gap-1 rounded-sm flex-shrink-0`}>
                  <div className={`text-sm font-bold text-green-700`}>+{" "}₹{Math.round(parseFloat(income.amount)).toLocaleString('en-IN')}</div>
                  <TrendingUp strokeWidth={3} className="w-5 h-5 text-green-700"/>
                </div>
              </div>
            </div>
          )
        })
      return data;

    }
  }
  const handleRecentExpensesRender=() => {
    if(loading) {
      const data=Array.from({length:5},() => {
        return transactionLoadingSchema();
      })
      return data;
    } else {
      if(!delay && dashboardData &&  dashboardData.Latest5Expenses.length===0) {
        return( 
          <div className="mb-4/ mt-3 px-4 py-3 rounded-md bg-red-100 text-red-700 text-sm font-medium border border-red-300 shadow-sm w-fit">
                No expenses are added yet!
          </div>
        )
      }
      const data= dashboardData.Latest5Expenses &&
        dashboardData.Latest5Expenses.map((expense) => {
          return (
            <div className="flex flex-col min-[500px]:flex-row px-3 py-4 hover:bg-gray-100/60 rounded-md w-full space-y-3">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex justify-center items-center">
                  <img src={expense.imageUrl} className="w-full h-full rounded-full object-cover object-center" alt="" />
                </div>
                <div className="flex justify-center flex-col">
                <div className="font-medium text-md line-clamp-1">{expense.name}</div>
                <div className="text-gray-500 text-sm line-clamp-1">{formatDate(expense.date)}</div>
                </div>
              </div>
              <div className="grow flex min-[500px]:justify-end justify-start items-center">
                <div className={`px-3 py-2 bg-red-300/20  flex justify-center items-center gap-1 rounded-sm flex-shrink-0`}>
                  <div className={`text-sm font-bold text-red-700`}>+{" "}₹{Math.round(parseFloat(expense.amount)).toLocaleString('en-IN')}</div>
                  <TrendingDown strokeWidth={3} className="w-5 h-5 text-red-700"/>
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
      {
        error &&

        <div className="absolute w-screen min-h-screen bg-white z-30 gap-1 flex flex-col items-center justify-center">
          <div className="w-100 p-2 border border-gray-200 ring-2 ring-red-500  rounded-md">
              <div className="flex flex-col justify-center items-center p-6">
                  <div className="text-red-500 text-6xl mb-4">⚠️</div>
                  <div className="font-bold text-xl text-gray-800 mb-2">Token Expired</div>
                  <div className="font-medium text-md text-gray-600 text-center mb-4">
                      The password reset link has expired or is invalid. Please request a new password reset link.
                  </div>
              </div>
          </div>
        </div>
      }
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {loading
        ?
        <TransactionSummarySchemaLoading/>
        :
        <div className="p-5 bg-white rounded-lg   shadow-md flex gap-4">
          <div className="w-14 h-14 bg-purple-800 border border-purple-800 rounded-full flex items-center justify-center">
            <WalletCards strokeWidth={2} className="text-white w-6 h-6"/>
          </div>
          <div className="flex flex-col gap-1 justify-center">
            <div className="font-medium text-sm text-gray-500">{dashboardData && Number(dashboardData.Balance)>=0 ?"Total Balance":"Net Deficit"}</div>
            <div className="font-semibold text-lg">{dashboardData && Number(dashboardData.Balance)<0?"-":""} ₹{dashboardData && Math.round(parseFloat(Math.abs(dashboardData.Balance))).toLocaleString('en-IN')}</div>
          </div>
        </div>
        }
        {loading
        ?
        <TransactionSummarySchemaLoading/>
        :
        <div className="p-5 bg-white rounded-lg  shadow-md flex gap-4">
          <div className="w-14 h-14 bg-green-800 border border-green-800 rounded-full flex items-center justify-center">
            <Wallet strokeWidth={2} className="text-white w-6 h-6"/>
          </div>
          <div className="flex flex-col gap-1 justify-center">
            <div className="font-medium text-sm text-gray-500">Total Income</div>
            <div className="font-semibold text-lg">₹{dashboardData && Math.round(parseFloat(Math.abs(dashboardData.Income))).toLocaleString('en-IN')}</div>
          </div>
        </div>}
        {loading
        ?
        <TransactionSummarySchemaLoading/>
        :
        <div className="p-5 bg-white rounded-lg  shadow-md flex gap-4">
          <div className="w-14 h-14 bg-red-800 border border-red-800 rounded-full flex items-center justify-center">
            <BringToFront strokeWidth={2} className="text-white w-6 h-6"/>
          </div>
          <div className="flex flex-col gap-1 justify-center">
            <div className="font-medium text-sm text-gray-500">Total Expense</div>
            <div className="font-semibold  text-lg">₹{dashboardData && Math.round(parseFloat(Math.abs(dashboardData.Expense))).toLocaleString('en-IN')}</div>
          </div>
        </div>}
      </div>
      <div className="flex flex-col-reverse min-[950px]:flex-row gap-4 mt-10">
        <div className="px-6 py-5 bg-white rounded-xl border border-gray-200 flex flex-col shadow-md w-full min-[950px]:w-1/2">
          <div className="font-medium text-lg">Recent Transactions</div>
          <div className="flex flex-col w-full mt-5 gap-3">
            {handleRecentTransactionsRender()}
          </div>
        </div> 
        <div className="px-6 pt-5 pb-10 bg-white rounded-xl border border-gray-200 flex flex-col shadow-md w-full h-fit min-[950px]:w-1/2">
          <div className="font-medium text-lg">Financial Overview</div>
          {loading ?
          <div className="flex flex-col mt-4  items-center h-full bg-white w-full">
            <div className="w-60 h-60 rounded-full border-20 animate-pulse flex flex-col gap-2 justify-center items-center border-gray-200">
              <div className="w-30 h-3 bg-gray-200 animate-pulse"></div>
              <div className="w-25 h-3 bg-gray-200 animate-pulse"></div>
            </div>
            <div className="flex mt-6 flex-wrap justify-center gap-4 items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="w-15 h-2 bg-gray-200 animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="w-15 h-2 bg-gray-200 animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="w-15 h-2 bg-gray-200 animate-pulse"></div>
              </div>
            </div>
          </div>
          :
          dashboardData && <FinancialOverviewChart totalIncome={Number(dashboardData.Income)} totalExpenses={Number(dashboardData.Expense)} totalBalance={Number(dashboardData.Balance)}/>
        }
          
          
        </div>
      </div>
      <div className="flex flex-col min-[950px]:flex-row gap-4 mt-6">
        <div className="px-6 py-5 bg-white rounded-xl border border-gray-200 flex flex-col shadow-md w-full min-[950px]:w-1/2">
          <div className="flex justify-between items-center gap-2">
            <div className="font-medium text-lg">Recent Expenses</div>
            <button onClick={() => navigate("/expense")} className="px-4 outline-none text-gray-500 focus:ring-offset-2 focus:ring-2 focus:ring-blue-500 bg-neutral-100/30 border border-gray-200 flex items-center justify-center gap-3 h-8 rounded-lg hover:text-purple-500 transition-colors duration-200 cursor-pointer">
              <div className="text-sm font-semibold">More</div>
              <div className="flex items-center h-full">
                <ArrowRight className="w-5 h-5"/>
              </div>
              
            </button>
          </div>
          <div className="flex flex-col w-full mt-5 gap-3">
            {handleRecentExpensesRender()}
          </div>
        </div>
        <div className="px-6 py-5 bg-white rounded-xl border border-gray-200 flex flex-col shadow-md w-full min-[950px]:w-1/2">
        <div className="flex justify-between items-center gap-2">
            <div className="font-medium text-lg">Recent Incomes</div>
            <button onClick={() => navigate("/income")} className="px-4 outline-none text-gray-500 focus:ring-offset-2 focus:ring-2 focus:ring-blue-500 bg-neutral-100/30 border border-gray-200 flex items-center justify-center gap-3 h-8 rounded-lg hover:text-purple-500 transition-colors duration-200 cursor-pointer">
              <div className="text-sm font-semibold">More</div>
              <div className="flex items-center h-full">
                <ArrowRight className="w-5 h-5"/>
              </div>
              
            </button>
          </div>

          <div className="flex flex-col w-full mt-5 gap-3">
            {handleRecentIncomesRender()}
          </div>
        </div>
      </div>
    </HomePage>
  )
} 

const transactionLoadingSchema=() => {
  return (
    
    <div className="flex flex-col min-[500px]:flex-row px-3 py-4 hover:bg-gray-100/60 rounded-md w-full space-y-3">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse flex justify-center items-center"></div>
        <div className="flex justify-center flex-col gap-1">
          <div className="w-30 h-3 bg-gray-200 animate-pulse"></div>
                <div className="w-25 h-3 bg-gray-200 animate-pulse"></div>
          </div>
        </div>
        <div className='grow flex min-[500px]:justify-end justify-start items-center'>
          <div className="w-20 h-5 bg-gray-200 flex-shrink-0 animate-pulse"></div>
        </div>
     </div>
  )
}

const TransactionSummarySchemaLoading=() => {
  return (
    <div className="p-5 bg-white rounded-lg shadow-md flex gap-4">
      <div className="w-14 h-14 rounded-full bg-gray-200 animate-pulse"></div>
      <div className="flex flex-col gap-1 justify-center">
        <div className="w-30 h-3 bg-gray-200 animate-pulse"></div>
        <div className="w-25 h-3 bg-gray-200 animate-pulse"></div>
      </div>
    </div>
  )
}
  


export default Dashboard
