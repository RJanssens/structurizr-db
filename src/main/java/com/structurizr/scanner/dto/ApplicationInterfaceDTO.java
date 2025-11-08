package com.structurizr.scanner.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationInterfaceDTO {
    private Long id;
    private UUID uuid;
    private Long sourceApplicationId;
    private String sourceApplicationName;
    private Long targetApplicationId;
    private String targetApplicationName;
    private String name;
    private String description;
    private String protocol;
    private String destination;
    private Integer port;
    private String direction;
    private String authenticationMethod;
    private String detectionSource;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
