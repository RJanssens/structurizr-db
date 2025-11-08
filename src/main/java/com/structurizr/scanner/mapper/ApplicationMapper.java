package com.structurizr.scanner.mapper;

import com.structurizr.scanner.dto.*;
import com.structurizr.scanner.entity.*;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class ApplicationMapper {

    public ApplicationDTO toDTO(Application entity) {
        if (entity == null) return null;

        ApplicationDTO dto = new ApplicationDTO();
        dto.setId(entity.getId());
        dto.setUuid(entity.getUuid());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setRepositoryUrl(entity.getRepositoryUrl());
        dto.setDepartment(entity.getDepartment());
        dto.setAuthor(entity.getAuthor());
        dto.setDateCreated(entity.getDateCreated());
        dto.setIsSharedComponent(entity.getIsSharedComponent());
        dto.setCurrentVersion(entity.getCurrentVersion());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setLastScannedAt(entity.getLastScannedAt());

        return dto;
    }

    public ApplicationDTO toDTOWithRelations(Application entity) {
        if (entity == null) return null;

        ApplicationDTO dto = toDTO(entity);

        if (entity.getTechnologyStack() != null) {
            dto.setTechnologyStack(entity.getTechnologyStack().stream()
                .map(this::toDTO)
                .collect(Collectors.toList()));
        }

        if (entity.getOutboundInterfaces() != null) {
            dto.setOutboundInterfaces(entity.getOutboundInterfaces().stream()
                .map(this::toDTO)
                .collect(Collectors.toList()));
        }

        if (entity.getInboundInterfaces() != null) {
            dto.setInboundInterfaces(entity.getInboundInterfaces().stream()
                .map(this::toDTO)
                .collect(Collectors.toList()));
        }

        if (entity.getUsers() != null) {
            dto.setUsers(entity.getUsers().stream()
                .map(this::toDTO)
                .collect(Collectors.toList()));
        }

        if (entity.getMetadata() != null) {
            dto.setMetadata(entity.getMetadata().stream()
                .map(this::toDTO)
                .collect(Collectors.toList()));
        }

        return dto;
    }

    public Application toEntity(ApplicationDTO dto) {
        if (dto == null) return null;

        Application entity = new Application();
        entity.setId(dto.getId());
        entity.setUuid(dto.getUuid());
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setRepositoryUrl(dto.getRepositoryUrl());
        entity.setDepartment(dto.getDepartment());
        entity.setAuthor(dto.getAuthor());
        entity.setDateCreated(dto.getDateCreated());
        entity.setIsSharedComponent(dto.getIsSharedComponent());
        entity.setCurrentVersion(dto.getCurrentVersion());
        entity.setLastScannedAt(dto.getLastScannedAt());

        return entity;
    }

    public TechnologyStackDTO toDTO(TechnologyStack entity) {
        if (entity == null) return null;

        TechnologyStackDTO dto = new TechnologyStackDTO();
        dto.setId(entity.getId());
        dto.setApplicationId(entity.getApplication() != null ? entity.getApplication().getId() : null);
        dto.setName(entity.getName());
        dto.setVersion(entity.getVersion());
        dto.setCategory(entity.getCategory());
        dto.setDescription(entity.getDescription());
        dto.setDetectionSource(entity.getDetectionSource());
        dto.setCreatedAt(entity.getCreatedAt());

        return dto;
    }

    public ApplicationInterfaceDTO toDTO(ApplicationInterface entity) {
        if (entity == null) return null;

        ApplicationInterfaceDTO dto = new ApplicationInterfaceDTO();
        dto.setId(entity.getId());
        dto.setUuid(entity.getUuid());
        dto.setSourceApplicationId(entity.getSourceApplication() != null ? entity.getSourceApplication().getId() : null);
        dto.setSourceApplicationName(entity.getSourceApplication() != null ? entity.getSourceApplication().getName() : null);
        dto.setTargetApplicationId(entity.getTargetApplication() != null ? entity.getTargetApplication().getId() : null);
        dto.setTargetApplicationName(entity.getTargetApplication() != null ? entity.getTargetApplication().getName() : null);
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setProtocol(entity.getProtocol());
        dto.setDestination(entity.getDestination());
        dto.setPort(entity.getPort());
        dto.setDirection(entity.getDirection());
        dto.setAuthenticationMethod(entity.getAuthenticationMethod());
        dto.setDetectionSource(entity.getDetectionSource());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());

        return dto;
    }

    public ApplicationUserDTO toDTO(ApplicationUser entity) {
        if (entity == null) return null;

        ApplicationUserDTO dto = new ApplicationUserDTO();
        dto.setId(entity.getId());
        dto.setApplicationId(entity.getApplication() != null ? entity.getApplication().getId() : null);
        dto.setUserName(entity.getUserName());
        dto.setUserType(entity.getUserType());
        dto.setRole(entity.getRole());
        dto.setDescription(entity.getDescription());
        dto.setCreatedAt(entity.getCreatedAt());

        return dto;
    }

    public ApplicationMetadataDTO toDTO(ApplicationMetadata entity) {
        if (entity == null) return null;

        ApplicationMetadataDTO dto = new ApplicationMetadataDTO();
        dto.setId(entity.getId());
        dto.setApplicationId(entity.getApplication() != null ? entity.getApplication().getId() : null);
        dto.setKey(entity.getKey());
        dto.setValue(entity.getValue());
        dto.setValueType(entity.getValueType());
        dto.setCategory(entity.getCategory());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());

        return dto;
    }

    public ApplicationVersionDTO toDTO(ApplicationVersion entity) {
        if (entity == null) return null;

        ApplicationVersionDTO dto = new ApplicationVersionDTO();
        dto.setId(entity.getId());
        dto.setApplicationId(entity.getApplication() != null ? entity.getApplication().getId() : null);
        dto.setVersionNumber(entity.getVersionNumber());
        dto.setScannedBranch(entity.getScannedBranch());
        dto.setCommitHash(entity.getCommitHash());
        dto.setDescription(entity.getDescription());
        dto.setDepartment(entity.getDepartment());
        dto.setTechnologyStackSnapshot(entity.getTechnologyStackSnapshot());
        dto.setInterfacesSnapshot(entity.getInterfacesSnapshot());
        dto.setScanNotes(entity.getScanNotes());
        dto.setScannedAt(entity.getScannedAt());
        dto.setScannedBy(entity.getScannedBy());

        return dto;
    }
}
