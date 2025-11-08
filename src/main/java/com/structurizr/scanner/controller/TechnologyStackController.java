package com.structurizr.scanner.controller;

import com.structurizr.scanner.dto.TechnologyStackDTO;
import com.structurizr.scanner.mapper.ApplicationMapper;
import com.structurizr.scanner.repository.TechnologyStackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/technology-stack")
@CrossOrigin(origins = "*")
public class TechnologyStackController {

    @Autowired
    private TechnologyStackRepository technologyStackRepository;

    @Autowired
    private ApplicationMapper mapper;

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<List<TechnologyStackDTO>> getByApplicationId(@PathVariable Long applicationId) {
        List<TechnologyStackDTO> techStack = technologyStackRepository.findByApplicationId(applicationId)
            .stream()
            .map(mapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(techStack);
    }

    @GetMapping("/application/uuid/{uuid}")
    public ResponseEntity<List<TechnologyStackDTO>> getByApplicationUuid(@PathVariable UUID uuid) {
        List<TechnologyStackDTO> techStack = technologyStackRepository.findByApplicationUuid(uuid)
            .stream()
            .map(mapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(techStack);
    }

    @GetMapping("/technologies")
    public ResponseEntity<List<String>> getAllTechnologies() {
        return ResponseEntity.ok(technologyStackRepository.findAllTechnologyNames());
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        return ResponseEntity.ok(technologyStackRepository.findAllCategories());
    }

    @GetMapping("/search")
    public ResponseEntity<List<TechnologyStackDTO>> findByTechnology(
            @RequestParam String name,
            @RequestParam(required = false) String version) {

        List<TechnologyStackDTO> results;
        if (version != null && !version.isEmpty()) {
            results = technologyStackRepository.findApplicationsByTechnology(name, version)
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
        } else {
            results = technologyStackRepository.findByTechnologyName(name)
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
        }

        return ResponseEntity.ok(results);
    }
}
