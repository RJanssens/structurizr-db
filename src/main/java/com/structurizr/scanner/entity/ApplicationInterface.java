package com.structurizr.scanner.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Represents an interface/connection between applications.
 * Can represent REST APIs, message queues, database connections, etc.
 */
@Entity
@Table(name = "application_interfaces", indexes = {
    @Index(name = "idx_interface_source", columnList = "source_application_id"),
    @Index(name = "idx_interface_target", columnList = "target_application_id"),
    @Index(name = "idx_interface_uuid", columnList = "uuid")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationInterface {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * UUID for interface identification (useful for shared interfaces)
     */
    @Column(nullable = false, unique = true)
    private UUID uuid;

    /**
     * Source application (the one making the call/connection)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_application_id", nullable = false)
    private Application sourceApplication;

    /**
     * Target application (the one receiving the call/connection)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_application_id")
    private Application targetApplication;

    /**
     * Interface name/identifier
     */
    @Column(nullable = false)
    private String name;

    /**
     * Description of the interface
     */
    @Column(length = 1000)
    private String description;

    /**
     * Protocol (e.g., "REST", "gRPC", "AMQP", "JDBC", "HTTP")
     */
    private String protocol;

    /**
     * Destination (e.g., hostname, URL, queue name)
     */
    @Column(length = 500)
    private String destination;

    /**
     * Port number if applicable
     */
    private Integer port;

    /**
     * Direction: "OUTBOUND", "INBOUND", or "BIDIRECTIONAL"
     */
    @Column(nullable = false)
    private String direction = "OUTBOUND";

    /**
     * Authentication method if known
     */
    private String authenticationMethod;

    /**
     * Source of detection
     */
    private String detectionSource;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (uuid == null) {
            uuid = UUID.randomUUID();
        }
        if (direction == null) {
            direction = "OUTBOUND";
        }
    }
}
