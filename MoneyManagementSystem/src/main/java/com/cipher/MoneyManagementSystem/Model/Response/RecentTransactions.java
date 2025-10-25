package com.cipher.MoneyManagementSystem.Model.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor

public class RecentTransactions {

    private String id;
    private String name;
    private BigDecimal amount;
    private String imageUrl;
    private String type;
    private LocalDate date;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String profileId;
}
