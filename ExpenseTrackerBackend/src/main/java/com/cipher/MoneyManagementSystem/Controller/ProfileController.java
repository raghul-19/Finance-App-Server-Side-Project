package com.cipher.MoneyManagementSystem.Controller;


import com.cipher.MoneyManagementSystem.Entity.ProfileEntity;
import com.cipher.MoneyManagementSystem.Model.Request.ProfileRequest;
import com.cipher.MoneyManagementSystem.Model.Response.ProfileResponse;
import com.cipher.MoneyManagementSystem.Service.Interface.EmailService;
import com.cipher.MoneyManagementSystem.Service.Interface.ProfileService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController

public class ProfileController {

    @Autowired
    private ProfileService profileService;
    @Autowired
    private EmailService emailService;

    private final Map<String,Object>otp=new HashMap<>();

    @GetMapping("/test")
    public String checkTesting() {
        return "Test Completed";
    }

    @GetMapping("/profile/generateOtp")
    public void generateOtp(@RequestParam String email) {
        SecureRandom random=new SecureRandom();
        int otpNumber = 1000 + random.nextInt(9000);
        otp.put("number",String.valueOf(otpNumber));
        otp.put("createdAt", LocalDateTime.now());
        String body="Your One-Time Password (OTP) is: "+otpNumber+".It is valid for 2 minutes.";
        String subject="Account verification concerns regarding";
        emailService.sendVerificationEmail(email,body,subject);
    }


    @PostMapping("/profile/register")
    public ResponseEntity<?> registerUser(@RequestPart("data") @Valid ProfileRequest request, @RequestPart("file")MultipartFile file) {
       try{
           ProfileResponse profile=profileService.createUserProfile(request,file);
           return ResponseEntity.ok("User Profile created");
       } catch(Exception e) {
           return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "User already exists or invalid data provided"));
       }

    }

    @GetMapping("/profile/activate")
    public ResponseEntity<String> activateUser(@RequestParam String email, @RequestParam String otpNumber) {
        String generatedOtp=(String) otp.get("number");
        LocalDateTime generatedTime=(LocalDateTime) otp.get("createdAt");
        Duration duration=Duration.between(generatedTime,LocalDateTime.now());
        long timeGap=duration.getSeconds();
        if(otpNumber.equals(otp.get("number")) && timeGap<=120) {
            profileService.activateUserAccount(email);
            return ResponseEntity.ok("Account activated");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid OTP or OTP expired. Please try again.");
    }

    @GetMapping("/getProfile")
    public ProfileResponse getUserProfile(@RequestParam String email) {
        return profileService.getUserProfileResponseByEmail(email);
    }

    @GetMapping("/profile/password_reset_email")
    public ResponseEntity<?> sendPasswordResetEmail(@RequestParam String email) {
        profileService.sendPasswordResetEmail(email);
        return ResponseEntity.ok("Password reset email sent successfully");
    }

    @PutMapping("/profile/changePassword")
    public ResponseEntity<String> resetUserPassword(@RequestParam String email, @RequestParam String password) {
        profileService.resetUserPassword(email,password);
        return ResponseEntity.ok("Password reset successfully");
    }

}

