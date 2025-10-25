package com.cipher.MoneyManagementSystem.Controller;


import com.cipher.MoneyManagementSystem.Entity.ProfileEntity;
import com.cipher.MoneyManagementSystem.Model.Request.LoginRequest;
import com.cipher.MoneyManagementSystem.Model.Response.LoginResponse;
import com.cipher.MoneyManagementSystem.Model.Response.ProfileResponse;
import com.cipher.MoneyManagementSystem.Repository.ProfileRepository;
import com.cipher.MoneyManagementSystem.Service.Authentication.JwtTokenUtil;
import com.cipher.MoneyManagementSystem.Service.Interface.EmailService;
import com.cipher.MoneyManagementSystem.Service.Interface.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/auth")

public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private ProfileService profileService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;
;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(),request.getPassword()));
        ProfileEntity profile=profileService.getUserProfileByEmail(request.getEmail());
        if(!profile.getIsActive()) {
            return ResponseEntity.ok("Account is not activated");
        }
        String token=jwtTokenUtil.createJwtToken(request.getEmail(),profile.getName(),"login");
        return ResponseEntity.ok(
                LoginResponse.builder()
                .email(profile.getEmail())
                .token(token)
                .name(profile.getName())
                .build());
    }

    @GetMapping("/verifyPasswordResetToken")
    public ResponseEntity<?> verifyToken(@RequestParam String email,@RequestParam String token) {
        try {
            jwtTokenUtil.validateToken(email,token);
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create("http://localhost:5173/password_reset?email="+email+"&status=valid"))
                    .build();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create("http://localhost:5173/password_reset?email="+email+"&status=expired"))
                    .build();
        }



    }

}