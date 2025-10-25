package com.cipher.MoneyManagementSystem.Repository;

import com.cipher.MoneyManagementSystem.Entity.ProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<ProfileEntity,Integer> {

    @Query("Select p from ProfileEntity  p where p.authToken=:token")
    public ProfileEntity findUserByAuthToken(@Param("token") String token);

    @Query("Select p from ProfileEntity p where p.email=:email")
    public Optional<ProfileEntity> findUserByEmail(@Param("email") String email);
}
