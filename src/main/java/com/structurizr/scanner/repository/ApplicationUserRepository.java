package com.structurizr.scanner.repository;

import com.structurizr.scanner.entity.ApplicationUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationUserRepository extends JpaRepository<ApplicationUser, Long> {

    List<ApplicationUser> findByApplicationId(Long applicationId);

    List<ApplicationUser> findByUserName(String userName);

    List<ApplicationUser> findByUserType(String userType);

    @Query("SELECT DISTINCT u.userType FROM ApplicationUser u WHERE u.userType IS NOT NULL ORDER BY u.userType")
    List<String> findAllUserTypes();
}
