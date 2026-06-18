package com.subastas.tpi.controller;

import com.subastas.tpi.service.SseSubscriptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Tag(name = "Admin - Tiempo Real", description = "Canal SSE global para administradores")
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminSseController {

    private final SseSubscriptionService sseService;

    @Operation(summary = "Canal SSE global del admin. Recibe todas las pujas y cambios de estado en tiempo real.")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/subastas/stream")
    public SseEmitter streamAdmin(Authentication auth) {
        Long adminId = (Long) auth.getPrincipal();
        return sseService.suscribirAdmin(adminId);
    }
}
