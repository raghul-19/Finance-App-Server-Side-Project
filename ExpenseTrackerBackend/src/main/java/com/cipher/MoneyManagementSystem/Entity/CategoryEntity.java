package com.cipher.MoneyManagementSystem.Entity;

import com.cipher.MoneyManagementSystem.Constants.CategoryType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name="category_data")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder

public class CategoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String categoryId;

    @NotBlank(message = "Enter valid name")
    private String name;

    private String imgUrl;


    @Enumerated(EnumType.STRING)
    private CategoryType categoryType;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name="profile_id",nullable = false)
    private ProfileEntity profile;

}
