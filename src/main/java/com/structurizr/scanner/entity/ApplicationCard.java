package com.structurizr.scanner.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Entity representing documentation cards for applications.
 * Supports structured text content and Mermaid diagrams for visualizing
 * architecture, sequences, and other technical documentation.
 */
@Entity
@Table(name = "application_cards", indexes = {
    @Index(name = "idx_card_application_id", columnList = "application_id"),
    @Index(name = "idx_card_type", columnList = "card_type"),
    @Index(name = "idx_card_sort_order", columnList = "sort_order")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Parent application this card belongs to
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    /**
     * Card title
     */
    @Column(nullable = false, length = 255)
    private String title;

    /**
     * Type of card (e.g., "overview", "architecture", "sequence", "deployment", "custom")
     */
    @Column(name = "card_type", nullable = false, length = 50)
    private String cardType;

    /**
     * Structured text content (supports Markdown)
     */
    @Column(columnDefinition = "TEXT")
    private String content;

    /**
     * Mermaid diagram definition
     */
    @Column(name = "mermaid_diagram", columnDefinition = "TEXT")
    private String mermaidDiagram;

    /**
     * Display order for sorting cards
     */
    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;

    /**
     * Indicates if the card is visible
     */
    @Column(nullable = false)
    private Boolean visible = true;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (sortOrder == null) {
            sortOrder = 0;
        }
        if (visible == null) {
            visible = true;
        }
    }
}
