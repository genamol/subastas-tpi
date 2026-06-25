package com.subastas.tpi.controller;

import com.subastas.tpi.dto.response.NotificacionResponse;
import com.subastas.tpi.model.Usuario;
import com.subastas.tpi.service.NotificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notificaciones")
@RequiredArgsConstructor
public class NotificacionController {

    private final NotificacionService notificacionService;

    @GetMapping
    public ResponseEntity<Page<NotificacionResponse>> misNotificaciones(@AuthenticationPrincipal Usuario usuario,
                                                                         Pageable pageable) {
        return ResponseEntity.ok(notificacionService.obtenerMisNotificaciones(usuario.getId(), pageable));
    }

    @PutMapping("/{id}/leer")
    public ResponseEntity<Void> marcarLeida(@PathVariable Long id,
                                             @AuthenticationPrincipal Usuario usuario) {
        notificacionService.marcarComoLeida(id, usuario.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/no-leidas")
    public ResponseEntity<Long> contarNoLeidas(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(notificacionService.contarNoLeidas(usuario.getId()));
    }

    @PutMapping("/leer-todas")
    public ResponseEntity<Void> marcarTodasLeidas(@AuthenticationPrincipal Usuario usuario) {
        notificacionService.marcarTodasLeidas(usuario.getId());
        return ResponseEntity.noContent().build();
    }
}
