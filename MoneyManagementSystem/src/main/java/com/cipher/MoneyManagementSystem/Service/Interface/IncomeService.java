package com.cipher.MoneyManagementSystem.Service.Interface;

import com.cipher.MoneyManagementSystem.Model.Request.DataRequest;
import com.cipher.MoneyManagementSystem.Model.Request.FilterRequest;
import com.cipher.MoneyManagementSystem.Model.Response.IncomeResponse;
import org.springframework.data.domain.Sort;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface IncomeService {

    List<IncomeResponse> getAllIncomes(String email);
    List<IncomeResponse> getIncomeByCategory(String email,String category_id);
    BigDecimal getTotalIncome(String email);
    IncomeResponse createIncome(DataRequest request, MultipartFile file) throws IOException;
    void deleteIncome(int id) throws IOException;
    List<IncomeResponse> getIncomeByThisMonth(String email);
    List<IncomeResponse> getLatest5Incomes(String email);
    List<IncomeResponse> getIncomeByNameStartAndEndDateAndProfileId(String email, LocalDate startDate, LocalDate endDate, String keyword, Sort sort);
    ByteArrayInputStream getIncomeExcelBytes(String email) throws IOException;
    List<IncomeResponse> getFilteredIncomes(FilterRequest request);
}
