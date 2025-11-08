package com.structurizr.scanner.repository;

import com.structurizr.scanner.entity.ApplicationInterface;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ApplicationInterfaceRepository extends JpaRepository<ApplicationInterface, Long> {

    Optional<ApplicationInterface> findByUuid(UUID uuid);

    List<ApplicationInterface> findBySourceApplicationId(Long sourceAppId);

    List<ApplicationInterface> findByTargetApplicationId(Long targetAppId);

    @Query("SELECT i FROM ApplicationInterface i WHERE i.sourceApplication.uuid = :uuid")
    List<ApplicationInterface> findBySourceApplicationUuid(@Param("uuid") UUID uuid);

    @Query("SELECT i FROM ApplicationInterface i WHERE i.targetApplication.uuid = :uuid")
    List<ApplicationInterface> findByTargetApplicationUuid(@Param("uuid") UUID uuid);

    List<ApplicationInterface> findByProtocol(String protocol);

    @Query("SELECT DISTINCT i.protocol FROM ApplicationInterface i WHERE i.protocol IS NOT NULL ORDER BY i.protocol")
    List<String> findAllProtocols();

    @Query("SELECT i FROM ApplicationInterface i WHERE i.sourceApplication.id = :appId OR i.targetApplication.id = :appId")
    List<ApplicationInterface> findAllByApplicationId(@Param("appId") Long appId);
}
