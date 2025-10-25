package com.cipher.MoneyManagementSystem.Service.Implementation;

import com.cipher.MoneyManagementSystem.Entity.CategoryEntity;
import com.cipher.MoneyManagementSystem.Entity.IncomeEntity;
import com.cipher.MoneyManagementSystem.Entity.ProfileEntity;
import com.cipher.MoneyManagementSystem.Model.Request.DataRequest;
import com.cipher.MoneyManagementSystem.Model.Request.FilterRequest;
import com.cipher.MoneyManagementSystem.Model.Response.ExpenseResponse;
import com.cipher.MoneyManagementSystem.Model.Response.IncomeResponse;
import com.cipher.MoneyManagementSystem.Repository.IncomeRepository;
import com.cipher.MoneyManagementSystem.Service.Interface.CategoryService;
import com.cipher.MoneyManagementSystem.Service.Interface.ImageFileService;
import com.cipher.MoneyManagementSystem.Service.Interface.IncomeService;
import com.cipher.MoneyManagementSystem.Service.Interface.ProfileService;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
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

import static java.lang.System.out;

@Service

public class IncomeServiceImpl implements IncomeService {
    @Autowired
    private ProfileService profileService;

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private ImageFileService fileService;

    @Autowired
    private CategoryService categoryService;
    @Autowired
    private ImageFileService imageFileService;

    private IncomeEntity generateIncomeEntity(DataRequest request, MultipartFile file) throws IOException {
        String filePath=fileService.createImageUrl("incomes",file);
        ProfileEntity profile=profileService.getUserProfileByEmail(request.getEmail());
        CategoryEntity category=categoryService.getCategoryByCategoryId(request.getEmail(), request.getCategory_id());
        LocalDate date=request.getDate()==null?LocalDate.now():request.getDate();
        return IncomeEntity.builder()
                .name(request.getName())
                .incomeId("INC_"+ UUID.randomUUID().toString())
                .imgUrl(filePath)
                .date(date)
                .profile(profile)
                .category(category)
                .amount(request.getAmount())
                .build();

    }

