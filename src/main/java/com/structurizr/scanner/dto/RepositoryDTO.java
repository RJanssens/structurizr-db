package com.structurizr.scanner.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RepositoryDTO {
    private Long id;
    private UUID uuid;
    private Long gitlabProjectId;
    private String name;
    private String url;
    private String namespacePath;
    private String description;
    private String defaultBranch;
    private String visibility;
    private String webUrl;
    private String sshUrl;
    private String httpUrl;
    private LocalDateTime lastActivityAt;
    private LocalDateTime gitlabCreatedAt;
    private Boolean isArchived;
    private Boolean isEnabledForScanning;
    private String scanDisabledReason;
    private String scanDisabledBy;
    private LocalDateTime scanDisabledAt;
    private String topics;
    private String languages;
    private LocalDateTime lastSyncedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Summary statistics
    private Integer applicationCount;
    private Integer scanCount;
    private LocalDateTime lastScanAt;

    // Related collections (can be populated on demand)
    private List<ApplicationDTO> applications = new ArrayList<>();
    private List<RepositoryScanDTO> recentScans = new ArrayList<>();
}
