package com.structurizr.scanner.dto;

import com.structurizr.scanner.constants.CardType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationCardDTO {
    private Long id;

    @NotNull(message = "Application ID is required")
    private Long applicationId;

    @NotBlank(message = "Title is required")
    @Size(min = 1, max = 255, message = "Title must be between 1 and 255 characters")
    private String title;

    @NotBlank(message = "Card type is required")
    @Pattern(regexp = CardType.VALIDATION_PATTERN, message = CardType.VALIDATION_MESSAGE)
    private String cardType;

    @Size(max = 100000, message = "Content must not exceed 100,000 characters")
    private String content;

    @Size(max = 50000, message = "Mermaid diagram must not exceed 50,000 characters")
    private String mermaidDiagram;

    private Integer sortOrder;
    private Boolean visible;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
