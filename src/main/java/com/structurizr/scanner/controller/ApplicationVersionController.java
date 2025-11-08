package com.structurizr.scanner.controller;

import com.structurizr.scanner.dto.ApplicationVersionDTO;
import com.structurizr.scanner.mapper.ApplicationMapper;
import com.structurizr.scanner.repository.ApplicationVersionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/versions")
@CrossOrigin(origins = "*")
public class ApplicationVersionController {

    @Autowired
    private ApplicationVersionRepository versionRepository;

    @Autowired
    private ApplicationMapper mapper;

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<List<ApplicationVersionDTO>> getVersionsByApplicationId(@PathVariable Long applicationId) {
        List<ApplicationVersionDTO> versions = versionRepository.findByApplicationIdOrderByVersionNumberDesc(applicationId)
            .stream()
            .map(mapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(versions);
    }

    @GetMapping("/application/uuid/{uuid}")
    public ResponseEntity<List<ApplicationVersionDTO>> getVersionsByApplicationUuid(@PathVariable UUID uuid) {
        List<ApplicationVersionDTO> versions = versionRepository.findByApplicationUuidOrderByVersionNumberDesc(uuid)
            .stream()
            .map(mapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(versions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationVersionDTO> getVersionById(@PathVariable Long id) {
        return versionRepository.findById(id)
            .map(mapper::toDTO)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
