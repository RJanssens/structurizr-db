package com.structurizr.scanner.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Entity representing a GitLab repository that can be scanned for architecture information.
 * This entity maintains metadata about repositories from GitLab and tracks their scan history.
 */
@Entity
@Table(name = "repositories", indexes = {
    @Index(name = "idx_repo_uuid", columnList = "uuid"),
    @Index(name = "idx_repo_url", columnList = "url"),
    @Index(name = "idx_repo_namespace", columnList = "namespace_path"),
    @Index(name = "idx_repo_name", columnList = "name")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Repository {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Unique identifier for cross-referencing
     */
    @Column(nullable = false, unique = true)
    private UUID uuid;

    /**
     * GitLab project ID
     */
    @Column(name = "gitlab_project_id")
    private Long gitlabProjectId;

    /**
     * Repository name
     */
    @Column(nullable = false)
    private String name;

    /**
     * Full repository URL (e.g., https://gitlab.com/group/project)
     */
    @Column(nullable = false, unique = true, length = 500)
    private String url;

    /**
     * Repository namespace/group path (e.g., "group/subgroup")
     */
    @Column(name = "namespace_path", length = 500)
    private String namespacePath;

    /**
     * Repository description from GitLab
     */
    @Column(length = 2000)
    private String description;

    /**
     * Default branch name (e.g., "main", "master", "develop")
     */
    @Column(name = "default_branch")
    private String defaultBranch;

    /**
     * Repository visibility (public, private, internal)
     */
    @Column(length = 20)
    private String visibility;

    /**
     * Web URL for browsing the repository
     */
    @Column(name = "web_url", length = 500)
    private String webUrl;

    /**
     * SSH URL for cloning
     */
    @Column(name = "ssh_url", length = 500)
    private String sshUrl;

    /**
     * HTTP URL for cloning
     */
    @Column(name = "http_url", length = 500)
    private String httpUrl;

    /**
     * Last activity timestamp from GitLab (last commit, push, etc.)
     */
    @Column(name = "last_activity_at")
    private LocalDateTime lastActivityAt;

    /**
     * Repository creation timestamp from GitLab
     */
    @Column(name = "gitlab_created_at")
    private LocalDateTime gitlabCreatedAt;

    /**
     * Whether this repository is archived in GitLab
     */
    @Column(name = "is_archived")
    @Builder.Default
    private Boolean isArchived = false;

    /**
     * Whether this repository should be included in scans
     */
    @Column(name = "is_enabled_for_scanning")
    @Builder.Default
    private Boolean isEnabledForScanning = true;

    /**
     * Tags/topics from GitLab
     */
    @Column(length = 1000)
    private String topics;

    /**
     * Programming languages detected by GitLab
     */
    @Column(length = 1000)
    private String languages;

    /**
     * Last time this repository metadata was synced from GitLab
     */
    @Column(name = "last_synced_at")
    private LocalDateTime lastSyncedAt;

    /**
     * Timestamp when this record was created in our system
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Timestamp when this record was last updated
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Applications found in this repository
     */
    @OneToMany(mappedBy = "repository", cascade = CascadeType.ALL, orphanRemoval = false)
    @Builder.Default
    private List<Application> applications = new ArrayList<>();

    /**
     * Scan history for this repository
     */
    @OneToMany(mappedBy = "repository", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<RepositoryScan> scans = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (uuid == null) {
            uuid = UUID.randomUUID();
        }
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
