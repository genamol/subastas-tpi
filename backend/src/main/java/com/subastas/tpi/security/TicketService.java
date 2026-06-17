package com.subastas.tpi.security;

import com.subastas.tpi.exception.BusinessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TicketService {

    private static final long TICKET_TTL_SEGUNDOS = 15;

    private final Map<String, TicketInfo> tickets = new ConcurrentHashMap<>();

    public String generarTicket(Long userId) {
        limpiarExpirados();
        String uuid = UUID.randomUUID().toString();
        tickets.put(uuid, new TicketInfo(userId, Instant.now()));
        return uuid;
    }

    public Long validarYConsumir(String ticket) {
        limpiarExpirados();
        TicketInfo info = tickets.remove(ticket);
        if (info == null) {
            throw new BusinessException("ticket.invalido", HttpStatus.UNAUTHORIZED);
        }
        return info.userId();
    }

    public void revocarTickets(Long userId) {
        tickets.values().removeIf(info -> info.userId().equals(userId));
    }

    private void limpiarExpirados() {
        Instant limite = Instant.now().minusSeconds(TICKET_TTL_SEGUNDOS);
        tickets.values().removeIf(info -> info.creadoEn().isBefore(limite));
    }

    private record TicketInfo(Long userId, Instant creadoEn) {}
}
