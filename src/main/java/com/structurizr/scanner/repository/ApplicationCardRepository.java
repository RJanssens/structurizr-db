package com.structurizr.scanner.repository;

import com.structurizr.scanner.entity.ApplicationCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationCardRepository extends JpaRepository<ApplicationCard, Long> {

    List<ApplicationCard> findByApplicationIdOrderBySortOrder(Long applicationId);

    List<ApplicationCard> findByApplicationIdAndVisibleOrderBySortOrder(Long applicationId, Boolean visible);

    List<ApplicationCard> findByApplicationIdAndCardTypeOrderBySortOrder(Long applicationId, String cardType);

    Optional<ApplicationCard> findByIdAndApplicationId(Long id, Long applicationId);

    @Query("SELECT c FROM ApplicationCard c WHERE c.application.id = :applicationId AND (c.title LIKE %:searchTerm% OR c.content LIKE %:searchTerm%)")
    List<ApplicationCard> searchCardsByApplicationId(@Param("applicationId") Long applicationId, @Param("searchTerm") String searchTerm);

    @Query("SELECT DISTINCT c.cardType FROM ApplicationCard c WHERE c.application.id = :applicationId ORDER BY c.cardType")
    List<String> findDistinctCardTypesByApplicationId(@Param("applicationId") Long applicationId);

    void deleteByApplicationId(Long applicationId);
}
