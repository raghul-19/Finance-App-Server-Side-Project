import React from 'react'
import { LoaderCircle, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { actiontypes } from '../../../redux/utils/actionTypes';

const DeleteModel = ({setOpen, income, setSource, expense}) => {

  const {error,loading,success}=useSelector((state) => income?state.income:state.expense);
  const dispatch=useDispatch();
  
  useSelector(() => {  
    if(success) {
        setSource(null);
        setOpen(false);
    }
  },[success])

  return (
    <div className="w-full h-full fixed p-3 z-30 inset-0 overflow-y-auto bg-black/40 backdrop-blur-sm flex justify-center items-center">
        <div className="sm:w-150 w-full flex flex-col divide-y-1 divide-gray-200 bg-white rounded-md shadow-md overflow-y-auto">
            <div className="flex justify-between items-center gap-2 px-5 py-4">
                <div className="font-bold text-lg">{income?"Delete Income":"Delete Expense"}</div>
                <div className="flex items-center">
                    <button  className="w-8 h-8 bg-gray-200 rounded-sm flex items-center justify-center focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 outline-none cursor-pointer" onClick={() => {setSource(null);setOpen(false)}}>
                        <X strokeWidth={3} className="w-4 h-4"/>
                    </button>
                </div>
            </div>
            <div className="p-5 md:p-6">
                <div className="mt-3 font-medium text-sm">Are you sure want to delete this {income?"income":"expense"} details?</div>
                <div className="mt-3 flex justify-end items-center">
                    <button className="px-4 outline-none py-2 flex items-center justify-center bg-purple-500  transition-colors duration-200 rounded-md text-sm text-white font-medium cursor-pointer"
                       onClick={() => dispatch({type:income?actiontypes.DELETE_INCOME:actiontypes.DELETE_EXPENSE,payload:income?{id:income.id,incomeId:income.incomeId}:{id:expense.id,expenseId:expense.expenseId}})}
                    >
                    {loading && <LoaderCircle className="w-4 h-4 animate-spin mr-1"/>}
                    <div>Delete</div>
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
  )
}

export default DeleteModel
