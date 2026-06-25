package com.subastas.tpi.controller;

import com.subastas.tpi.dto.response.TicketResponse;
import com.subastas.tpi.security.TicketService;
import com.subastas.tpi.service.SseSubscriptionService;
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

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminSseController {

    private final SseSubscriptionService sseService;
    private final TicketService ticketService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/tickets")
    public ResponseEntity<TicketResponse> generarTicket(@AuthenticationPrincipal Usuario usuario) {
        String ticket = ticketService.generarTicket(usuario.getId());
        return ResponseEntity.ok(new TicketResponse(ticket));
    }

    @GetMapping("/subastas/stream")
    public SseEmitter streamAdmin(@RequestParam String ticket) {
        Long adminId = ticketService.validarYConsumir(ticket);
        return sseService.suscribirAdmin(adminId);
    }
}
