package com.subastas.tpi.event;

import com.subastas.tpi.service.SseSubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SseEventListener {

    private final SseSubscriptionService sseService;

    @EventListener
    public void onNuevaPuja(NuevaPujaEvent event) {
        sseService.emitirPuja(event.subastaId(), event.datos());
        // Admin recibe los mismos datos pero para el admin , no anonimo 
        // duplicamos el envio al canal admin
        sseService.emitirPujaAdmin(event.subastaId(), event.datos());
    }

    @EventListener
    public void onEstadoCambiado(EstadoCambiadoEvent event) {
        sseService.emitirEstado(event.subastaId(), event.estadoNuevo());
        sseService.emitirEstadoAdmin(event.subastaId(), event.estadoNuevo());
    }
}
