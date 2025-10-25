import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from '../Slice/categorySlice';
import createSagaMiddleware from 'redux-saga';
import incomeReducer from '../Slice/incomeSlice'
import rootSaga from '../Saga/rootSaga';
import expenseReducer from '../Slice/expenseSlice'

const sagaMiddleware=createSagaMiddleware();

const store=configureStore({
    reducer:{
        category:categoryReducer,
        income:incomeReducer,
        expense:expenseReducer,
    },
    middleware:(getDefaultMiddleware) => getDefaultMiddleware({thunk:false,serializableCheck:false}).concat(sagaMiddleware)
    
})

sagaMiddleware.run(rootSaga)
export default store;
