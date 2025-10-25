package com.cipher.MoneyManagementSystem.Service.Interface;
import com.cipher.MoneyManagementSystem.Entity.CategoryEntity;
import com.cipher.MoneyManagementSystem.Model.Request.CategoryRequest;
import com.cipher.MoneyManagementSystem.Model.Request.CategoryUpdateRequest;
import com.cipher.MoneyManagementSystem.Model.Response.CategoryResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface CategoryService {

    List<CategoryResponse> getAllCategories(String email);
    List<CategoryResponse> getCategoriesByType(String email, String type);
    CategoryResponse getCategoryById(int id, String email);
    CategoryResponse getCategoryByName(String name, String email);
    CategoryResponse createNewCategory(CategoryRequest request, MultipartFile file) throws IOException;
    CategoryEntity getCategoryByCategoryId(String email, String categoryId);
    CategoryResponse updateCategory(CategoryUpdateRequest updatedCategory, MultipartFile file) throws IOException;
}
