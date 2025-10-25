package com.cipher.MoneyManagementSystem.Model.Request;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor

public class FilterRequest {

    private String email;
    private String order;
    private String field;
    private LocalDate startDate;
    private LocalDate endDate;
    private String keyword;
}
