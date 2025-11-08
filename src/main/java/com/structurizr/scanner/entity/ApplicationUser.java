package com.structurizr.scanner.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Represents users or user groups that use an application
 */
@Entity
@Table(name = "application_users", indexes = {
    @Index(name = "idx_user_app_id", columnList = "application_id"),
    @Index(name = "idx_user_name", columnList = "user_name")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    /**
     * User name or group name
     */
    @Column(nullable = false)
    private String userName;

    /**
     * Type: "INDIVIDUAL", "GROUP", "DEPARTMENT", "EXTERNAL"
     */
    private String userType;

    /**
     * Role or permission level
     */
    private String role;

    /**
     * Additional description
     */
    @Column(length = 500)
    private String description;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
