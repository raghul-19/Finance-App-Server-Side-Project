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

public class ProfileResponse {

    private int id;
    private String profileId;
    private String imgUrl;
    private String name;
    private String email;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
