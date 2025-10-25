package com.cipher.MoneyManagementSystem.Repository;

import com.cipher.MoneyManagementSystem.Entity.IncomeEntity;
import com.cipher.MoneyManagementSystem.Model.Response.IncomeResponse;
import org.springframework.cglib.core.Local;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository

public interface IncomeRepository extends JpaRepository<IncomeEntity,Integer> {

    @Query("Select i from IncomeEntity i where i.profile.profileId=:id order by i.date desc")
    List<IncomeEntity> getAllTheIncomes(@Param("id") String profileId);

    @Query("Select i from IncomeEntity i where i.profile.profileId=:profileId and i.category.categoryId=:cat_id order by i.date desc")
    List<IncomeEntity> getIncomeByCategory(@Param("profileId") String profileId, @Param("cat_id") String categoryId);

    @Query("Select coalesce(Sum(i.amount),0) from IncomeEntity i where i.profile.profileId=:id")
    BigDecimal getTotalIncome(@Param("id") String profileId);

    @Query("Select i from IncomeEntity i where i.profile.profileId=:profileId and lower(i.name)=lower(:name)")
    IncomeEntity getIncomeByNameAndProfileId(@Param("profileId") String profileId, @Param("name") String name);

    @Query("Select i from IncomeEntity i where i.profile.profileId=:profileId and i.date Between :startDate and :endDate")
    List<IncomeEntity> getIncomeResponseByThisMonth(@Param("profileId") String profileId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("Select i from IncomeEntity i where i.profile.profileId=:profileId order by i.date desc")
    Page<IncomeEntity> getLatest5Incomes(@Param("profileId") String profileId, Pageable page);

    @Query("Select i from IncomeEntity i where i.profile.profileId=:profileId and lower(i.name) like concat('%',lower(:name),'%') and i.date between :start and :end")
    List<IncomeEntity> getIncomeByNameStartAndEndDateAndProfileId(@Param("profileId") String profileId, @Param("start") LocalDate startDate,
                                                                  @Param("end") LocalDate endDate, @Param("name") String keyword,
                                                                  Sort sort);


    @Query("Select i from IncomeEntity i where i.profile.profileId=:profileId and (:keyword is Null or lower(i.name) like concat('%',lower(:keyword),'%')) and i.date>=:start and i.date<=:end")
    public List<IncomeEntity> getFilteredIncome(@Param("profileId") String profileId, @Param("keyword") String keyword,
                                                @Param("start") LocalDate startDate, @Param("end") LocalDate endDate, Sort sort);
}
