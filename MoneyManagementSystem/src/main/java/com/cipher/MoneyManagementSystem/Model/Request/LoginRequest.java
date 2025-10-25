package com.cipher.MoneyManagementSystem.Model.Request;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class LoginRequest {

    @Email
    private String email;

    @Length(min=4,max=20)
    private String password;
}
