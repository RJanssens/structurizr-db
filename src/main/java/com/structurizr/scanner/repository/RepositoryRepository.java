package com.structurizr.scanner.repository;

import com.structurizr.scanner.entity.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@org.springframework.stereotype.Repository
public interface RepositoryRepository extends JpaRepository<Repository, Long> {

    /**
     * Find repository by UUID
     */
    Optional<Repository> findByUuid(UUID uuid);

    /**
     * Find repository by URL
     */
    Optional<Repository> findByUrl(String url);

    /**
     * Find repository by GitLab project ID
     */
    Optional<Repository> findByGitlabProjectId(Long gitlabProjectId);

    /**
     * Find all repositories by namespace path
     */
    List<Repository> findByNamespacePath(String namespacePath);

    /**
     * Find repositories enabled for scanning
     */
    List<Repository> findByIsEnabledForScanningTrue();

    /**
     * Find repositories disabled for scanning (out of scope)
     */
    List<Repository> findByIsEnabledForScanningFalse();

    /**
     * Find archived repositories
     */
    List<Repository> findByIsArchivedTrue();

    /**
     * Find non-archived repositories
     */
    List<Repository> findByIsArchivedFalse();

    /**
     * Find repositories by visibility
     */
    List<Repository> findByVisibility(String visibility);

    /**
     * Search repositories by name or description
     */
    @Query("SELECT r FROM Repository r WHERE r.name LIKE %:searchTerm% OR r.description LIKE %:searchTerm%")
    List<Repository> searchByNameOrDescription(@Param("searchTerm") String searchTerm);

    /**
     * Find all namespace paths
     */
    @Query("SELECT DISTINCT r.namespacePath FROM Repository r WHERE r.namespacePath IS NOT NULL ORDER BY r.namespacePath")
    List<String> findAllNamespacePaths();

    /**
     * Find repository with its applications eagerly loaded
     */
    @Query("SELECT r FROM Repository r LEFT JOIN FETCH r.applications WHERE r.uuid = :uuid")
    Optional<Repository> findByUuidWithApplications(@Param("uuid") UUID uuid);

    /**
     * Find repository with its scans eagerly loaded
     */
    @Query("SELECT r FROM Repository r LEFT JOIN FETCH r.scans WHERE r.uuid = :uuid")
    Optional<Repository> findByUuidWithScans(@Param("uuid") UUID uuid);

    /**
     * Find repositories that need syncing (not synced recently)
     */
    @Query("SELECT r FROM Repository r WHERE r.lastSyncedAt IS NULL OR r.lastSyncedAt < :olderThan ORDER BY r.lastSyncedAt ASC NULLS FIRST")
    List<Repository> findRepositoriesNeedingSync(@Param("olderThan") java.time.LocalDateTime olderThan);

    /**
     * Count repositories by namespace
     */
    @Query("SELECT r.namespacePath, COUNT(r) FROM Repository r WHERE r.namespacePath IS NOT NULL GROUP BY r.namespacePath")
    List<Object[]> countByNamespace();

    /**
     * Find repositories with no applications
     */
    @Query("SELECT r FROM Repository r WHERE SIZE(r.applications) = 0")
    List<Repository> findRepositoriesWithoutApplications();
}
