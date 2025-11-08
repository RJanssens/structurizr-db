package com.structurizr.scanner.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Tracks version history for applications.
 * Each successful scan creates a new version record.
 */
@Entity
@Table(name = "application_versions", indexes = {
    @Index(name = "idx_version_app_id", columnList = "application_id"),
    @Index(name = "idx_version_number", columnList = "version_number")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    /**
     * Version number (incremented on each scan)
     */
    @Column(nullable = false)
    private Integer versionNumber;

    /**
     * Branch that was scanned
     */
    @Column(nullable = false)
    private String scannedBranch;

    /**
     * Git commit hash at scan time
     */
    @Column(length = 40)
    private String commitHash;

    /**
     * Snapshot of application description at this version
     */
    @Column(length = 2000)
    private String description;

    /**
     * Snapshot of department at this version
     */
    private String department;

    /**
     * Snapshot of technology stack (JSON or summary)
     */
    @Column(length = 5000)
    private String technologyStackSnapshot;

    /**
     * Snapshot of interfaces (JSON or summary)
     */
    @Column(length = 5000)
    private String interfacesSnapshot;

    /**
     * Notes about this scan/version
     */
    @Column(length = 1000)
    private String scanNotes;

    /**
     * Timestamp when this version was created (scan time)
     */
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime scannedAt;

    /**
     * Who initiated the scan
     */
    private String scannedBy;
}
