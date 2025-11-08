package com.structurizr.scanner.controller;

import com.structurizr.scanner.dto.ApplicationDTO;
import com.structurizr.scanner.entity.Application;
import com.structurizr.scanner.mapper.ApplicationMapper;
import com.structurizr.scanner.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private ApplicationMapper mapper;

    @GetMapping
    public ResponseEntity<List<ApplicationDTO>> getAllApplications() {
        List<ApplicationDTO> applications = applicationRepository.findAll()
            .stream()
            .map(mapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationDTO> getApplicationById(@PathVariable Long id) {
        return applicationRepository.findById(id)
            .map(mapper::toDTOWithRelations)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/uuid/{uuid}")
    public ResponseEntity<ApplicationDTO> getApplicationByUuid(@PathVariable UUID uuid) {
        return applicationRepository.findByUuid(uuid)
            .map(mapper::toDTOWithRelations)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<ApplicationDTO>> searchApplications(@RequestParam String term) {
        List<ApplicationDTO> applications = applicationRepository.searchByNameOrDescription(term)
            .stream()
            .map(mapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/department/{department}")
    public ResponseEntity<List<ApplicationDTO>> getApplicationsByDepartment(@PathVariable String department) {
        List<ApplicationDTO> applications = applicationRepository.findByDepartment(department)
            .stream()
            .map(mapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/departments")
    public ResponseEntity<List<String>> getAllDepartments() {
        return ResponseEntity.ok(applicationRepository.findAllDepartments());
    }

    @GetMapping("/shared-components")
    public ResponseEntity<List<ApplicationDTO>> getSharedComponents() {
        List<ApplicationDTO> applications = applicationRepository.findByIsSharedComponent(true)
            .stream()
            .map(mapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(applications);
    }

    @PostMapping
    public ResponseEntity<ApplicationDTO> createApplication(@RequestBody ApplicationDTO applicationDTO) {
        Application application = mapper.toEntity(applicationDTO);
        Application saved = applicationRepository.save(application);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper::toDTO).apply(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApplicationDTO> updateApplication(
            @PathVariable Long id,
            @RequestBody ApplicationDTO applicationDTO) {

        return applicationRepository.findById(id)
            .map(existing -> {
                existing.setName(applicationDTO.getName());
                existing.setDescription(applicationDTO.getDescription());
                existing.setRepositoryUrl(applicationDTO.getRepositoryUrl());
                existing.setDepartment(applicationDTO.getDepartment());
                existing.setAuthor(applicationDTO.getAuthor());
                existing.setDateCreated(applicationDTO.getDateCreated());
                existing.setIsSharedComponent(applicationDTO.getIsSharedComponent());
                existing.setLastScannedAt(applicationDTO.getLastScannedAt());

                Application updated = applicationRepository.save(existing);
                return ResponseEntity.ok(mapper.toDTO(updated));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {
        if (applicationRepository.existsById(id)) {
            applicationRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/statistics")
    public ResponseEntity<ApplicationStatistics> getStatistics() {
        long totalApps = applicationRepository.count();
        long sharedComponents = applicationRepository.findByIsSharedComponent(true).size();
        List<String> departments = applicationRepository.findAllDepartments();

        ApplicationStatistics stats = new ApplicationStatistics(
            totalApps,
            sharedComponents,
            departments.size()
        );

        return ResponseEntity.ok(stats);
    }

    // Inner class for statistics response
    public static record ApplicationStatistics(
        long totalApplications,
        long sharedComponents,
        long departments
    ) {}
}
