package com.structurizr.scanner.repository;

import com.structurizr.scanner.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    Optional<Application> findByUuid(UUID uuid);

    Optional<Application> findByName(String name);

    List<Application> findByDepartment(String department);

    List<Application> findByIsSharedComponent(Boolean isSharedComponent);

    @Query("SELECT a FROM Application a WHERE a.name LIKE %:searchTerm% OR a.description LIKE %:searchTerm%")
    List<Application> searchByNameOrDescription(@Param("searchTerm") String searchTerm);

    @Query("SELECT DISTINCT a.department FROM Application a WHERE a.department IS NOT NULL ORDER BY a.department")
    List<String> findAllDepartments();

    @Query("SELECT a FROM Application a LEFT JOIN FETCH a.technologyStack WHERE a.uuid = :uuid")
    Optional<Application> findByUuidWithTechnologyStack(@Param("uuid") UUID uuid);

    @Query("SELECT a FROM Application a LEFT JOIN FETCH a.outboundInterfaces LEFT JOIN FETCH a.inboundInterfaces WHERE a.uuid = :uuid")
    Optional<Application> findByUuidWithInterfaces(@Param("uuid") UUID uuid);
}
