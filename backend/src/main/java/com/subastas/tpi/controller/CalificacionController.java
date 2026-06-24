package com.subastas.tpi.controller;

import com.subastas.tpi.dto.request.CalificacionRequest;
import com.subastas.tpi.dto.response.CalificacionResponse;
import com.subastas.tpi.service.CalificacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.subastas.tpi.model.Usuario;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/calificaciones")
@RequiredArgsConstructor
public class CalificacionController {

    private final CalificacionService calificacionService;

    @PostMapping
    public ResponseEntity<CalificacionResponse> calificar(@Valid @RequestBody CalificacionRequest request,
                                                           @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(calificacionService.calificar(usuario.getId(), request));
    }

    @GetMapping("/usuario/{id}")
    public ResponseEntity<Page<CalificacionResponse>> porUsuario(@PathVariable Long id, Pageable pageable) {
        return ResponseEntity.ok(calificacionService.obtenerPorUsuario(id, pageable));
    }
}
