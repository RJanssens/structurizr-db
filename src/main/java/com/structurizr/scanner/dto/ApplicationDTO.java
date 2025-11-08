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
public class ApplicationDTO {
    private Long id;
    private UUID uuid;
    private String name;
    private String description;
    private Long repositoryId;
    private String repositoryUrl;
    private String department;
    private String author;
    private LocalDateTime dateCreated;
    private Boolean isSharedComponent;
    private Integer currentVersion;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastScannedAt;

    // Related collections (can be populated on demand)
    private List<TechnologyStackDTO> technologyStack = new ArrayList<>();
    private List<ApplicationInterfaceDTO> outboundInterfaces = new ArrayList<>();
    private List<ApplicationInterfaceDTO> inboundInterfaces = new ArrayList<>();
    private List<ApplicationUserDTO> users = new ArrayList<>();
    private List<ApplicationMetadataDTO> metadata = new ArrayList<>();
    private List<ApplicationCardDTO> cards = new ArrayList<>();
}
