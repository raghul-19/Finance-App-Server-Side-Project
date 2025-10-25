package com.cipher.MoneyManagementSystem.Repository;

import com.cipher.MoneyManagementSystem.Entity.ExpensiveEntity;
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

public interface ExpenseRepository extends JpaRepository<ExpensiveEntity,Integer> {

    @Query("Select e from ExpensiveEntity e where e.profile.profileId=:id order by e.date desc")
    List<ExpensiveEntity> getAllExpenses(@Param("id") String profileId);

    @Query("Select e from ExpensiveEntity e where e.profile.profileId=:profileId and e.category.categoryId=:categoryId order by e.date")
    List<ExpensiveEntity> getExpensesByCategory(@Param("profileId") String profileId, @Param("categoryId") String categoryId);

    @Query("Select coalesce(SUM(e.amount),0) from ExpensiveEntity e where e.profile.profileId=:id")
    BigDecimal getTotalExpense(@Param("id") String profileId);

    @Query("Select e from ExpensiveEntity e where e.profile.profileId=:profileId and lower(e.name)=Lower(:name)")
    ExpensiveEntity getExpenseByExpenseNameAndProfileId(@Param("profileId") String profileId, @Param("name") String name);

    @Query("Select e from ExpensiveEntity e where e.profile.profileId=:profileId and e.date between :startDate and :endDate")
    List<ExpensiveEntity> getExpenseByThisMonth(@Param("profileId") String profileId, @Param("startDate")LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("Select e from ExpensiveEntity e where e.profile.profileId=:profileId order by e.date desc")
    Page<ExpensiveEntity> getLatest5Expenses(@Param("profileId") String profileId, Pageable page);

    @Query("Select e from ExpensiveEntity e where e.profile.profileId=:profileId and lower(e.name) like concat('%',lower(:name),'%') and e.date between :start and :end")
    List<ExpensiveEntity> getExpenseByNameStartAndEndDateAndProfileId(
            @Param("profileId") String profileId,
            @Param("start") LocalDate startDate,
            @Param("end") LocalDate endDate,
            @Param("name") String keyword,
            Sort sort
    );

    @Query("Select e from ExpensiveEntity e where e.profile.profileId=:profileId and e.date=:date")
    List<ExpensiveEntity> getTodayExpenses(@Param("profileId") String profileId, @Param("date") LocalDate date);


    @Query("Select e from ExpensiveEntity e where e.profile.profileId=:profileId and (:keyword is null or lower(e.name) like concat('%',lower(:keyword),'%')) and e.date>=:start and e.date<=:end")
    List<ExpensiveEntity> getFilteredExpenses(@Param("profileId") String profileId, @Param("keyword") String keyword,
                                                 @Param("start") LocalDate startDate, @Param("end") LocalDate endDate, Sort sort);
}
