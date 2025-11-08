package com.structurizr.scanner.controller;

import com.structurizr.scanner.dto.ApplicationCardDTO;
import com.structurizr.scanner.entity.Application;
import com.structurizr.scanner.entity.ApplicationCard;
import com.structurizr.scanner.mapper.ApplicationMapper;
import com.structurizr.scanner.repository.ApplicationCardRepository;
import com.structurizr.scanner.repository.ApplicationRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/applications/{applicationId}/cards")
@CrossOrigin(origins = "*")
@Validated
public class ApplicationCardController {

    @Autowired
    private ApplicationCardRepository cardRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private ApplicationMapper mapper;

    @GetMapping
    public ResponseEntity<List<ApplicationCardDTO>> getAllCards(
            @PathVariable Long applicationId,
            @RequestParam(required = false) Boolean visible) {

        List<ApplicationCard> cards;
        if (visible != null) {
            cards = cardRepository.findByApplicationIdAndVisibleOrderBySortOrder(applicationId, visible);
        } else {
            cards = cardRepository.findByApplicationIdOrderBySortOrder(applicationId);
        }

        List<ApplicationCardDTO> cardDTOs = cards.stream()
            .map(mapper::toDTO)
            .collect(Collectors.toList());

        return ResponseEntity.ok(cardDTOs);
    }

    @GetMapping("/{cardId}")
    public ResponseEntity<ApplicationCardDTO> getCard(
            @PathVariable Long applicationId,
            @PathVariable Long cardId) {

        return cardRepository.findByIdAndApplicationId(cardId, applicationId)
            .map(mapper::toDTO)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/type/{cardType}")
    public ResponseEntity<List<ApplicationCardDTO>> getCardsByType(
            @PathVariable Long applicationId,
            @PathVariable String cardType) {

        List<ApplicationCardDTO> cards = cardRepository
            .findByApplicationIdAndCardTypeOrderBySortOrder(applicationId, cardType)
            .stream()
            .map(mapper::toDTO)
            .collect(Collectors.toList());

        return ResponseEntity.ok(cards);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ApplicationCardDTO>> searchCards(
            @PathVariable Long applicationId,
            @RequestParam String term) {

        List<ApplicationCardDTO> cards = cardRepository
            .searchCardsByApplicationId(applicationId, term)
            .stream()
            .map(mapper::toDTO)
            .collect(Collectors.toList());

        return ResponseEntity.ok(cards);
    }

    @GetMapping("/types")
    public ResponseEntity<List<String>> getCardTypes(@PathVariable Long applicationId) {
        return ResponseEntity.ok(cardRepository.findDistinctCardTypesByApplicationId(applicationId));
    }

    @PostMapping
    public ResponseEntity<ApplicationCardDTO> createCard(
            @PathVariable Long applicationId,
            @Valid @RequestBody ApplicationCardDTO cardDTO) {

        return applicationRepository.findById(applicationId)
            .map(application -> {
                ApplicationCard card = mapper.toEntity(cardDTO, application);
                ApplicationCard saved = cardRepository.save(card);
                return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toDTO(saved));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{cardId}")
    public ResponseEntity<ApplicationCardDTO> updateCard(
            @PathVariable Long applicationId,
            @PathVariable Long cardId,
            @Valid @RequestBody ApplicationCardDTO cardDTO) {

        return cardRepository.findByIdAndApplicationId(cardId, applicationId)
            .map(existing -> {
                existing.setTitle(cardDTO.getTitle());
                existing.setCardType(cardDTO.getCardType());
                existing.setContent(cardDTO.getContent());
                existing.setMermaidDiagram(cardDTO.getMermaidDiagram());
                existing.setSortOrder(cardDTO.getSortOrder());
                existing.setVisible(cardDTO.getVisible());

                ApplicationCard updated = cardRepository.save(existing);
                return ResponseEntity.ok(mapper.toDTO(updated));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{cardId}")
    public ResponseEntity<Void> deleteCard(
            @PathVariable Long applicationId,
            @PathVariable Long cardId) {

        return cardRepository.findByIdAndApplicationId(cardId, applicationId)
            .map(card -> {
                cardRepository.delete(card);
                return ResponseEntity.noContent().<Void>build();
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAllCards(@PathVariable Long applicationId) {
        if (applicationRepository.existsById(applicationId)) {
            cardRepository.deleteByApplicationId(applicationId);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
