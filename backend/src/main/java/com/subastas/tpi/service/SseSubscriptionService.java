package com.subastas.tpi.service;

import com.subastas.tpi.dto.response.PujaSseDto;
import com.subastas.tpi.model.enums.EstadoSubasta;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public interface SseSubscriptionService {

    // Canal usuario normal: una subasta especiífica, datos anónimos
    SseEmitter suscribir(Long subastaId, Long userId);
    void emitirPuja(Long subastaId, PujaSseDto datos);
    void emitirEstado(Long subastaId, EstadoSubasta estadoNuevo);

    // Canal admin: global, todas las subastas, datos completos
    SseEmitter suscribirAdmin(Long adminId);
    void emitirPujaAdmin(Long subastaId, PujaSseDto datosCompletos);
    void emitirEstadoAdmin(Long subastaId, EstadoSubasta estadoNuevo);

    void removerPorUsuario(Long userId);
}
