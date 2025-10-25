package com.cipher.MoneyManagementSystem.Model.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data

public class ExpenseResponse {

    private int id;
    private String expenseId;
    private String imageUrl;
    private String name;
    private BigDecimal amount;
    private LocalDate date;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String categoryName;
    private String categoryId;
}
