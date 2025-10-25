package com.cipher.MoneyManagementSystem.Controller;

import com.cipher.MoneyManagementSystem.Model.Request.DataRequest;
import com.cipher.MoneyManagementSystem.Model.Request.FilterRequest;
import com.cipher.MoneyManagementSystem.Model.Response.ExpenseResponse;
import com.cipher.MoneyManagementSystem.Model.Response.IncomeResponse;
import com.cipher.MoneyManagementSystem.Service.Interface.EmailService;
import com.cipher.MoneyManagementSystem.Service.Interface.IncomeService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/income")

public class IncomeController {

    @Autowired
    private IncomeService incomeService;
    @Autowired
    private EmailService emailService;

    @PostMapping("/create")
    public ResponseEntity<?> createIncome(@RequestPart("data") DataRequest request, @RequestPart("file") MultipartFile file) throws IOException {
        IncomeResponse income=incomeService.createIncome(request,file);
        if(income!=null) {
            return ResponseEntity.ok(income);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error","Income already exists or invalid data provided"));
    }

    @GetMapping
    public List<IncomeResponse> getAllIncomes(@RequestParam String email) {
        return incomeService.getAllIncomes(email);
    }

    @DeleteMapping("/delete")
    public void deleteIncomes(@RequestParam int id) throws IOException {
        incomeService.deleteIncome(id);
    }

    @GetMapping("/incomeByCategory")
    public List<IncomeResponse> getAllExpensesByCategory(@RequestParam String email , @RequestParam String categoryId) {
        return incomeService.getIncomeByCategory(email, categoryId);
    }

    @GetMapping("/getByMonth")
    public List<IncomeResponse> getIncomeByThisMonth(@RequestParam String email) {
        return incomeService.getIncomeByThisMonth(email);
    }

    @GetMapping("/sendMail")
    public void sendMail(@RequestParam String email) throws IOException, MessagingException {
        ByteArrayInputStream  byteStream=incomeService.getIncomeExcelBytes(email);
        String to=email;
        String subject="Income records summary list";
        String body="Please find attached income records summary list you requested.";
        emailService.sendTransactionExcelDataSets(to,subject,body,byteStream);
    }

    @GetMapping("/sendExcel")
    public ResponseEntity<?> sendIncomeExcelDataSet(@RequestParam String email) throws IOException {
        ByteArrayInputStream excelStreamData=incomeService.getIncomeExcelBytes(email);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=income_records.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(excelStreamData.readAllBytes());
    }

    @GetMapping("/filter")
    public List<IncomeResponse> getFilteredIncomes(@ModelAttribute FilterRequest request) {
        return incomeService.getFilteredIncomes(request);
    }

}
