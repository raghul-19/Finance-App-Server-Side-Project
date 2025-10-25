package com.cipher.MoneyManagementSystem.Service.Implementation;

import com.cipher.MoneyManagementSystem.Entity.ProfileEntity;
import com.cipher.MoneyManagementSystem.Model.Request.ProfileRequest;
import com.cipher.MoneyManagementSystem.Model.Response.ProfileResponse;
import com.cipher.MoneyManagementSystem.Repository.ProfileRepository;
import com.cipher.MoneyManagementSystem.Service.Authentication.JwtTokenUtil;
import com.cipher.MoneyManagementSystem.Service.Interface.EmailService;
import com.cipher.MoneyManagementSystem.Service.Interface.ImageFileService;
import com.cipher.MoneyManagementSystem.Service.Interface.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service

public class ProfileServiceImpl implements ProfileService {

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired

    private ImageFileService imageFileService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;


    private ProfileEntity createEntityFromRequest(ProfileRequest request, MultipartFile file) throws IOException {

        String filePath=imageFileService.createImageUrl("profiles",file);

        return ProfileEntity.builder()
                .name(request.getName())
                .profileId("Profile_"+UUID.randomUUID().toString())
                .imgUrl(filePath)
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .authToken("Token_"+System.currentTimeMillis())
                .build();
    }

    private ProfileResponse createResponseFromEntity(ProfileEntity entity) {
        return ProfileResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .imgUrl(entity.getImgUrl())
                .profileId(entity.getProfileId())
                .email(entity.getEmail())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    @Override
    public ProfileResponse createUserProfile(ProfileRequest request,MultipartFile file) throws IOException {

        return createResponseFromEntity(profileRepository.save(createEntityFromRequest(request,file)));
    }

    @Override
    public void activateUserAccount(String email) {
        ProfileEntity profile=profileRepository.findUserByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,"Data not found"));
        profile.setIsActive(true);
        profileRepository.save(profile);
    }

    @Override
    public ProfileEntity getUserProfileByEmail(String email) {
        return profileRepository.findUserByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,"Data not found"));
    }

    @Override
    public ProfileResponse getUserProfileResponseByEmail(String email) {
        ProfileEntity profile=profileRepository.findUserByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,"Data not found"));
        return createResponseFromEntity(profile);
    }


    @Override
    public ProfileEntity verifyUserExistence(String email,String name,String imageUrl) {
        return profileRepository
                .findUserByEmail(email)
                .orElseGet(() -> {
                    ProfileEntity profile=ProfileEntity.builder()
                            .profileId("Profile_"+UUID.randomUUID().toString())
                            .email(email)
                            .name(name)
                            .imgUrl(imageUrl)
                            .isActive(true)
                            .build();
                    return profileRepository.save(profile);
                });
    }

    @Override
    public List<ProfileResponse> getAllUserProfiles() {
        return profileRepository.findAll().stream()
                .map(profile -> createResponseFromEntity(profile))
                .toList();
    }

    @Override
    public void sendPasswordResetEmail(String email) {

        ProfileEntity profile=profileRepository.findUserByEmail(email).orElseThrow(() -> new BadCredentialsException("USer email not found"));
        String resetToken=jwtTokenUtil.createJwtToken(email,profile.getName(),"reset_password");
        String resetLink="http://localhost:8080/api/auth/verifyPasswordResetToken?email="+email+"&token="+resetToken;
        String subject="Password Reset Request";
        String body="Click the link below to reset your password:\n"+resetLink;
        emailService.sendVerificationEmail(email,subject,body);
        return;
    }

    @Override
    public void resetUserPassword(String email, String password) {
        ProfileEntity profile=profileRepository.findUserByEmail(email).orElseThrow(() -> new BadCredentialsException("USer email not found"));
        profile.setPassword(passwordEncoder.encode(password));
        profileRepository.save(profile);
    }

}
