
import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

const expenseAdapter=createEntityAdapter({
    selectId:(expense) => expense.expenseId,
    sortComparer:(a,b) => new Date(b.date)-new Date(a.date),
})

const initialState=expenseAdapter.getInitialState({
    fetchLoading:false,
    loading:false,
    success:false,
    error:null,
    fetchError:null,
})

const expenseSlice=createSlice({
    name:"expense",
    initialState,
    reducers:{
        fetchExpenseLoading:(state) => {
            state.fetchLoading=true;
        },
        expenseLoading:(state) => {
            state.loading=true;
        },
        expenseSuccess:(state) => {
            state.fetchLoading=false;
            state.loading=false;
            state.error=null;
            state.fetchError=null;
            state.success=true;
        },
        restoreExpenseSucess:(state) => {
            state.success=false;
        },
        fetchExpenseFailure:(state,action) => {
            state.fetchLoading=false;
            state.fetchError=action.payload;
        },
        expenseFailure:(state,action) => {
            state.loading=false;
            state.error=action.payload;
        },
        fetchExpenseSlice:(state,action) => {
            state.fetchLoading=false;
            expenseAdapter.addMany(state,action.payload);
        },
        addExpenseSlice:(state,action) => {
            expenseAdapter.addOne(state,action.payload);
        },
        deleteExpenseSlice:(state,action) => {
            expenseAdapter.removeOne(state,action.payload);
        }
    }

})

export const {deleteExpenseSlice,fetchExpenseLoading,expenseLoading,fetchExpenseFailure,expenseFailure,restoreExpenseSucess,expenseSuccess,fetchExpenseSlice,addExpenseSlice}=expenseSlice.actions;
export const {selectAll:SelectAllExpenses,selectById:SelectExpenseById}=expenseAdapter.getSelectors((state) => state.expense);
export default expenseSlice.reducer;