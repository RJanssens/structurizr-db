package com.structurizr.scanner.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Core entity representing an application in the architecture landscape.
 * Uses UUID to ensure uniqueness and enable shared component identification.
 */
@Entity
@Table(name = "applications", indexes = {
    @Index(name = "idx_app_name", columnList = "name"),
    @Index(name = "idx_app_uuid", columnList = "uuid")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * UUID for cross-reference and shared component identification
     */
    @Column(nullable = false, unique = true)
    private UUID uuid;

    /**
     * Application name
     */
    @Column(nullable = false)
    private String name;

    /**
     * Application description
     */
    @Column(length = 2000)
    private String description;

    /**
     * GitLab repository URL
     */
    @Column(length = 500)
    private String repositoryUrl;

    /**
     * Department or team responsible
     */
    private String department;

    /**
     * Author (typically repository creator)
     */
    private String author;

    /**
     * Date the repository was created
     */
    private LocalDateTime dateCreated;

    /**
     * Flag to indicate if this is a shared building block
     */
    @Column(nullable = false)
    private Boolean isSharedComponent = false;

    /**
     * Current version number (incremented on each scan)
     */
    @Column(nullable = false)
    private Integer currentVersion = 1;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    /**
     * Timestamp of last scan
     */
    private LocalDateTime lastScannedAt;

    /**
     * Version history for this application
     */
    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ApplicationVersion> versions = new ArrayList<>();

    /**
     * Technology stack for current version
     */
    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TechnologyStack> technologyStack = new ArrayList<>();

    /**
     * Outbound interfaces from this application
     */
    @OneToMany(mappedBy = "sourceApplication", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ApplicationInterface> outboundInterfaces = new ArrayList<>();

    /**
     * Inbound interfaces to this application
     */
    @OneToMany(mappedBy = "targetApplication", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ApplicationInterface> inboundInterfaces = new ArrayList<>();

    /**
     * Users of this application
     */
    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ApplicationUser> users = new ArrayList<>();

    /**
     * Additional metadata key-value pairs
     */
    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ApplicationMetadata> metadata = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (uuid == null) {
            uuid = UUID.randomUUID();
        }
        if (currentVersion == null) {
            currentVersion = 1;
        }
        if (isSharedComponent == null) {
            isSharedComponent = false;
        }
    }
}
