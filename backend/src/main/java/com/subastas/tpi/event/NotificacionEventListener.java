package com.subastas.tpi.event;

import com.subastas.tpi.service.NotificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificacionEventListener {

    private final NotificacionService notificacionService;

    @EventListener
    public void onNuevaPuja(NuevaPujaEvent event) {
        notificacionService.notificarVendedorNuevaPuja(event.subastaId());
    }
}
