package com.structurizr.scanner.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationVersionDTO {
    private Long id;
    private Long applicationId;
    private Integer versionNumber;
    private String scannedBranch;
    private String commitHash;
    private String description;
    private String department;
    private String technologyStackSnapshot;
    private String interfacesSnapshot;
    private String scanNotes;
    private LocalDateTime scannedAt;
    private String scannedBy;
}
