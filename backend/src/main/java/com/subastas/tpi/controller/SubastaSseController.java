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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Tag(name = "Tiempo Real", description = "Conexiones SSE para pujas en vivo y tickets de autenticación")
@RestController
@RequiredArgsConstructor
public class SubastaSseController {

    private final TicketService ticketService;
    private final SseSubscriptionService sseService;

    @Operation(summary = "Generar ticket efímero para autenticar la conexión SSE")
    @PostMapping("/api/tickets")
    public ResponseEntity<TicketResponse> generarTicket(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        String ticket = ticketService.generarTicket(userId);
        return ResponseEntity.ok(new TicketResponse(ticket));
    }

    @Operation(summary = "Canal SSE por subasta. Requiere ticket como query param.")
    @GetMapping("/api/subastas/{id}/stream")
    public SseEmitter stream(@PathVariable Long id,
                             @RequestParam String ticket,
                             Authentication auth) {
        Long userId = ticketService.validarYConsumir(ticket);
        return sseService.suscribir(id, userId);
    }
}
