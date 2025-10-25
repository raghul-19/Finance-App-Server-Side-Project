package com.cipher.MoneyManagementSystem.Service.Interface;

import com.cipher.MoneyManagementSystem.Entity.ProfileEntity;
import com.cipher.MoneyManagementSystem.Model.Request.ProfileRequest;
import com.cipher.MoneyManagementSystem.Model.Response.ProfileResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ProfileService {
    ProfileResponse createUserProfile(ProfileRequest request, MultipartFile file) throws IOException;
    void activateUserAccount(String email);
    ProfileEntity getUserProfileByEmail(String email);
    ProfileEntity verifyUserExistence(String email,String name,String imageUrl);
    List<ProfileResponse> getAllUserProfiles();
    ProfileResponse getUserProfileResponseByEmail(String email);
    void sendPasswordResetEmail(String email);
    void resetUserPassword(String email, String password);
}
