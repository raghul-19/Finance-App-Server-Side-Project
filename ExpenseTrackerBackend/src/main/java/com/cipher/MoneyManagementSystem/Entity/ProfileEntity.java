package com.cipher.MoneyManagementSystem.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jdk.jfr.Timestamp;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name="user_profile")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data

public class ProfileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

    private String imgUrl;

    @Column(unique = true)
    private String profileId;

    @Email
    @Column(unique=true)
    private String email;

    private String password;
    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    private Boolean isActive;
    @Column(unique = true)
    private String authToken;

    @PrePersist
    public void initializeAttributes() {
        if(isActive==null) {
            isActive=false;
        }
    }
}
