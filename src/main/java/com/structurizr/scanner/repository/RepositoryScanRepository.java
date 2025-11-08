package com.structurizr.scanner.repository;

import com.structurizr.scanner.entity.Repository;
import com.structurizr.scanner.entity.RepositoryScan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@org.springframework.stereotype.Repository
public interface RepositoryScanRepository extends JpaRepository<RepositoryScan, Long> {

    /**
     * Find scan by UUID
     */
    Optional<RepositoryScan> findByUuid(UUID uuid);

    /**
     * Find all scans for a repository
     */
    List<RepositoryScan> findByRepositoryOrderByScanStartedAtDesc(Repository repository);

    /**
     * Find all scans for a repository by repository ID
     */
    @Query("SELECT s FROM RepositoryScan s WHERE s.repository.id = :repositoryId ORDER BY s.scanStartedAt DESC")
    List<RepositoryScan> findByRepositoryIdOrderByScanStartedAtDesc(@Param("repositoryId") Long repositoryId);

    /**
     * Find scans by status
     */
    List<RepositoryScan> findByScanStatusOrderByScanStartedAtDesc(String scanStatus);

    /**
     * Find scans by status for a specific repository
     */
    List<RepositoryScan> findByRepositoryAndScanStatusOrderByScanStartedAtDesc(Repository repository, String scanStatus);

    /**
     * Find the most recent scan for a repository
     */
    @Query("SELECT s FROM RepositoryScan s WHERE s.repository.id = :repositoryId ORDER BY s.scanStartedAt DESC LIMIT 1")
    Optional<RepositoryScan> findMostRecentScanByRepositoryId(@Param("repositoryId") Long repositoryId);

    /**
     * Find the most recent completed scan for a repository
     */
    @Query("SELECT s FROM RepositoryScan s WHERE s.repository.id = :repositoryId AND s.scanStatus = 'COMPLETED' ORDER BY s.scanStartedAt DESC LIMIT 1")
    Optional<RepositoryScan> findMostRecentCompletedScanByRepositoryId(@Param("repositoryId") Long repositoryId);

    /**
     * Find scans within a date range
     */
    @Query("SELECT s FROM RepositoryScan s WHERE s.scanStartedAt BETWEEN :startDate AND :endDate ORDER BY s.scanStartedAt DESC")
    List<RepositoryScan> findScansBetweenDates(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    /**
     * Find scans by initiated by
     */
    List<RepositoryScan> findByInitiatedByOrderByScanStartedAtDesc(String initiatedBy);

    /**
     * Find failed scans
     */
    @Query("SELECT s FROM RepositoryScan s WHERE s.scanStatus = 'FAILED' ORDER BY s.scanStartedAt DESC")
    List<RepositoryScan> findFailedScans();

    /**
     * Find in-progress scans
     */
    @Query("SELECT s FROM RepositoryScan s WHERE s.scanStatus = 'IN_PROGRESS' ORDER BY s.scanStartedAt DESC")
    List<RepositoryScan> findInProgressScans();

    /**
     * Find pending scans
     */
    @Query("SELECT s FROM RepositoryScan s WHERE s.scanStatus = 'PENDING' ORDER BY s.scanStartedAt DESC")
    List<RepositoryScan> findPendingScans();

    /**
     * Find scans by scan type
     */
    List<RepositoryScan> findByScanTypeOrderByScanStartedAtDesc(String scanType);

    /**
     * Count scans by status
     */
    @Query("SELECT s.scanStatus, COUNT(s) FROM RepositoryScan s GROUP BY s.scanStatus")
    List<Object[]> countByStatus();

    /**
     * Count scans by repository
     */
    @Query("SELECT s.repository.id, s.repository.name, COUNT(s) FROM RepositoryScan s GROUP BY s.repository.id, s.repository.name ORDER BY COUNT(s) DESC")
    List<Object[]> countByRepository();

    /**
     * Get average scan duration
     */
    @Query("SELECT AVG(s.scanDurationSeconds) FROM RepositoryScan s WHERE s.scanDurationSeconds IS NOT NULL")
    Double getAverageScanDuration();

    /**
     * Get average scan duration by repository
     */
    @Query("SELECT s.repository.id, s.repository.name, AVG(s.scanDurationSeconds) FROM RepositoryScan s WHERE s.scanDurationSeconds IS NOT NULL GROUP BY s.repository.id, s.repository.name")
    List<Object[]> getAverageScanDurationByRepository();

    /**
     * Find scans older than a certain date
     */
    @Query("SELECT s FROM RepositoryScan s WHERE s.scanStartedAt < :date ORDER BY s.scanStartedAt ASC")
    List<RepositoryScan> findScansOlderThan(@Param("date") LocalDateTime date);

    /**
     * Find scans for a specific branch
     */
    List<RepositoryScan> findByScannedBranchOrderByScanStartedAtDesc(String scannedBranch);

    /**
     * Find scans for a repository and branch
     */
    List<RepositoryScan> findByRepositoryAndScannedBranchOrderByScanStartedAtDesc(Repository repository, String scannedBranch);

    /**
     * Find scans with applications found greater than threshold
     */
    @Query("SELECT s FROM RepositoryScan s WHERE s.applicationsFound > :threshold ORDER BY s.applicationsFound DESC")
    List<RepositoryScan> findScansWithApplicationsGreaterThan(@Param("threshold") Integer threshold);

    /**
     * Get total applications found across all scans
     */
    @Query("SELECT SUM(s.applicationsFound) FROM RepositoryScan s WHERE s.scanStatus = 'COMPLETED'")
    Long getTotalApplicationsFound();

    /**
     * Get statistics for completed scans
     */
    @Query("SELECT COUNT(s), SUM(s.applicationsFound), SUM(s.technologiesFound), SUM(s.interfacesFound), AVG(s.scanDurationSeconds) FROM RepositoryScan s WHERE s.scanStatus = 'COMPLETED'")
    Object[] getCompletedScanStatistics();
}
