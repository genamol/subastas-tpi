package com.subastas.tpi.event;

import com.subastas.tpi.model.Notificacion;
import com.subastas.tpi.service.NotificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
@RequiredArgsConstructor
public class NotificacionEventListener {

    private final NotificacionService notificacionService;
    private final ApplicationEventPublisher eventPublisher;

    @EventListener
    public void onNuevaPuja(NuevaPujaEvent event) {
        Notificacion notificacion = notificacionService.notificarVendedorNuevaPuja(
                Objects.requireNonNull(event.subastaId()), event.datos().getMonto());
        eventPublisher.publishEvent(new NotificacionCreadaEvent(notificacion));
    }

    @EventListener
    public void onPagoVencido(PagoVencidoEvent event) {
        Notificacion notificacion = notificacionService.notificarVendedorPagoVencido(event.subastaId());
        eventPublisher.publishEvent(new NotificacionCreadaEvent(notificacion));
    }
}
