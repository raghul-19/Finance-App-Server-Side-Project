import {createSlice,createEntityAdapter} from '@reduxjs/toolkit'

const categoryEntityAdapter=createEntityAdapter({
    selectId:(category) => category.categoryId
});

const initialState=categoryEntityAdapter.getInitialState({
    loading:false,
    success:false,
    error:"",
    fetchLoading:false,
    fetchError:false,
});

const categorySlice=createSlice({
    name:"category",
    initialState:initialState,
    reducers:{
        restoreCategorySuccess:(state) => {
            state.success=false;
        },
        fetchCategorySlice:(state,action) => {
            state.fetchLoading=false;
            categoryEntityAdapter.addMany(state,action.payload);
        },
        categoryLoading:(state) => {
            state.loading=true;
        },
        categoryFetchLoading:(state) => {
            state.fetchLoading=true;
        },
        categorySuccess:(state) => {
            state.loading=false;
            state.success=true;
            state.fetchLoading=false;
            state.error=null;
            state.fetchError=null;
        },
        fetchCategoryFailure:(state,action) => {
            state.fetchLoading=false;
            state.fetchError=action.payload;
        },
        categoryFailure:(state,action) => {
            state.loading=false;
            state.error=action.payload;
        },
        addCategorySlice:(state,action) => {
            categoryEntityAdapter.addOne(state, action.payload);
        },
        updateCategorySlice:(state,action) => {
            categoryEntityAdapter.upsertOne(state,action.payload);
        }
    }
});

export const {fetchCategoryFailure,categoryFetchLoading,updateCategorySlice,fetchCategorySlice,restoreCategorySuccess,categoryLoading,categoryFailure,categorySuccess,addCategorySlice}=categorySlice.actions;
export const {selectAll:SelectAllCategories,selectById:selectCategoryIds} =categoryEntityAdapter.getSelectors((state) => state.category);
export default categorySlice.reducer;