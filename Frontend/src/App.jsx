import React from 'react'

import {Provider}  from 'react-redux'
import store from './redux/utils/Store'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {LoginPage,OauthSuccess,DashBoard,AccountActivation,PasswordResetVerification,PasswordReset,Category,Income,Expense,Filter, AppContextProvider} from './components/Pages/util/index'

import {ToastContainer} from 'react-toastify'
const App = () => {
  return (
    <div>
      <Provider store={store}>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />}/>
              <Route path="/oauth-success" element={<OauthSuccess/>}/>
              <Route path="/activate" element={<AccountActivation/>}/>
              <Route path="/password_reset_verification" element={<PasswordResetVerification/>}/>
              <Route path="/password_reset" element={<PasswordReset/>}/>
              <Route path="/" element={<AppContextProvider><DashBoard/></AppContextProvider>}/>
              <Route path="/category" element={<AppContextProvider><Category/></AppContextProvider>}/>
              <Route path="/income" element={<AppContextProvider><Income/></AppContextProvider>}/>
              <Route path="/expense" element={<AppContextProvider><Expense/></AppContextProvider>}/>
              <Route path="/filter" element={<AppContextProvider><Filter/></AppContextProvider>}/>
            </Routes>
          </BrowserRouter>
        </Provider>
        <ToastContainer 
  className="fixed top-16 text-black font-medium text-md left-1/2 transform -translate-x-1/2 z-50 [&_.Toastify__toast]:!min-h-0 [&_.Toastify__toast]:!h-auto [&_.Toastify__close-button]:hidden [&_.Toastify__toast-body]:!py-0.5 [&_.Toastify__toast-body]:!px-2 [&_.Toastify__toast-body]:!m-0"
  hideProgressBar={true}
  closeButton={false}
/>
    </div>
  )
}

export default App;
