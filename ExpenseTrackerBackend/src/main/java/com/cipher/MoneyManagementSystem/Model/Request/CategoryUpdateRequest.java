package com.cipher.MoneyManagementSystem.Model.Request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data

public class CategoryUpdateRequest {

    private String categoryId;
    private String name;
    private String type;
    private String email;
    private String imageUrl;
}
