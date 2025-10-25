package com.cipher.MoneyManagementSystem.Controller;

import com.cipher.MoneyManagementSystem.Model.Request.CategoryGetRequest;
import com.cipher.MoneyManagementSystem.Model.Request.CategoryRequest;
import com.cipher.MoneyManagementSystem.Model.Request.CategoryUpdateRequest;
import com.cipher.MoneyManagementSystem.Model.Response.CategoryResponse;
import com.cipher.MoneyManagementSystem.Service.Interface.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/category")

public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public List<CategoryResponse> getAllCategories(@RequestParam String email) {
         System.out.println(email);
         return categoryService.getAllCategories(email);
    }

    @GetMapping("/type")
    public List<CategoryResponse> getCategoryByType(@RequestParam String email, @RequestParam String type) {
        return categoryService.getCategoriesByType(email,type);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createNewCategory(@RequestPart("data") CategoryRequest request, @RequestPart("file") MultipartFile file) throws IOException {
        CategoryResponse category=categoryService.createNewCategory(request,file);
        if(category!=null) {
            return ResponseEntity.ok().body(category);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error","Category already exists or invalid data provided"));
    }

    @GetMapping("/id")
    public CategoryResponse getCategoryById(@RequestParam String email, @RequestParam int id) {
        return categoryService.getCategoryById(id, email);
    }

    @GetMapping("/name")
    public CategoryResponse getCategoryByName(@RequestParam String email, @RequestParam String name) {
        return categoryService.getCategoryByName(name, email);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateCategory(@RequestPart("data") CategoryUpdateRequest category, @RequestPart(name="file",required = false) MultipartFile file) {
        try {
            CategoryResponse updatedCategory=categoryService.updateCategory(category,file);
            return ResponseEntity.ok().body(updatedCategory);

        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error",e.getMessage()));
        }
    }


}
