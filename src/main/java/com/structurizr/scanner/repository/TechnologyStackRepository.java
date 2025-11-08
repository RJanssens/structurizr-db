package com.structurizr.scanner.repository;

import com.structurizr.scanner.entity.TechnologyStack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TechnologyStackRepository extends JpaRepository<TechnologyStack, Long> {

    List<TechnologyStack> findByApplicationId(Long applicationId);

    @Query("SELECT t FROM TechnologyStack t WHERE t.application.uuid = :uuid")
    List<TechnologyStack> findByApplicationUuid(@Param("uuid") UUID uuid);

    List<TechnologyStack> findByNameAndVersion(String name, String version);

    @Query("SELECT DISTINCT t.name FROM TechnologyStack t ORDER BY t.name")
    List<String> findAllTechnologyNames();

    @Query("SELECT DISTINCT t.category FROM TechnologyStack t WHERE t.category IS NOT NULL ORDER BY t.category")
    List<String> findAllCategories();

    @Query("SELECT t FROM TechnologyStack t WHERE t.name = :name")
    List<TechnologyStack> findByTechnologyName(@Param("name") String name);

    @Query("SELECT t FROM TechnologyStack t WHERE t.name = :name AND t.version = :version")
    List<TechnologyStack> findApplicationsByTechnology(@Param("name") String name, @Param("version") String version);
}
