package com.structurizr.scanner.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationMetadataDTO {
    private Long id;
    private Long applicationId;
    private String key;
    private String value;
    private String valueType;
    private String category;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
