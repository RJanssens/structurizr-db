package com.structurizr.scanner.controller;

import com.structurizr.scanner.dto.RepositoryDTO;
import com.structurizr.scanner.entity.Repository;
import com.structurizr.scanner.mapper.ApplicationMapper;
import com.structurizr.scanner.repository.RepositoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
@RequestMapping("/api/repositories")
@CrossOrigin(origins = "*")
public class RepositoryController {

    @Autowired
    private RepositoryRepository repositoryRepository;

    @Autowired
    private ApplicationMapper mapper;

    @GetMapping
    public ResponseEntity<List<RepositoryDTO>> getAllRepositories() {
        List<RepositoryDTO> repositories = repositoryRepository.findAll()
            .stream()
            .map(mapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(repositories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RepositoryDTO> getRepositoryById(@PathVariable Long id) {
        return repositoryRepository.findById(id)
            .map(mapper::toDTOWithRelations)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/uuid/{uuid}")
    public ResponseEntity<RepositoryDTO> getRepositoryByUuid(@PathVariable UUID uuid) {
        return repositoryRepository.findByUuid(uuid)
            .map(mapper::toDTOWithRelations)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/url")
    public ResponseEntity<RepositoryDTO> getRepositoryByUrl(@RequestParam String url) {
        return repositoryRepository.findByUrl(url)
            .map(mapper::toDTO)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/gitlab/{gitlabProjectId}")
    public ResponseEntity<RepositoryDTO> getRepositoryByGitlabProjectId(@PathVariable Long gitlabProjectId) {
        return repositoryRepository.findByGitlabProjectId(gitlabProjectId)
            .map(mapper::toDTO)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/namespace/{namespacePath}")
    public ResponseEntity<List<RepositoryDTO>> getRepositoriesByNamespace(@PathVariable String namespacePath) {
        List<RepositoryDTO> repositories = repositoryRepository.findByNamespacePath(namespacePath)
            .stream()
            .map(mapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(repositories);
    }

    @GetMapping("/namespaces")
    public ResponseEntity<List<String>> getAllNamespaces() {
        return ResponseEntity.ok(repositoryRepository.findAllNamespacePaths());
    }

    @GetMapping("/search")
    public ResponseEntity<List<RepositoryDTO>> searchRepositories(@RequestParam String term) {
        List<RepositoryDTO> repositories = repositoryRepository.searchByNameOrDescription(term)
            .stream()
            .map(mapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(repositories);
    }

    @GetMapping("/enabled")
    public ResponseEntity<List<RepositoryDTO>> getEnabledRepositories() {
        List<RepositoryDTO> repositories = repositoryRepository.findByIsEnabledForScanningTrue()
            .stream()
            .map(mapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(repositories);
    }

    @GetMapping("/archived")
    public ResponseEntity<List<RepositoryDTO>> getArchivedRepositories() {
        List<RepositoryDTO> repositories = repositoryRepository.findByIsArchivedTrue()
            .stream()
            .map(mapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(repositories);
    }

    @GetMapping("/active")
    public ResponseEntity<List<RepositoryDTO>> getActiveRepositories() {
        List<RepositoryDTO> repositories = repositoryRepository.findByIsArchivedFalse()
            .stream()
            .map(mapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(repositories);
    }

    @GetMapping("/visibility/{visibility}")
    public ResponseEntity<List<RepositoryDTO>> getRepositoriesByVisibility(@PathVariable String visibility) {
        List<RepositoryDTO> repositories = repositoryRepository.findByVisibility(visibility)
            .stream()
            .map(mapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(repositories);
    }

    @GetMapping("/without-applications")
    public ResponseEntity<List<RepositoryDTO>> getRepositoriesWithoutApplications() {
        List<RepositoryDTO> repositories = repositoryRepository.findRepositoriesWithoutApplications()
            .stream()
            .map(mapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(repositories);
    }

    @GetMapping("/needing-sync")
    public ResponseEntity<List<RepositoryDTO>> getRepositoriesNeedingSync(@RequestParam(defaultValue = "24") int hoursAgo) {
        LocalDateTime olderThan = LocalDateTime.now().minusHours(hoursAgo);
        List<RepositoryDTO> repositories = repositoryRepository.findRepositoriesNeedingSync(olderThan)
            .stream()
            .map(mapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(repositories);
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getRepositoryStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRepositories", repositoryRepository.count());
        stats.put("enabledRepositories", repositoryRepository.findByIsEnabledForScanningTrue().size());
        stats.put("archivedRepositories", repositoryRepository.findByIsArchivedTrue().size());
        stats.put("repositoriesWithoutApplications", repositoryRepository.findRepositoriesWithoutApplications().size());

        List<Object[]> countByNamespace = repositoryRepository.countByNamespace();
        Map<String, Long> namespaceStats = new HashMap<>();
        for (Object[] row : countByNamespace) {
            namespaceStats.put((String) row[0], (Long) row[1]);
        }
        stats.put("repositoriesByNamespace", namespaceStats);

        return ResponseEntity.ok(stats);
    }

    @PostMapping
    public ResponseEntity<RepositoryDTO> createRepository(@RequestBody RepositoryDTO repositoryDTO) {
        Repository repository = mapper.toEntity(repositoryDTO);
        Repository savedRepository = repositoryRepository.save(repository);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toDTO(savedRepository));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RepositoryDTO> updateRepository(@PathVariable Long id, @RequestBody RepositoryDTO repositoryDTO) {
        return repositoryRepository.findById(id)
            .map(existingRepo -> {
                // Update fields
                existingRepo.setName(repositoryDTO.getName());
                existingRepo.setUrl(repositoryDTO.getUrl());
                existingRepo.setNamespacePath(repositoryDTO.getNamespacePath());
                existingRepo.setDescription(repositoryDTO.getDescription());
                existingRepo.setDefaultBranch(repositoryDTO.getDefaultBranch());
                existingRepo.setVisibility(repositoryDTO.getVisibility());
                existingRepo.setWebUrl(repositoryDTO.getWebUrl());
                existingRepo.setSshUrl(repositoryDTO.getSshUrl());
                existingRepo.setHttpUrl(repositoryDTO.getHttpUrl());
                existingRepo.setLastActivityAt(repositoryDTO.getLastActivityAt());
                existingRepo.setGitlabCreatedAt(repositoryDTO.getGitlabCreatedAt());
                existingRepo.setIsArchived(repositoryDTO.getIsArchived());
                existingRepo.setIsEnabledForScanning(repositoryDTO.getIsEnabledForScanning());
                existingRepo.setTopics(repositoryDTO.getTopics());
                existingRepo.setLanguages(repositoryDTO.getLanguages());
                existingRepo.setLastSyncedAt(repositoryDTO.getLastSyncedAt());
                existingRepo.setGitlabProjectId(repositoryDTO.getGitlabProjectId());

                Repository updatedRepo = repositoryRepository.save(existingRepo);
                return ResponseEntity.ok(mapper.toDTO(updatedRepo));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/enable")
    public ResponseEntity<RepositoryDTO> enableRepository(@PathVariable Long id) {
        return repositoryRepository.findById(id)
            .map(repo -> {
                repo.setIsEnabledForScanning(true);
                repo.setScanDisabledReason(null);
                repo.setScanDisabledBy(null);
                repo.setScanDisabledAt(null);
                Repository updatedRepo = repositoryRepository.save(repo);
                return ResponseEntity.ok(mapper.toDTO(updatedRepo));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/disable")
    public ResponseEntity<RepositoryDTO> disableRepository(
            @PathVariable Long id,
            @RequestParam(required = false) String reason,
            @RequestParam(required = false) String disabledBy) {
        return repositoryRepository.findById(id)
            .map(repo -> {
                repo.setIsEnabledForScanning(false);
                repo.setScanDisabledReason(reason != null ? reason : "Marked as out of scope");
                repo.setScanDisabledBy(disabledBy);
                repo.setScanDisabledAt(LocalDateTime.now());
                Repository updatedRepo = repositoryRepository.save(repo);
                return ResponseEntity.ok(mapper.toDTO(updatedRepo));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/disabled")
    public ResponseEntity<List<RepositoryDTO>> getDisabledRepositories() {
        List<RepositoryDTO> repositories = repositoryRepository.findByIsEnabledForScanningFalse()
            .stream()
            .map(mapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(repositories);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRepository(@PathVariable Long id) {
        return repositoryRepository.findById(id)
            .map(repo -> {
                repositoryRepository.delete(repo);
                return ResponseEntity.<Void>noContent().build();
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
