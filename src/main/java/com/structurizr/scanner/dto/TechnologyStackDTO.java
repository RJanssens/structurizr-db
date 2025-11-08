package com.structurizr.scanner.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TechnologyStackDTO {
    private Long id;
    private Long applicationId;
    private String name;
    private String version;
    private String category;
    private String description;
    private String detectionSource;
    private LocalDateTime createdAt;
}
