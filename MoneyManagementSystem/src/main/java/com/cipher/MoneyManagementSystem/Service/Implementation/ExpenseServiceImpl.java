package com.cipher.MoneyManagementSystem.Service.Implementation;

import com.cipher.MoneyManagementSystem.Entity.CategoryEntity;
import com.cipher.MoneyManagementSystem.Entity.ExpensiveEntity;
import com.cipher.MoneyManagementSystem.Entity.ProfileEntity;
import com.cipher.MoneyManagementSystem.Model.Request.DataRequest;
import com.cipher.MoneyManagementSystem.Model.Request.FilterRequest;
import com.cipher.MoneyManagementSystem.Model.Response.ExpenseResponse;
import com.cipher.MoneyManagementSystem.Repository.ExpenseRepository;
import com.cipher.MoneyManagementSystem.Service.Interface.CategoryService;
import com.cipher.MoneyManagementSystem.Service.Interface.ExpenseService;
import com.cipher.MoneyManagementSystem.Service.Interface.ImageFileService;
import com.cipher.MoneyManagementSystem.Service.Interface.ProfileService;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service

public class ExpenseServiceImpl implements ExpenseService {

    @Autowired
    private ImageFileService fileService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private ProfileService profileService;
    @Autowired
    private ImageFileService imageFileService;


