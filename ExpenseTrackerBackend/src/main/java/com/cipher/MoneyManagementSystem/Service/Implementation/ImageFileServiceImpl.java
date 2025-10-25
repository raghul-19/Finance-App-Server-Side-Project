package com.cipher.MoneyManagementSystem.Service.Implementation;

import com.cipher.MoneyManagementSystem.Service.Interface.ImageFileService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service

public class ImageFileServiceImpl implements ImageFileService {

    @Override
    public String createImageUrl(String type,MultipartFile file) throws IOException {
        String folderPath=System.getProperty("user.dir")+"\\MoneyManagementSystem\\uploads\\"+type+"\\";
        String fileName="img_"+ UUID.randomUUID() +file.getOriginalFilename();
        Path path= Paths.get(folderPath).resolve(fileName).normalize();
        Files.createDirectories(path.getParent());
        Files.write(path,file.getBytes());
        return "http://localhost:8080/files/"+type+"/"+fileName;
    }
    @Override
    public void deleteImageUrl(String type, String imageUrl) throws IOException {
        String baseUrl="http://localhost:8080/files/"+type+"/";
        String fileName=imageUrl.replace(baseUrl,"");
        String filePath=System.getProperty("user.dir")+"\\MoneyManagementSystem\\uploads\\"+type+"\\";
        Path path=Paths.get(filePath).resolve(fileName).normalize();
        Files.delete(path);
    }

}
