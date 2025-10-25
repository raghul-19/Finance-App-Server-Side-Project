package com.cipher.MoneyManagementSystem.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name="expense_data")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder


public class ExpensiveEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String expenseId;

    private String imgUrl;

    @NotBlank(message = "Enter valid name")
    private String name;

    private BigDecimal amount;

    private LocalDate date;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="category_id",nullable = false)
    private CategoryEntity category;

    @ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(name="profile_id",nullable = false)
    private ProfileEntity profile;

    @PrePersist
    public void initializeDate() {
        if(this.date==null) this.date=LocalDate.now();
    }
}
