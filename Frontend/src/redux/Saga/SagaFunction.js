import {put, takeEvery} from 'redux-saga/effects';
import {actiontypes} from '../utils/actionTypes';
import { addCategorySlice, categoryFailure, categoryFetchLoading, categoryLoading, categorySuccess, fetchCategoryFailure, fetchCategorySlice, updateCategorySlice } from '../Slice/categorySlice';
import apiCalls from '../utils/apiCalls';
import { addIncomeSlice, deleteIncomeSlice, fetchIncomeFailure, fetchIncomeLoading, fetchIncomeSlice, incomeFailure, incomeLoading, incomeSuccess } from '../Slice/incomeSlice';
import { addExpenseSlice, deleteExpenseSlice, expenseFailure, expenseLoading, expenseSuccess, fetchExpenseFailure, fetchExpenseLoading, fetchExpenseSlice } from '../Slice/expenseSlice';


function * addCategory(action) {

    yield put(categoryLoading());
    try {
        const response=yield apiCalls.addCategory(action.payload);
        yield new Promise(resolve => setTimeout(resolve,2000));
        yield put(addCategorySlice(response.data));
        yield put(categorySuccess());

    } catch(e) {
        yield new Promise(resolve => setTimeout(resolve,2000));
        console.log(e.message);
        yield put(categoryFailure("Category already exist or Internal server error"));
    }

}

function * fetchCategory() {
    yield put(categoryFetchLoading());
    try {
        const response=yield apiCalls.fetchCategory();
        yield new Promise(resolve => setTimeout(resolve,1000));
        yield put(fetchCategorySlice(response.data));

    } catch(e) {
        yield new Promise(resolve => setTimeout(resolve,2000));
        console.log(e.message);
        yield put(fetchCategoryFailure("Oops! It's not you, it's us. We'll fix this soon."));
    }
}

function * updateCategory(action) {
    yield put(categoryLoading());
    try {
        const response=yield apiCalls.updateCategory(action.payload);
        yield new Promise(resolve => setTimeout(resolve,2000));
        yield put(updateCategorySlice(response.data));
        yield put(categorySuccess());
    } catch(e) {
        yield new Promise(resolve => setTimeout(resolve,2000));
        console.log(e.message);
        yield put(categoryFailure("Category not exist or Internal server error!"));
    }
}

function * fetchIncome() {
    yield put(fetchIncomeLoading());
    try {
        const response=yield apiCalls.fetchIncome();
        yield new Promise(resolve => setTimeout(resolve,2000));
        yield put(fetchIncomeSlice(response.data));
        
    } catch(e) {
        yield new Promise(resolve => setTimeout(resolve,2000));
        yield put(fetchIncomeFailure("Interval Server error"));
        console.log(e.message);
    }
}

function * addIncome(action) {
    yield put(incomeLoading());
    try {
        const response=yield apiCalls.addIncome(action.payload);
        yield new Promise(resolve => setTimeout(resolve,2000));
        yield put(addIncomeSlice(response.data));
        yield put(incomeSuccess());
    } catch(e) {
        yield new Promise(resolve => setTimeout(resolve,2000));
        yield put(incomeFailure("Income already exist or internal server error"));
        console.log(e.message);
    }
}

function * addExpense(action) {
    yield put(expenseLoading());
    try {
        const response=yield apiCalls.addExpense(action.payload);
        yield new Promise(resolve => setTimeout(resolve,2000));
        yield put(addExpenseSlice(response.data));
        yield put(expenseSuccess());
    } catch(e) {
        yield new Promise(resolve => setTimeout(resolve,2000));
        yield put(expenseFailure("Expense already exist or internal server error"));
        console.log(e.message);
    }
}

function * deleteIncome(action)  {
    yield put(incomeLoading());
    try {
        yield apiCalls.deleteIncome(action.payload.id);
        yield new Promise(resolve => setTimeout(resolve,2000));
        yield put(deleteIncomeSlice(action.payload.incomeId));
        yield put(incomeSuccess());
    } catch(e) {
        yield new Promise(resolve => setTimeout(resolve,2000));
        console.log(e.message);
        yield put(incomeFailure("Data not found or internal server error"));
    }
}

function * deleteExpense(action) {
    yield put(expenseLoading());
    try {
        yield apiCalls.deleteExpense(action.payload.id);
        yield new Promise(resolve => setTimeout(resolve,2000));
        yield put(deleteExpenseSlice(action.payload.expenseId));
        yield put(expenseSuccess());
    } catch(e) {
        yield new Promise(resolve => setTimeout(resolve,2000));
        console.log(e.message);
        yield put(expenseFailure("Data not found or internal server error"));
    }
}

function * fetchExpense() {
    yield put(fetchExpenseLoading());
    try {
        const response=yield apiCalls.fetchExpense();
        yield new Promise(resolve => setTimeout(resolve,2000));
        yield put(fetchExpenseSlice(response.data));
    } catch(e) {
        yield new Promise(resolve=> setTimeout(resolve,2000));
        console.log(e.message);
        yield put(fetchExpenseFailure("Internal server error"));
    }
}



export function * watchAsyncFunctions() {
    yield takeEvery(actiontypes.ADD_CATEGORY,addCategory);
    yield takeEvery(actiontypes.FETCH_CATEGORY,fetchCategory);
    yield takeEvery(actiontypes.UPDATE_CATEGORY,updateCategory);
    yield takeEvery(actiontypes.FETCH_INCOME,fetchIncome);
    yield takeEvery(actiontypes.ADD_INCOME,addIncome);
    yield takeEvery(actiontypes.ADD_EXPENSE,addExpense);
    yield takeEvery(actiontypes.DELETE_INCOME,deleteIncome);
    yield takeEvery(actiontypes.DELETE_EXPENSE,deleteExpense);
    yield takeEvery(actiontypes.FETCH_EXPENSE,fetchExpense);
}