    private IncomeResponse generateIncomeResponse(IncomeEntity entity) {
        return IncomeResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .imageUrl(entity.getImgUrl())
                .incomeId(entity.getIncomeId())
                .date(entity.getDate())
                .amount(entity.getAmount())
                .categoryId(entity.getCategory().getCategoryId())
                .categoryName(entity.getCategory().getName())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    @Override
    public List<IncomeResponse> getAllIncomes(String email) {
       ProfileEntity profile=profileService.getUserProfileByEmail(email);
       return incomeRepository.getAllTheIncomes(profile.getProfileId()).stream().map(income -> generateIncomeResponse(income)).toList();
    }

    @Override
    public List<IncomeResponse> getIncomeByCategory(String email, String category_id) {

        ProfileEntity profile=profileService.getUserProfileByEmail(email);
        return incomeRepository.getIncomeByCategory(profile.getProfileId(),category_id).stream().map(income -> generateIncomeResponse(income)).toList();
    }

    @Override
    public BigDecimal getTotalIncome(String email) {
        ProfileEntity profile=profileService.getUserProfileByEmail(email);
        return  incomeRepository.getTotalIncome(profile.getProfileId());
    }

    @Override
    public IncomeResponse createIncome(DataRequest request, MultipartFile file) throws IOException {
        ProfileEntity profile=profileService.getUserProfileByEmail(request.getEmail());
        IncomeEntity income=incomeRepository.getIncomeByNameAndProfileId(profile.getProfileId(),request.getName());
        if(income==null) {
            return generateIncomeResponse(incomeRepository.save(generateIncomeEntity(request,file)));
        }
        return null;
    }

    @Override
    public void deleteIncome(int id) throws IOException {
        IncomeEntity income = incomeRepository.getById(id);
        if (income != null) {
            imageFileService.deleteImageUrl("incomes", income.getImgUrl());
            incomeRepository.deleteById(id);
            return;
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Data invalid/ not exist");
    }

    @Override
    public List<IncomeResponse> getIncomeByThisMonth(String email) {
        ProfileEntity profile=profileService.getUserProfileByEmail(email);
        LocalDate now= LocalDate.now();
        LocalDate startDate=now.withDayOfMonth(1);
        LocalDate endDate=now.withDayOfMonth(now.lengthOfMonth());
        return incomeRepository.getIncomeResponseByThisMonth(profile.getProfileId(),startDate,endDate)
                .stream()
                .map(income -> generateIncomeResponse(income))
                .toList();
    }

    @Override
    public List<IncomeResponse> getLatest5Incomes(String email) {
        ProfileEntity profile=profileService.getUserProfileByEmail(email);
        Pageable page= PageRequest.of(0,5);
        return incomeRepository.getLatest5Incomes(profile.getProfileId(),page).getContent()
                .stream()
                .map(income -> generateIncomeResponse(income))
                .toList();
    }

    @Override
    public List<IncomeResponse> getIncomeByNameStartAndEndDateAndProfileId(String email, LocalDate startDate, LocalDate endDate, String keyword, Sort sort) {
        ProfileEntity profile=profileService.getUserProfileByEmail(email);
        return incomeRepository.getIncomeByNameStartAndEndDateAndProfileId(profile.getProfileId(),startDate,endDate,keyword,sort)
                .stream()
                .map(income->generateIncomeResponse(income))
                .toList();
    }

    private String getFormattedDate(LocalDate date) {
        int day=date.getDayOfMonth();
        String suffix="";
        if(day>=11 && day<=13) {
            suffix="th";
        } else {
            switch(day%10) {
                case 01 -> suffix="st";
                case 2 -> suffix="nd";
                case 3 -> suffix="rd";
                default -> suffix="th";
            }
        }
        DateTimeFormatter formatter= DateTimeFormatter.ofPattern("MMMM, yyyy");
        return day+suffix+" "+date.format(formatter);

    }

    @Override
    public ByteArrayInputStream getIncomeExcelBytes(String email) throws IOException {
        ProfileEntity profile=profileService.getUserProfileByEmail(email);
        List<IncomeEntity>incomes=incomeRepository.getAllTheIncomes(profile.getProfileId());
        XSSFWorkbook workbook=new XSSFWorkbook();
        XSSFSheet sheet=workbook.createSheet("income records");
        Row header=sheet.createRow(0);
        if(incomes.isEmpty()) {
            header.createCell(0).setCellValue("No income records added yet!");
        } else {
            header.createCell(0).setCellValue("S.no");
            header.createCell(1).setCellValue("Name");
            header.createCell(2).setCellValue("Amount");
            header.createCell(3).setCellValue("Category");
            header.createCell(4).setCellValue("Date");

            int rowNum = 1;

            for(IncomeEntity income:incomes) {
                Row row=sheet.createRow(rowNum);
                row.createCell(0).setCellValue(rowNum);
                row.createCell(1).setCellValue(income.getName());
                row.createCell(2).setCellValue(income.getAmount().toString());
                row.createCell(3).setCellValue(income.getCategory().getName());
                row.createCell(4).setCellValue(getFormattedDate(income.getDate()));
                rowNum++;
            }

        }
        ByteArrayOutputStream outputStream=new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();

        return new ByteArrayInputStream(outputStream.toByteArray());
    }

    @Override
    public List<IncomeResponse> getFilteredIncomes(FilterRequest request) {
        ProfileEntity profile=profileService.getUserProfileByEmail(request.getEmail());
        Sort sort=(request.getOrder().toLowerCase().equals("ascending"))?Sort.by(request.getField().toLowerCase()).ascending():Sort.by(request.getField().toLowerCase()).descending();

        return incomeRepository.getFilteredIncome(profile.getProfileId(),request.getKeyword(),request.getStartDate(),request.getEndDate(),sort)
                .stream()
                .map((income) -> generateIncomeResponse(income))
                .toList();

    }


}
