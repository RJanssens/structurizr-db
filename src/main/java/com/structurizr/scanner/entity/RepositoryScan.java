package com.structurizr.scanner.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entity representing a scan operation on a repository.
 * This entity tracks when repositories were scanned, the scan status, and results.
 */
@Entity
@Table(name = "repository_scans", indexes = {
    @Index(name = "idx_scan_repo_id", columnList = "repository_id"),
    @Index(name = "idx_scan_status", columnList = "scan_status"),
    @Index(name = "idx_scan_started_at", columnList = "scan_started_at"),
    @Index(name = "idx_scan_uuid", columnList = "uuid")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RepositoryScan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Unique identifier for this scan
     */
    @Column(nullable = false, unique = true)
    private UUID uuid;

    /**
     * Repository that was scanned
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repository_id", nullable = false)
    private Repository repository;

    /**
     * Branch that was scanned
     */
    @Column(name = "scanned_branch", nullable = false)
    private String scannedBranch;

    /**
     * Git commit hash at the time of scan
     */
    @Column(name = "commit_hash", length = 40)
    private String commitHash;

    /**
     * Scan status: PENDING, IN_PROGRESS, COMPLETED, FAILED, CANCELLED
     */
    @Column(name = "scan_status", nullable = false, length = 20)
    private String scanStatus;

    /**
     * When the scan was initiated
     */
    @Column(name = "scan_started_at", nullable = false)
    private LocalDateTime scanStartedAt;

    /**
     * When the scan completed (successfully or with failure)
     */
    @Column(name = "scan_completed_at")
    private LocalDateTime scanCompletedAt;

    /**
     * Duration of the scan in seconds
     */
    @Column(name = "scan_duration_seconds")
    private Long scanDurationSeconds;

    /**
     * Number of applications discovered in this scan
     */
    @Column(name = "applications_found")
    @Builder.Default
    private Integer applicationsFound = 0;

    /**
     * Number of technology stack items detected
     */
    @Column(name = "technologies_found")
    @Builder.Default
    private Integer technologiesFound = 0;

    /**
     * Number of interfaces/dependencies detected
     */
    @Column(name = "interfaces_found")
    @Builder.Default
    private Integer interfacesFound = 0;

    /**
     * Type of scan: FULL, INCREMENTAL, METADATA_ONLY
     */
    @Column(name = "scan_type", length = 20)
    @Builder.Default
    private String scanType = "FULL";

    /**
     * Who/what initiated the scan (user, automated scheduler, etc.)
     */
    @Column(name = "initiated_by")
    private String initiatedBy;

    /**
     * Additional notes or details about the scan
     */
    @Column(name = "scan_notes", length = 2000)
    private String scanNotes;

    /**
     * Error message if scan failed
     */
    @Column(name = "error_message", length = 2000)
    private String errorMessage;

    /**
     * Error stack trace if scan failed
     */
    @Column(name = "error_details", columnDefinition = "TEXT")
    private String errorDetails;

    /**
     * Configuration used for this scan (JSON format)
     */
    @Column(name = "scan_configuration", columnDefinition = "TEXT")
    private String scanConfiguration;

    /**
     * Timestamp when this record was created
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Timestamp when this record was last updated
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (uuid == null) {
            uuid = UUID.randomUUID();
        }
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (scanStartedAt == null) {
            scanStartedAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();

        // Calculate duration if scan is completed and duration not set
        if (scanCompletedAt != null && scanDurationSeconds == null && scanStartedAt != null) {
            scanDurationSeconds = java.time.Duration.between(scanStartedAt, scanCompletedAt).getSeconds();
        }
    }

    /**
     * Helper method to mark scan as completed
     */
    public void markAsCompleted() {
        this.scanStatus = "COMPLETED";
        this.scanCompletedAt = LocalDateTime.now();
        if (scanStartedAt != null) {
            this.scanDurationSeconds = java.time.Duration.between(scanStartedAt, scanCompletedAt).getSeconds();
        }
    }

    /**
     * Helper method to mark scan as failed
     */
    public void markAsFailed(String errorMessage, String errorDetails) {
        this.scanStatus = "FAILED";
        this.scanCompletedAt = LocalDateTime.now();
        this.errorMessage = errorMessage;
        this.errorDetails = errorDetails;
        if (scanStartedAt != null) {
            this.scanDurationSeconds = java.time.Duration.between(scanStartedAt, scanCompletedAt).getSeconds();
        }
    }
}
