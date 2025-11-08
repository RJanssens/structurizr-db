package com.structurizr.scanner.repository;

import com.structurizr.scanner.entity.ApplicationVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ApplicationVersionRepository extends JpaRepository<ApplicationVersion, Long> {

    List<ApplicationVersion> findByApplicationIdOrderByVersionNumberDesc(Long applicationId);

    @Query("SELECT v FROM ApplicationVersion v WHERE v.application.uuid = :uuid ORDER BY v.versionNumber DESC")
    List<ApplicationVersion> findByApplicationUuidOrderByVersionNumberDesc(@Param("uuid") UUID uuid);

    @Query("SELECT v FROM ApplicationVersion v WHERE v.application.id = :appId AND v.versionNumber = :versionNumber")
    Optional<ApplicationVersion> findByApplicationIdAndVersionNumber(@Param("appId") Long appId, @Param("versionNumber") Integer versionNumber);

    @Query("SELECT MAX(v.versionNumber) FROM ApplicationVersion v WHERE v.application.id = :appId")
    Optional<Integer> findMaxVersionNumberByApplicationId(@Param("appId") Long appId);
}
