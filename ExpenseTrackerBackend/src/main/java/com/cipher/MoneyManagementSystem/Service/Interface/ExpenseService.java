package com.cipher.MoneyManagementSystem.Service.Interface;

import com.cipher.MoneyManagementSystem.Model.Request.DataRequest;
import com.cipher.MoneyManagementSystem.Model.Request.FilterRequest;
import com.cipher.MoneyManagementSystem.Model.Response.ExpenseResponse;
import org.springframework.data.domain.Sort;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface ExpenseService {

    List<ExpenseResponse> getAllExpenses(String email);
    List<ExpenseResponse> getExpenseByCategory(String email,String category_id);
    BigDecimal getTotalExpense(String email);
    ExpenseResponse createExpense(DataRequest request, MultipartFile file) throws IOException;
    void deleteExpense(int id) throws IOException;
    List<ExpenseResponse> getExpensesByTHisMonth(String email);
    List<ExpenseResponse> getLatest5Expenses(String email);
    List<ExpenseResponse> getExpenseByNameStartAndEndDateAndProfileId(String email, LocalDate startDate, LocalDate endDate, String keyword, Sort sort);
    List<ExpenseResponse> getTodayExpenses(String email, LocalDate date);
    ByteArrayInputStream getExpenseExcelData(String email) throws IOException;
    List<ExpenseResponse> getFilteredExpenses(FilterRequest request);
}
