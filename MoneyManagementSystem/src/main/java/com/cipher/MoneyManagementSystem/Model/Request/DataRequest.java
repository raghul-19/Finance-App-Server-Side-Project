package com.cipher.MoneyManagementSystem.Model.Request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class DataRequest {

    private String name;
    private BigDecimal amount;
    private String category_id;
    private LocalDate date;
    private String email;
}
