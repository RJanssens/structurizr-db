package com.structurizr.scanner.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Represents a technology or dependency used by an application.
 * Examples: Spring Boot 3.2.1, PostgreSQL 15, RabbitMQ 3.12
 */
@Entity
@Table(name = "technology_stack", indexes = {
    @Index(name = "idx_tech_app_id", columnList = "application_id"),
    @Index(name = "idx_tech_name", columnList = "name"),
    @Index(name = "idx_tech_category", columnList = "category")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TechnologyStack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    /**
     * Technology name (e.g., "Spring Boot", "PostgreSQL", "RabbitMQ")
     */
    @Column(nullable = false)
    private String name;

    /**
     * Version of the technology
     */
    private String version;

    /**
     * Category for grouping (e.g., "Framework", "Database", "MessageQueue", "Language")
     */
    private String category;

    /**
     * Additional description or purpose
     */
    @Column(length = 500)
    private String description;

    /**
     * Source of detection (e.g., "pom.xml", "build.gradle", "package.json", "manual")
     */
    private String detectionSource;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
