package com.cipher.MoneyManagementSystem.Model.Request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class CategoryGetRequest {

    private String name;
    private int id;
    private String email;
    private String type;
}
