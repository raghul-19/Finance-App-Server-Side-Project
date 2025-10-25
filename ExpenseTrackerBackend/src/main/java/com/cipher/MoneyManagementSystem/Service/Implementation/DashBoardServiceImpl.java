package com.cipher.MoneyManagementSystem.Service.Implementation;

import com.cipher.MoneyManagementSystem.Entity.ProfileEntity;
import com.cipher.MoneyManagementSystem.Model.Response.ExpenseResponse;
import com.cipher.MoneyManagementSystem.Model.Response.IncomeResponse;
import com.cipher.MoneyManagementSystem.Model.Response.RecentTransactions;
import com.cipher.MoneyManagementSystem.Service.Interface.DashBoardService;
import com.cipher.MoneyManagementSystem.Service.Interface.ExpenseService;
import com.cipher.MoneyManagementSystem.Service.Interface.IncomeService;
import com.cipher.MoneyManagementSystem.Service.Interface.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

@Service

public class DashBoardServiceImpl implements DashBoardService {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private IncomeService incomeService;

    @Autowired
    private ExpenseService expenseService;


    @Override
    public Map<String, Object> getDashBoardData(String email) {
        ProfileEntity profile=profileService.getUserProfileByEmail(email);
        List<IncomeResponse> latestIncome=incomeService.getLatest5Incomes(email);
        List<ExpenseResponse> latestExpense=expenseService.getLatest5Expenses(email);
        List<RecentTransactions> transactions= Stream.concat(
                latestIncome.stream().map(income -> RecentTransactions.builder()
                        .id(income.getIncomeId())
                        .name(income.getName())
                        .amount(income.getAmount())
                        .imageUrl(income.getImageUrl())
                        .type("Income")
                        .date(income.getDate())
                        .createdAt(income.getCreatedAt())
                        .updatedAt(income.getUpdatedAt())
                        .profileId(profile.getProfileId())
                        .build()
                ),
                latestExpense.stream().map(expense -> RecentTransactions.builder()
                        .id(expense.getExpenseId())
                        .name(expense.getName())
                        .amount(expense.getAmount())
                        .imageUrl(expense.getImageUrl())
                        .type("Expense")
                        .date(expense.getDate())
                        .createdAt(expense.getCreatedAt())
                        .updatedAt(expense.getUpdatedAt())
                        .profileId(profile.getProfileId())
                        .build()
                )
        ).sorted((t1,t2)  -> {
            int cmpResult=t2.getDate().compareTo(t1.getDate());
            if(cmpResult==0) {
                return t2.getCreatedAt().compareTo(t1.getCreatedAt());
            }
            return cmpResult;
        }).toList();
        BigDecimal balance=incomeService.getTotalIncome(email).subtract(expenseService.getTotalExpense(email));
        Map<String,Object> dashBoardResult=new LinkedHashMap<>();
        List<RecentTransactions> recentTransactions=new ArrayList<>();
        for(int i=0; i<transactions.size() && i<5; i++) {
            recentTransactions.add(transactions.get(i));
        }

        dashBoardResult.put("Income",incomeService.getTotalIncome(email));
        dashBoardResult.put("Expense",expenseService.getTotalExpense(email));
        dashBoardResult.put("Balance",balance);
        dashBoardResult.put("TotalIncome",incomeService.getAllIncomes(email));
        dashBoardResult.put("TotalExpense",expenseService.getAllExpenses(email));
        dashBoardResult.put("Latest5Incomes",latestIncome);
        dashBoardResult.put("Latest5Expenses",latestExpense);
        dashBoardResult.put("RecentTransactions",recentTransactions);

        return dashBoardResult;
    }
}
