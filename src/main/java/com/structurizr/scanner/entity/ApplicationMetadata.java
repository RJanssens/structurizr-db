package com.structurizr.scanner.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Flexible metadata storage for applications.
 * Allows storing arbitrary key-value pairs for extensibility.
 */
@Entity
@Table(name = "application_metadata", indexes = {
    @Index(name = "idx_metadata_app_id", columnList = "application_id"),
    @Index(name = "idx_metadata_key", columnList = "metadata_key")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationMetadata {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    /**
     * Metadata key (e.g., "deployment_environment", "cost_center", "compliance_level")
     */
    @Column(name = "metadata_key", nullable = false)
    private String key;

    /**
     * Metadata value
     */
    @Column(name = "metadata_value", length = 2000)
    private String value;

    /**
     * Value type for client-side parsing (e.g., "STRING", "NUMBER", "BOOLEAN", "JSON")
     */
    private String valueType = "STRING";

    /**
     * Category for grouping metadata
     */
    private String category;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
