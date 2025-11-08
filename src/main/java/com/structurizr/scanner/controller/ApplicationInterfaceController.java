package com.structurizr.scanner.controller;

import com.structurizr.scanner.dto.ApplicationInterfaceDTO;
import com.structurizr.scanner.mapper.ApplicationMapper;
import com.structurizr.scanner.repository.ApplicationInterfaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/interfaces")
@CrossOrigin(origins = "*")
public class ApplicationInterfaceController {

    @Autowired
    private ApplicationInterfaceRepository interfaceRepository;

    @Autowired
    private ApplicationMapper mapper;

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<List<ApplicationInterfaceDTO>> getByApplicationId(@PathVariable Long applicationId) {
        List<ApplicationInterfaceDTO> interfaces = interfaceRepository.findAllByApplicationId(applicationId)
            .stream()
            .map(mapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(interfaces);
    }

    @GetMapping("/source/{sourceAppId}")
    public ResponseEntity<List<ApplicationInterfaceDTO>> getBySourceApplicationId(@PathVariable Long sourceAppId) {
        List<ApplicationInterfaceDTO> interfaces = interfaceRepository.findBySourceApplicationId(sourceAppId)
            .stream()
            .map(mapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(interfaces);
    }

    @GetMapping("/target/{targetAppId}")
    public ResponseEntity<List<ApplicationInterfaceDTO>> getByTargetApplicationId(@PathVariable Long targetAppId) {
        List<ApplicationInterfaceDTO> interfaces = interfaceRepository.findByTargetApplicationId(targetAppId)
            .stream()
            .map(mapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(interfaces);
    }

    @GetMapping("/protocols")
    public ResponseEntity<List<String>> getAllProtocols() {
        return ResponseEntity.ok(interfaceRepository.findAllProtocols());
    }

    @GetMapping("/protocol/{protocol}")
    public ResponseEntity<List<ApplicationInterfaceDTO>> getByProtocol(@PathVariable String protocol) {
        List<ApplicationInterfaceDTO> interfaces = interfaceRepository.findByProtocol(protocol)
            .stream()
            .map(mapper::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(interfaces);
    }

    @GetMapping("/uuid/{uuid}")
    public ResponseEntity<ApplicationInterfaceDTO> getByUuid(@PathVariable UUID uuid) {
        return interfaceRepository.findByUuid(uuid)
            .map(mapper::toDTO)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
