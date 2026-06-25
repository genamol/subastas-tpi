package com.subastas.tpi.controller;

import com.subastas.tpi.dto.request.DisputaRequest;
import com.subastas.tpi.dto.request.DisputaResolucionRequest;
import com.subastas.tpi.dto.response.DisputaResponse;
import com.subastas.tpi.model.Usuario;
import com.subastas.tpi.service.DisputaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/disputas")
@RequiredArgsConstructor
public class DisputaController {

    private final DisputaService disputaService;

    @PostMapping
    public ResponseEntity<DisputaResponse> abrir(@Valid @RequestBody DisputaRequest request,
                                                  @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(disputaService.abrir(request, usuario.getId()));
    }

    @PutMapping("/{id}/resolver")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DisputaResponse> resolver(@PathVariable Long id,
                                                     @Valid @RequestBody DisputaResolucionRequest request,
                                                     @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(disputaService.resolver(id, request, usuario.getId()));
    }

    @GetMapping("/subasta/{subastaId}")
    public ResponseEntity<Page<DisputaResponse>> porSubasta(@PathVariable Long subastaId,
                                                             Pageable pageable) {
        return ResponseEntity.ok(disputaService.obtenerPorSubasta(subastaId, pageable));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<DisputaResponse>> listarTodas(Pageable pageable) {
        return ResponseEntity.ok(disputaService.obtenerTodas(pageable));
    }
}
