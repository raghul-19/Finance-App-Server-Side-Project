package com.cipher.MoneyManagementSystem.Repository;


import com.cipher.MoneyManagementSystem.Constants.CategoryType;
import com.cipher.MoneyManagementSystem.Entity.CategoryEntity;
import com.cipher.MoneyManagementSystem.Model.Response.CategoryResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface CategoryRepository extends JpaRepository<CategoryEntity,Integer> {

    @Query("Select c from CategoryEntity c where c.profile.profileId=:id")
    public List<CategoryEntity> getAllCategories(@Param("id") String profileId);

    @Query("Select c from CategoryEntity c where c.profile.profileId=:profileId and c.categoryType=:type")
    public List<CategoryEntity> getCategoriesByType(@Param("profileId") String profileId, @Param("type") CategoryType type);

    @Query("Select c from CategoryEntity c where c.profile.profileId=:profileId and Lower(c.name)=Lower(:name)")
    public CategoryEntity getCategoryByName(@Param("profileId") String profileId, @Param("name") String name);

    @Query("Select c from CategoryEntity c where c.profile.profileId=:profileId and c.id=:id")
    public CategoryEntity getCategoryById(@Param("profileId") String profileId, @Param("id") int id);

    @Query("Select c from CategoryEntity c where c.profile.profileId=:profileId and c.categoryId=:categoryId")
    public CategoryEntity getCategoryByCategoryId(@Param("profileId") String profileId, @Param("categoryId") String categoryId);

}
