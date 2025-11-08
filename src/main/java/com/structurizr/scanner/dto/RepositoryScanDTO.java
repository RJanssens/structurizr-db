package com.structurizr.scanner.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RepositoryScanDTO {
    private Long id;
    private UUID uuid;
    private Long repositoryId;
    private String repositoryName;
    private String repositoryUrl;
    private String scannedBranch;
    private String commitHash;
    private String scanStatus;
    private LocalDateTime scanStartedAt;
    private LocalDateTime scanCompletedAt;
    private Long scanDurationSeconds;
    private Integer applicationsFound;
    private Integer technologiesFound;
    private Integer interfacesFound;
    private String scanType;
    private String initiatedBy;
    private String scanNotes;
    private String errorMessage;
    private String errorDetails;
    private String scanConfiguration;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
