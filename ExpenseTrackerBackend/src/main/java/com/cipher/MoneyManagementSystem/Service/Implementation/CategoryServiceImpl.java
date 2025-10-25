package com.cipher.MoneyManagementSystem.Service.Implementation;
import com.cipher.MoneyManagementSystem.Constants.CategoryType;
import com.cipher.MoneyManagementSystem.Entity.CategoryEntity;
import com.cipher.MoneyManagementSystem.Entity.ProfileEntity;
import com.cipher.MoneyManagementSystem.Model.Request.CategoryRequest;
import com.cipher.MoneyManagementSystem.Model.Request.CategoryUpdateRequest;
import com.cipher.MoneyManagementSystem.Model.Response.CategoryResponse;
import com.cipher.MoneyManagementSystem.Repository.CategoryRepository;
import com.cipher.MoneyManagementSystem.Service.Interface.CategoryService;
import com.cipher.MoneyManagementSystem.Service.Interface.ImageFileService;
import com.cipher.MoneyManagementSystem.Service.Interface.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;
import java.util.UUID;


@Service

public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private ImageFileService imageFileService;

    @Autowired
    private ProfileService profileService;

    @Autowired
    private CategoryRepository categoryRepository;


    private CategoryEntity generateCategoryEntity(CategoryRequest request, MultipartFile file) throws IOException {
        String filePath=imageFileService.createImageUrl("categories",file);
        ProfileEntity profile=profileService.getUserProfileByEmail(request.getEmail());
        return CategoryEntity.builder()
                .name(request.getName())
                .categoryId("CAT_"+ UUID.randomUUID().toString())
                .imgUrl(filePath)
                .profile(profile)
                .categoryType(CategoryType.valueOf(request.getType().toUpperCase()))
                .build();
    }

    private CategoryResponse generateCategoryResponse(CategoryEntity entity) {
        return CategoryResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .categoryId(entity.getCategoryId())
                .imageUrl(entity.getImgUrl())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .type(entity.getCategoryType().toString().toLowerCase())
                .build();

    }

    @Override
    public List<CategoryResponse> getAllCategories(String email) {
        ProfileEntity profile=profileService.getUserProfileByEmail(email);
        return categoryRepository.getAllCategories(profile.getProfileId()).stream().map(category -> generateCategoryResponse(category)).toList();
    }

    @Override
    public List<CategoryResponse> getCategoriesByType(String email, String type) {
        ProfileEntity profile=profileService.getUserProfileByEmail(email);
        CategoryType categoryType=CategoryType.valueOf(type.toUpperCase());
        return categoryRepository.getCategoriesByType(profile.getProfileId(),categoryType).stream().map(category -> generateCategoryResponse(category)).toList();

    }

    @Override
    public CategoryResponse getCategoryById(int id, String email) {
        ProfileEntity profile=profileService.getUserProfileByEmail(email);
        return generateCategoryResponse(categoryRepository.getCategoryById(profile.getProfileId(),id));
    }

    @Override
    public CategoryResponse getCategoryByName(String name, String email) {
        ProfileEntity profile=profileService.getUserProfileByEmail(email);
        return generateCategoryResponse(categoryRepository.getCategoryByName(profile.getProfileId(),name));
    }

    @Override
    public CategoryResponse createNewCategory(CategoryRequest request, MultipartFile file) throws IOException {
        ProfileEntity profile=profileService.getUserProfileByEmail(request.getEmail());
        CategoryEntity category=categoryRepository.getCategoryByName(profile.getProfileId(),request.getName());
        if(category==null) {
            return generateCategoryResponse(categoryRepository.save(generateCategoryEntity(request,file)));
        }
        return null;

    }

    @Override
    public CategoryEntity getCategoryByCategoryId(String email, String categoryId) {
        ProfileEntity profile=profileService.getUserProfileByEmail(email);
        return categoryRepository.getCategoryByCategoryId(profile.getProfileId(),categoryId);
    }

    @Override
    public CategoryResponse updateCategory(CategoryUpdateRequest updatedCategory, MultipartFile file) throws IOException {
        ProfileEntity profile=profileService.getUserProfileByEmail(updatedCategory.getEmail());
        CategoryEntity category=categoryRepository.getCategoryByCategoryId(profile.getProfileId(),updatedCategory.getCategoryId());
        category.setName(updatedCategory.getName());
        category.setCategoryType(CategoryType.valueOf(updatedCategory.getType().toUpperCase()));
        if(file!=null) {
            imageFileService.deleteImageUrl("categories", category.getImgUrl());
            String filePath=imageFileService.createImageUrl("categories",file);
            category.setImgUrl(filePath);
        }
        return generateCategoryResponse(categoryRepository.save(category));
    }
}
