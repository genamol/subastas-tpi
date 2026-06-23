package com.subastas.tpi.controller;

import com.subastas.tpi.dto.response.TicketResponse;
import com.subastas.tpi.security.TicketService;
import com.subastas.tpi.service.SseSubscriptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Tag(name = "Notificaciones - Tiempo Real", description = "Canal SSE para notificaciones push del usuario autenticado")
@RestController
@RequiredArgsConstructor
public class NotificacionSseController {

    private final TicketService ticketService;
    private final SseSubscriptionService sseService;

    @Operation(summary = "Generar ticket efímero para el canal de notificaciones SSE")
    @PostMapping("/api/tickets/notificaciones")
    public ResponseEntity<TicketResponse> generarTicket(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        String ticket = ticketService.generarTicket(userId);
        return ResponseEntity.ok(new TicketResponse(ticket));
    }

    @Operation(summary = "Canal SSE de notificaciones del usuario. Requiere ticket como query param.")
    @GetMapping("/api/notificaciones/stream")
    public SseEmitter stream(@RequestParam String ticket) {
        Long userId = ticketService.validarYConsumir(ticket);
        return sseService.suscribirNotificaciones(userId);
    }
}
