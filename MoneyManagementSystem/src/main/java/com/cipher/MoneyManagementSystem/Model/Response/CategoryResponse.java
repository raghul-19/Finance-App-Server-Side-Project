package com.cipher.MoneyManagementSystem.Model.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data

public class CategoryResponse {

    private int id;
    private String name;
    private String categoryId;
    private String imageUrl;
    private String type;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
