package com.subastas.tpi.service;

import com.subastas.tpi.dto.response.NotificacionResponse;
import com.subastas.tpi.model.Notificacion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;

public interface NotificacionService {

    Page<NotificacionResponse> obtenerMisNotificaciones(Long usuarioId, Pageable pageable);

    void marcarComoLeida(Long notificacionId, Long usuarioId);

    void marcarTodasLeidas(Long usuarioId);

    long contarNoLeidas(Long usuarioId);

    Notificacion notificarVendedorNuevaPuja(Long subastaId, BigDecimal monto);
}
