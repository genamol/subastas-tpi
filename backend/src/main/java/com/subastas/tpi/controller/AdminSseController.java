package com.subastas.tpi.controller;

import com.subastas.tpi.dto.response.TicketResponse;
import com.subastas.tpi.security.TicketService;
import com.subastas.tpi.service.SseSubscriptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import com.subastas.tpi.model.Usuario;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Tag(name = "Admin - Tiempo Real", description = "Canal SSE global para administradores")
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminSseController {

    private final SseSubscriptionService sseService;
    private final TicketService ticketService;

    @Operation(summary = "Generar ticket efímero para el canal SSE del admin")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/tickets")
    public ResponseEntity<TicketResponse> generarTicket(@AuthenticationPrincipal Usuario usuario) {
        String ticket = ticketService.generarTicket(usuario.getId());
        return ResponseEntity.ok(new TicketResponse(ticket));
    }

    @Operation(summary = "Canal SSE global del admin. Requiere ticket como query param.")
    @GetMapping("/subastas/stream")
    public SseEmitter streamAdmin(@RequestParam String ticket) {
        Long adminId = ticketService.validarYConsumir(ticket);
        return sseService.suscribirAdmin(adminId);
    }
}
