package com.cipher.MoneyManagementSystem.Model.Request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class CategoryRequest {

    @NotBlank(message="Enter a valid name")
    private String name;

    private String type;

    @Email
    private String email;
}
