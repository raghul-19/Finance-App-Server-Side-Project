package com.cipher.MoneyManagementSystem.Controller;

import com.cipher.MoneyManagementSystem.Model.Request.DataRequest;
import com.cipher.MoneyManagementSystem.Model.Request.FilterRequest;
import com.cipher.MoneyManagementSystem.Model.Response.ExpenseResponse;
import com.cipher.MoneyManagementSystem.Service.Interface.EmailService;
import com.cipher.MoneyManagementSystem.Service.Interface.ExpenseService;
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
@RequestMapping("/expense")

public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;
    @Autowired
    private EmailService emailService;

    @PostMapping("/create")
    public ResponseEntity<?> createExpense(@RequestPart("data") DataRequest request, @RequestPart("file")MultipartFile file) throws IOException {
        ExpenseResponse expenseResponse=expenseService.createExpense(request,file);
        if(expenseResponse!=null) {
            return ResponseEntity.ok(expenseResponse);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error","Data already exists or invalid data provided"));
    }

    @GetMapping
    public List<ExpenseResponse> getAllExpenses(@RequestParam String email) {
        System.out.println("Testing: "+expenseService.getAllExpenses(email).toString());
        return expenseService.getAllExpenses(email);
    }

    @DeleteMapping("/delete")
    public void deleteExpense(@RequestParam int id) throws IOException {
        expenseService.deleteExpense(id);
    }

    @GetMapping("/expenseByCategory")
    public List<ExpenseResponse> getByCategory(@RequestParam String email, @RequestParam String categoryId) {
        return expenseService.getExpenseByCategory(email,categoryId);
    }

    @GetMapping("/getByMonth")
    public List<ExpenseResponse> getIncomeByThisMonth(@RequestParam String email) {
        return expenseService.getExpensesByTHisMonth(email);
    }

    @GetMapping("/sendMail")
    public void sendMail(@RequestParam String email) throws IOException, MessagingException {
        ByteArrayInputStream excelDataStream=expenseService.getExpenseExcelData(email);
        String to=email;
        String subject="Expense records summary list";
        String body="Please find attached expense records summary list you requested.";
        emailService.sendTransactionExcelDataSets(to,subject,body,excelDataStream);
    }

    @GetMapping("/sendExcel")
    public ResponseEntity<?> getExpenseExcelDataSets(@RequestParam String email) throws IOException {
        ByteArrayInputStream excelDataStream=expenseService.getExpenseExcelData(email);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=expense_records.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(excelDataStream.readAllBytes());
    }

    @GetMapping("/filter")
    public List<ExpenseResponse> getFilteredExpenses(@ModelAttribute FilterRequest request) {
        return expenseService.getFilteredExpenses(request);
    }


}
    