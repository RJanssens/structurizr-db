package com.structurizr.scanner.repository;

import com.structurizr.scanner.entity.ApplicationMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationMetadataRepository extends JpaRepository<ApplicationMetadata, Long> {

    List<ApplicationMetadata> findByApplicationId(Long applicationId);

    Optional<ApplicationMetadata> findByApplicationIdAndKey(Long applicationId, String key);

    List<ApplicationMetadata> findByKey(String key);

    List<ApplicationMetadata> findByCategory(String category);

    @Query("SELECT DISTINCT m.key FROM ApplicationMetadata m ORDER BY m.key")
    List<String> findAllKeys();

    @Query("SELECT DISTINCT m.category FROM ApplicationMetadata m WHERE m.category IS NOT NULL ORDER BY m.category")
    List<String> findAllCategories();

    @Query("SELECT m FROM ApplicationMetadata m WHERE m.key = :key AND m.value = :value")
    List<ApplicationMetadata> findByKeyAndValue(@Param("key") String key, @Param("value") String value);
}
