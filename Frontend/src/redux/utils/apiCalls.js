import axios from "axios";

const apiCalls={

    addCategory: async (formData) => await axios.post("http://localhost:8080/category/create",formData,{
        headers:{
            "Authorization":`Bearer ${localStorage.getItem("token")}`,
        }
    }),
    fetchCategory:async () => await axios.get(`http://localhost:8080/category?email=${localStorage.getItem("email")}`,{
        headers:{
            "Authorization":`Bearer ${localStorage.getItem("token")}`
        }
    }),
    updateCategory:async (formData) => await axios.put(`http://localhost:8080/category/update?email=${localStorage.getItem("email")}`,formData,{
        headers:{
            "Authorization":`Bearer ${localStorage.getItem("token")}`
        }
    }),
    fetchIncome:async () => await axios.get(`http://localhost:8080/income?email=${localStorage.getItem("email")}`,{
        headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
        }
    }),
    addIncome:async (formData) => await  axios.post(`http://localhost:8080/income/create`,formData,{
        headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
        }
    }),
    addExpense:async (formData) => await axios.post(`http://localhost:8080/expense/create`,formData,{
        headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
        }
    }),
    deleteIncome:async (id) => await axios.delete(`http://localhost:8080/income/delete?id=${id}`,{
        headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
        }
    }),
    deleteExpense: async (id) => await axios.delete(`http://localhost:8080/expense/delete?id=${id}`,{
        headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
        }
    }),
    fetchExpense:async () => await axios.get(`http://localhost:8080/expense?email=${localStorage.getItem("email")}`,{
        headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
        }
    }),

    fetchTransactionExcelDataSet: async (income) => await axios.get(`http://localhost:8080/${income?"income":"expense"}/sendExcel?email=${localStorage.getItem("email")}`,{
        headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`

        },
        responseType:'blob',
    }),
    sendMailTransactionExcelDataSet: async (income) => await axios.get(`http://localhost:8080/${income?"income":"expense"}/sendMail?email=${localStorage.getItem("email")}`,{
        headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
        },
        
    }),
    fetchFilteredData: async (transactionId,request) => await axios.get(`http://localhost:8080/${transactionId}/filter`,{
        params:{
            email:localStorage.getItem("email"),
            order:request.order,
            field:request.field,
            startDate:request.startDate,
            endDate:request.endDate,
            keyword:request.keyword,

        },
        headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
        }
    }),
    fetchDashboardDataSet:async () => await axios.get(`http://localhost:8080/dashboard?email=${localStorage.getItem("email")}`,{
        headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
        }
    })
}

export default apiCalls;