    private ExpensiveEntity generateExpenseEntity(DataRequest request, MultipartFile file) throws IOException {
        String filePath=fileService.createImageUrl("expenses",file);
        ProfileEntity profile=profileService.getUserProfileByEmail(request.getEmail());
        CategoryEntity category=categoryService.getCategoryByCategoryId(request.getEmail(), request.getCategory_id());
        LocalDate date=request.getDate()==null? LocalDate.now():request.getDate();
        return ExpensiveEntity.builder()
                .name(request.getName())
                .expenseId("EXP_"+ UUID.randomUUID().toString())
                .imgUrl(filePath)
                .date(date)
                .profile(profile)
                .category(category)
                .amount(request.getAmount())
                .build();

    }
    private ExpenseResponse generateExpenseResponse(ExpensiveEntity entity) {
        return ExpenseResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .imageUrl(entity.getImgUrl())
                .expenseId(entity.getExpenseId())
                .date(entity.getDate())
                .amount(entity.getAmount())
                .categoryId(entity.getCategory().getCategoryId())
                .categoryName(entity.getCategory().getName())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
    @Override
    public List<ExpenseResponse> getAllExpenses(String email) {
        ProfileEntity profile=profileService.getUserProfileByEmail(email);
        return expenseRepository.getAllExpenses(profile.getProfileId()).stream().map(expense -> generateExpenseResponse(expense)).toList();
    }

    @Override
    public List<ExpenseResponse> getExpenseByCategory(String email, String category_id) {
        ProfileEntity profile=profileService.getUserProfileByEmail(email);
        return expenseRepository.getExpensesByCategory(profile.getProfileId(),category_id).stream().map(income -> generateExpenseResponse(income)).toList();
    }

    @Override
    public BigDecimal getTotalExpense(String email) {
        ProfileEntity profile=profileService.getUserProfileByEmail(email);
        return expenseRepository.getTotalExpense(profile.getProfileId());
    }

    @Override
    public ExpenseResponse createExpense(DataRequest request, MultipartFile file) throws IOException {
        ProfileEntity profile=profileService.getUserProfileByEmail(request.getEmail());
        ExpensiveEntity expense=expenseRepository.getExpenseByExpenseNameAndProfileId(profile.getProfileId(),request.getName());
        if(expense==null) {
            return generateExpenseResponse(expenseRepository.save(generateExpenseEntity(request,file)));
        }
        return null;
    }

    @Override
    public void deleteExpense(int id) throws IOException {
        ExpensiveEntity expense=expenseRepository.getById(id);
        if(expense!=null) {
            imageFileService.deleteImageUrl("expenses", expense.getImgUrl());
            expenseRepository.deleteById(id);
            return;
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Data invalid or not exist");
    }

    @Override
    public List<ExpenseResponse> getExpensesByTHisMonth(String email) {
        ProfileEntity profile=profileService.getUserProfileByEmail(email);
        LocalDate now= LocalDate.now();
        LocalDate startDate=now.withDayOfMonth(1);
        LocalDate endDate=now.withDayOfMonth(now.lengthOfMonth());
        return expenseRepository.getExpenseByThisMonth(profile.getProfileId(),startDate,endDate)
                .stream()
                .map(expense -> generateExpenseResponse(expense))
                .toList();
    }

    @Override
    public List<ExpenseResponse> getLatest5Expenses(String email) {
        ProfileEntity profile=profileService.getUserProfileByEmail(email);
        Pageable page= PageRequest.of(0,5);
        return expenseRepository.getLatest5Expenses(profile.getProfileId(),page).getContent()
                .stream()
                .map(expense -> generateExpenseResponse(expense))
                .toList();
    }

    @Override
    public List<ExpenseResponse> getExpenseByNameStartAndEndDateAndProfileId(String email, LocalDate startDate, LocalDate endDate, String keyword, Sort sort) {
        ProfileEntity profile=profileService.getUserProfileByEmail(email);
        return expenseRepository.getExpenseByNameStartAndEndDateAndProfileId(profile.getProfileId(),startDate,endDate,keyword,sort)
                .stream()
                .map(expense -> generateExpenseResponse(expense))
                .toList();
    }

    @Override
    public List<ExpenseResponse> getTodayExpenses(String email, LocalDate date) {
        ProfileEntity profile=profileService.getUserProfileByEmail(email);
        return expenseRepository.getTodayExpenses(profile.getProfileId(),date).stream()
                .map(expense -> generateExpenseResponse(expense))
                .toList();
    }

    private String getFormattedDate(LocalDate date) {
        int day=date.getDayOfMonth();
        String suffix="";
        if(day>=11 && day<=13) {
            suffix="th";
        } else {
            switch(day%10) {
                case 1 -> suffix="st";
                case 2 -> suffix="nd";
                case 3 -> suffix="rd";
                default -> suffix="th";
            }
        }

        DateTimeFormatter formatter=DateTimeFormatter.ofPattern("MMMM, yyyy");
        return day+suffix+" "+date.format(formatter);
    }

    @Override
    public ByteArrayInputStream getExpenseExcelData(String email) throws IOException {
        ProfileEntity profile=profileService.getUserProfileByEmail(email);
        List<ExpensiveEntity> expenses=expenseRepository.getAllExpenses(profile.getProfileId());

        XSSFWorkbook workbook=new XSSFWorkbook();
        XSSFSheet sheet=workbook.createSheet("Expenses Records");
        Row header=sheet.createRow(0);

        if(expenses.isEmpty()) {
            header.createCell(0).setCellValue("No expense records added yet!");
        } else {
            header.createCell(0).setCellValue("S.no");
            header.createCell(1).setCellValue("Name");
            header.createCell(2).setCellValue("Amount");
            header.createCell(3).setCellValue("Category");
            header.createCell(4).setCellValue("Date");

            int rowNum = 1;
            for(ExpensiveEntity expense:expenses) {
                Row row=sheet.createRow(rowNum);
                row.createCell(0).setCellValue(rowNum);
                row.createCell(1).setCellValue(expense.getName());
                row.createCell(2).setCellValue(expense.getAmount().toString());
                row.createCell(3).setCellValue(expense.getCategory().getName());
                row.createCell(4).setCellValue(getFormattedDate(expense.getDate()));
                rowNum++;
            }
        }
        ByteArrayOutputStream outputStream=new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        return new ByteArrayInputStream(outputStream.toByteArray());
    }

    @Override
    public List<ExpenseResponse> getFilteredExpenses(FilterRequest request) {

        ProfileEntity profile = profileService.getUserProfileByEmail(request.getEmail());
        Sort sort = (request.getOrder().toLowerCase().equals("ascending")) ? Sort.by(request.getField().toLowerCase()).ascending() : Sort.by(request.getField().toLowerCase()).descending();
        return expenseRepository.getFilteredExpenses(profile.getProfileId(), request.getKeyword(), request.getStartDate(), request.getEndDate(), sort)
                .stream()
                .map((expense) -> generateExpenseResponse(expense))
                .toList();
    }
}
