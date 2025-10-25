import { createSlice,createEntityAdapter } from "@reduxjs/toolkit";


const incomeAdapter=createEntityAdapter({
    selectId:(income) => income.incomeId,
    sortComparer:(a,b) => new Date(b.date)-new Date(a.date),
})

const initialState=incomeAdapter.getInitialState({
    fetchLoading:false,
    loading:false,
    error:null,
    success:false,
    fetchError:null,
})

const incomeSlice=createSlice({
    name:"income",
    initialState,
    reducers:{

        incomeLoading:(state) => {
            state.loading=true;
        },
        fetchIncomeSlice:(state,action) => {
            state.fetchLoading=false;
            incomeAdapter.addMany(state,action.payload);
        },
        fetchIncomeLoading:(state) => {
            state.fetchLoading=true;
        },
        restoreIncomeSuccess:(state) => {
            state.success=false;
        },
        addIncomeSlice:(state,action) => {
            incomeAdapter.upsertOne(state,action.payload);
        },
        
        incomeSuccess:(state) => {
            state.fetchLoading=false;
            state.loading=false;
            state.success=true;
            state.error=null;
            state.fetchError=null;
        },
        fetchIncomeFailure:(state,action) => {
            state.fetchLoading=false;
            state.fetchError=action.payload;
        },
        incomeFailure:(state,action) => {
           state.loading=false;
           state.error=action.payload;
        },
        deleteIncomeSlice:(state,action) => {
            incomeAdapter.removeOne(state,action.payload);
        },
    }
});

export const {deleteIncomeSlice,restoreIncomeSuccess,addIncomeSlice,fetchIncomeFailure,incomeLoading,fetchIncomeLoading,fetchIncomeSlice,incomeSuccess,incomeFailure}=incomeSlice.actions;
export const {selectAll:SelectAllIncomes, selectById:SelectIncomeByIds}=incomeAdapter.getSelectors((state) => state.income);
export default incomeSlice.reducer;