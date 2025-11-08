package com.structurizr.scanner.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationUserDTO {
    private Long id;
    private Long applicationId;
    private String userName;
    private String userType;
    private String role;
    private String description;
    private LocalDateTime createdAt;
}
