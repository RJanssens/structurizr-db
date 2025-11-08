package com.structurizr.scanner.controller;

import com.structurizr.scanner.dto.RepositoryScanDTO;
import com.structurizr.scanner.entity.Repository;
import com.structurizr.scanner.entity.RepositoryScan;
import com.structurizr.scanner.mapper.ApplicationMapper;
import com.structurizr.scanner.repository.RepositoryRepository;
import com.structurizr.scanner.repository.RepositoryScanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/repository-scans")
@CrossOrigin(origins = "*")
public class RepositoryScanController {

    @Autowired
    private RepositoryScanRepository scanRepository;

    @Autowired
    private RepositoryRepository repositoryRepository;

    @Autowired
    private ApplicationMapper mapper;

    @GetMapping
    public ResponseEntity<List<RepositoryScanDTO>> getAllScans() {
        List<RepositoryScanDTO> scans = scanRepository.findAll()
            .stream()
            .map(mapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(scans);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RepositoryScanDTO> getScanById(@PathVariable Long id) {
        return scanRepository.findById(id)
            .map(mapper::toDTO)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/uuid/{uuid}")
    public ResponseEntity<RepositoryScanDTO> getScanByUuid(@PathVariable UUID uuid) {
        return scanRepository.findByUuid(uuid)
            .map(mapper::toDTO)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/repository/{repositoryId}")
    public ResponseEntity<List<RepositoryScanDTO>> getScansByRepository(@PathVariable Long repositoryId) {
        List<RepositoryScanDTO> scans = scanRepository.findByRepositoryIdOrderByScanStartedAtDesc(repositoryId)
            .stream()
            .map(mapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(scans);
    }

    @GetMapping("/repository/{repositoryId}/latest")
    public ResponseEntity<RepositoryScanDTO> getLatestScanByRepository(@PathVariable Long repositoryId) {
        return scanRepository.findMostRecentScanByRepositoryId(repositoryId)
            .map(mapper::toDTO)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/repository/{repositoryId}/latest-completed")
    public ResponseEntity<RepositoryScanDTO> getLatestCompletedScanByRepository(@PathVariable Long repositoryId) {
        return scanRepository.findMostRecentCompletedScanByRepositoryId(repositoryId)
            .map(mapper::toDTO)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<RepositoryScanDTO>> getScansByStatus(@PathVariable String status) {
        List<RepositoryScanDTO> scans = scanRepository.findByScanStatusOrderByScanStartedAtDesc(status)
            .stream()
            .map(mapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(scans);
    }

    @GetMapping("/failed")
    public ResponseEntity<List<RepositoryScanDTO>> getFailedScans() {
        List<RepositoryScanDTO> scans = scanRepository.findFailedScans()
            .stream()
            .map(mapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(scans);
    }

    @GetMapping("/in-progress")
    public ResponseEntity<List<RepositoryScanDTO>> getInProgressScans() {
        List<RepositoryScanDTO> scans = scanRepository.findInProgressScans()
            .stream()
            .map(mapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(scans);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<RepositoryScanDTO>> getPendingScans() {
        List<RepositoryScanDTO> scans = scanRepository.findPendingScans()
            .stream()
            .map(mapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(scans);
    }

    @GetMapping("/type/{scanType}")
    public ResponseEntity<List<RepositoryScanDTO>> getScansByType(@PathVariable String scanType) {
        List<RepositoryScanDTO> scans = scanRepository.findByScanTypeOrderByScanStartedAtDesc(scanType)
            .stream()
            .map(mapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(scans);
    }

    @GetMapping("/initiated-by/{initiatedBy}")
    public ResponseEntity<List<RepositoryScanDTO>> getScansByInitiatedBy(@PathVariable String initiatedBy) {
        List<RepositoryScanDTO> scans = scanRepository.findByInitiatedByOrderByScanStartedAtDesc(initiatedBy)
            .stream()
            .map(mapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(scans);
    }

    @GetMapping("/branch/{branch}")
    public ResponseEntity<List<RepositoryScanDTO>> getScansByBranch(@PathVariable String branch) {
        List<RepositoryScanDTO> scans = scanRepository.findByScannedBranchOrderByScanStartedAtDesc(branch)
            .stream()
            .map(mapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(scans);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<RepositoryScanDTO>> getScansByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<RepositoryScanDTO> scans = scanRepository.findScansBetweenDates(startDate, endDate)
            .stream()
            .map(mapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(scans);
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getScanStatistics() {
        Map<String, Object> stats = new HashMap<>();

        // Total counts
        stats.put("totalScans", scanRepository.count());

        // Count by status
        List<Object[]> countByStatus = scanRepository.countByStatus();
        Map<String, Long> statusStats = new HashMap<>();
        for (Object[] row : countByStatus) {
            statusStats.put((String) row[0], (Long) row[1]);
        }
        stats.put("scansByStatus", statusStats);

        // Count by repository
        List<Object[]> countByRepo = scanRepository.countByRepository();
        List<Map<String, Object>> repoStats = countByRepo.stream()
            .map(row -> {
                Map<String, Object> repoStat = new HashMap<>();
                repoStat.put("repositoryId", row[0]);
                repoStat.put("repositoryName", row[1]);
                repoStat.put("scanCount", row[2]);
                return repoStat;
            })
            .collect(Collectors.toList());
        stats.put("scansByRepository", repoStats);

        // Average scan duration
        Double avgDuration = scanRepository.getAverageScanDuration();
        stats.put("averageScanDurationSeconds", avgDuration);

        // Total applications, technologies, and interfaces found
        Object[] completedStats = scanRepository.getCompletedScanStatistics();
        if (completedStats != null) {
            stats.put("completedScansCount", completedStats[0]);
            stats.put("totalApplicationsFound", completedStats[1]);
            stats.put("totalTechnologiesFound", completedStats[2]);
            stats.put("totalInterfacesFound", completedStats[3]);
            stats.put("avgDurationCompletedScans", completedStats[4]);
        }

        return ResponseEntity.ok(stats);
    }

    @PostMapping
    public ResponseEntity<RepositoryScanDTO> createScan(@RequestBody RepositoryScanDTO scanDTO) {
        RepositoryScan scan = mapper.toEntity(scanDTO);

        // Set the repository if repositoryId is provided
        if (scanDTO.getRepositoryId() != null) {
            Repository repository = repositoryRepository.findById(scanDTO.getRepositoryId())
                .orElseThrow(() -> new RuntimeException("Repository not found with id: " + scanDTO.getRepositoryId()));
            scan.setRepository(repository);
        }

        RepositoryScan savedScan = scanRepository.save(scan);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toDTO(savedScan));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RepositoryScanDTO> updateScan(@PathVariable Long id, @RequestBody RepositoryScanDTO scanDTO) {
        return scanRepository.findById(id)
            .map(existingScan -> {
                // Update fields
                existingScan.setScannedBranch(scanDTO.getScannedBranch());
                existingScan.setCommitHash(scanDTO.getCommitHash());
                existingScan.setScanStatus(scanDTO.getScanStatus());
                existingScan.setScanCompletedAt(scanDTO.getScanCompletedAt());
                existingScan.setScanDurationSeconds(scanDTO.getScanDurationSeconds());
                existingScan.setApplicationsFound(scanDTO.getApplicationsFound());
                existingScan.setTechnologiesFound(scanDTO.getTechnologiesFound());
                existingScan.setInterfacesFound(scanDTO.getInterfacesFound());
                existingScan.setScanType(scanDTO.getScanType());
                existingScan.setInitiatedBy(scanDTO.getInitiatedBy());
                existingScan.setScanNotes(scanDTO.getScanNotes());
                existingScan.setErrorMessage(scanDTO.getErrorMessage());
                existingScan.setErrorDetails(scanDTO.getErrorDetails());
                existingScan.setScanConfiguration(scanDTO.getScanConfiguration());

                RepositoryScan updatedScan = scanRepository.save(existingScan);
                return ResponseEntity.ok(mapper.toDTO(updatedScan));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<RepositoryScanDTO> completeScan(@PathVariable Long id, @RequestBody(required = false) Map<String, Object> updates) {
        return scanRepository.findById(id)
            .map(scan -> {
                scan.markAsCompleted();

                // Apply optional updates
                if (updates != null) {
                    if (updates.containsKey("applicationsFound")) {
                        scan.setApplicationsFound((Integer) updates.get("applicationsFound"));
                    }
                    if (updates.containsKey("technologiesFound")) {
                        scan.setTechnologiesFound((Integer) updates.get("technologiesFound"));
                    }
                    if (updates.containsKey("interfacesFound")) {
                        scan.setInterfacesFound((Integer) updates.get("interfacesFound"));
                    }
                    if (updates.containsKey("scanNotes")) {
                        scan.setScanNotes((String) updates.get("scanNotes"));
                    }
                }

                RepositoryScan updatedScan = scanRepository.save(scan);
                return ResponseEntity.ok(mapper.toDTO(updatedScan));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/fail")
    public ResponseEntity<RepositoryScanDTO> failScan(@PathVariable Long id, @RequestBody Map<String, String> errorInfo) {
        return scanRepository.findById(id)
            .map(scan -> {
                String errorMessage = errorInfo.getOrDefault("errorMessage", "Scan failed");
                String errorDetails = errorInfo.getOrDefault("errorDetails", "");
                scan.markAsFailed(errorMessage, errorDetails);

                RepositoryScan updatedScan = scanRepository.save(scan);
                return ResponseEntity.ok(mapper.toDTO(updatedScan));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<RepositoryScanDTO> updateScanStatus(@PathVariable Long id, @RequestParam String status) {
        return scanRepository.findById(id)
            .map(scan -> {
                scan.setScanStatus(status);
                if ("IN_PROGRESS".equals(status) && scan.getScanStartedAt() == null) {
                    scan.setScanStartedAt(LocalDateTime.now());
                }
                RepositoryScan updatedScan = scanRepository.save(scan);
                return ResponseEntity.ok(mapper.toDTO(updatedScan));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScan(@PathVariable Long id) {
        return scanRepository.findById(id)
            .map(scan -> {
                scanRepository.delete(scan);
                return ResponseEntity.<Void>noContent().build();
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/older-than")
    public ResponseEntity<Map<String, Object>> deleteScansOlderThan(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date) {
        List<RepositoryScan> oldScans = scanRepository.findScansOlderThan(date);
        int count = oldScans.size();
        scanRepository.deleteAll(oldScans);

        Map<String, Object> response = new HashMap<>();
        response.put("deleted", count);
        response.put("olderThan", date);

        return ResponseEntity.ok(response);
    }
}
