package com.structurizr.scanner.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationCardDTO {
    private Long id;
    private Long applicationId;
    private String title;
    private String cardType;
    private String content;
    private String mermaidDiagram;
    private Integer sortOrder;
    private Boolean visible;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
