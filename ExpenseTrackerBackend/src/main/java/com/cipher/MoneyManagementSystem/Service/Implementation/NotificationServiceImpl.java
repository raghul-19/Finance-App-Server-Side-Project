package com.cipher.MoneyManagementSystem.Service.Implementation;

import com.cipher.MoneyManagementSystem.Model.Response.ExpenseResponse;
import com.cipher.MoneyManagementSystem.Model.Response.ProfileResponse;
import com.cipher.MoneyManagementSystem.Service.Interface.EmailService;
import com.cipher.MoneyManagementSystem.Service.Interface.ExpenseService;
import com.cipher.MoneyManagementSystem.Service.Interface.NotificationService;
import com.cipher.MoneyManagementSystem.Service.Interface.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service

public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private EmailService emailService;

    @Autowired
    private ProfileService profileService;

    @Autowired
    private ExpenseService expenseService;

    private static final String frontEndUrl="http://localhost:5173";


    @Override
    @Scheduled(cron = "0 0 22 * * *",zone="IST")
    public void sendNotificationToTheUser() {
        sendEmailRemainderToUser();

    }

    @Override
    @Scheduled(cron = "0 0 23 * * *",zone="IST")
    public void sendExpenseSummaryToUser() {
        generateExpenseSummary();
    }

    private void sendEmailRemainderToUser() {
        List<ProfileResponse> profiles=profileService.getAllUserProfiles();
        for(ProfileResponse profile:profiles) {
            String body = "Hi " + profile.getName() + ",<br><br>"
                    + "This is a friendly reminder to add your income and expenses for today in Money Manager.<br><br>"
                    + "<a href='" + frontEndUrl + "' style='display:inline-block;padding:10px 20px;background-color:green;color:white;text-decoration:none;border-radius:5px;'>Open Money Manager</a>"
                    + "<br><br>Best regards,<br>Money Manager Team";
            String subject="A Remainder to add your income and expenses";
            emailService.sendVerificationEmail(profile.getEmail(),subject,body);
        }
    }

    private void generateExpenseSummary() {
        List<ProfileResponse> profiles=profileService.getAllUserProfiles();
        for(ProfileResponse profile:profiles) {
            StringBuilder table=new StringBuilder();
            List<ExpenseResponse> expenses=expenseService.getTodayExpenses(profile.getEmail(), LocalDate.now());
            table.append("<h3>Daily Expense Summary</h3>");
            table.append("<table border='1' cellpadding='8' cellspacing='0' style='border-collapse:collapse;'>");
            table.append("<tr>")
                    .append("<th>S.No</th>")
                    .append("<th>Expense Name</th>")
                    .append("<th>Amount</th>")
                    .append("<th>Category</th>")
                    .append("</tr>");

            int sno = 1;
            if(expenses!=null) {
                for (ExpenseResponse expense : expenses) {
                    table.append("<tr>")
                            .append("<td>").append(sno++).append("</td>")
                            .append("<td>").append(expense.getName()).append("</td>")
                            .append("<td>").append(expense.getAmount()).append("</td>")
                            .append("<td>").append(expense.getCategoryName()).append("</td>")
                            .append("</tr>");
                }
            } else {
                table.append("<tr>")
                        .append("<td colspan='4'>No expenses recorded for today.</td>")
                        .append("</tr>");
            }
            table.append("</table><br>Best regards,<br>Money Manager Team");
            String body=table.toString();
            String subject="Expense Summary for " + profile.getName();
            emailService.sendVerificationEmail(profile.getEmail(), subject, body);
        }

    }
}
