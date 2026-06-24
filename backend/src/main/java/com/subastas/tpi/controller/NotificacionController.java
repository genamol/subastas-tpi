package com.subastas.tpi.controller;

import com.subastas.tpi.dto.response.NotificacionResponse;
import com.subastas.tpi.model.Notificacion;
import com.subastas.tpi.service.NotificacionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

@Tag(name = "Notificaciones", description = "Gestión de notificaciones del usuario autenticado")
@RestController
@RequestMapping("/api/notificaciones")
@RequiredArgsConstructor
public class NotificacionController {

    private final NotificacionService notificacionService;

    @Operation(summary = "Listar notificaciones del usuario autenticado")
    @GetMapping
    public ResponseEntity<Page<NotificacionResponse>> listar(
            @PageableDefault(size = 20) Pageable pageable,
            Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        Page<Notificacion> page = notificacionService.listarPorUsuario(Objects.requireNonNull(userId), pageable);
        return ResponseEntity.ok(page.map(this::toResponse));
    }

    @Operation(summary = "Marcar una notificación como leída")
    @PutMapping("/{id}/leer")
    public ResponseEntity<Void> marcarLeida(@PathVariable Long id, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        notificacionService.marcarComoLeida(Objects.requireNonNull(id), Objects.requireNonNull(userId));
        return ResponseEntity.noContent().build();
    }

    private NotificacionResponse toResponse(Notificacion n) {
        return NotificacionResponse.builder()
                .id(n.getId())
                .mensaje(n.getMensaje())
                .tipo(n.getTipo())
                .leida(n.isLeida())
                .fechaCreacion(n.getFechaCreacion())
                .destinatarioId(n.getDestinatario().getId())
                .subastaId(n.getSubasta() != null ? n.getSubasta().getId() : null)
                .build();
    }
}
