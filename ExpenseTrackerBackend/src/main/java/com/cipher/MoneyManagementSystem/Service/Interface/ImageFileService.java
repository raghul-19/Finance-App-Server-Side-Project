package com.cipher.MoneyManagementSystem.Service.Interface;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ImageFileService {

    public String createImageUrl(String type, MultipartFile file) throws IOException;
    void deleteImageUrl(String type, String imageUrl) throws IOException;
}
