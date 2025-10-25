package com.cipher.MoneyManagementSystem.Model.Response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor

public class LoginResponse {

    private String email;
    private String token;
    private String name;
}
