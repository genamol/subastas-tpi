package com.subastas.tpi.event;

import com.subastas.tpi.dto.response.NotificacionResponse;
import com.subastas.tpi.dto.response.PujaAdminSseDto;
import com.subastas.tpi.model.Notificacion;
import com.subastas.tpi.service.SseSubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
@RequiredArgsConstructor
public class SseEventListener {

    private final SseSubscriptionService sseService;

    @EventListener
    public void onNuevaPuja(NuevaPujaEvent event) {
        sseService.emitirPuja(event.subastaId(), Objects.requireNonNull(event.datos()));

        PujaAdminSseDto adminDto = PujaAdminSseDto.builder()
                .subastaId(event.subastaId())
                .monto(event.datos().getMonto())
                .montoActual(event.datos().getMontoActual())
                .fechaPuja(event.datos().getFechaPuja())
                .ofertanteId(event.ofertanteId())
                .ofertanteNombre(event.ofertanteNombre())
                .build();

        sseService.emitirPujaAdmin(event.subastaId(), Objects.requireNonNull(adminDto));
    }

    @EventListener
    public void onEstadoCambiado(EstadoCambiadoEvent event) {
        sseService.emitirEstado(event.subastaId(), event.estadoNuevo());
        sseService.emitirEstadoAdmin(event.subastaId(), event.estadoNuevo());
    }

    @EventListener
    public void onNotificacionCreada(NotificacionCreadaEvent event) {
        Notificacion n = event.notificacion();

        NotificacionResponse response = NotificacionResponse.builder()
                .id(n.getId())
                .mensaje(n.getMensaje())
                .tipo(n.getTipo())
                .leida(n.isLeida())
                .fechaCreacion(n.getFechaCreacion())
                .subastaId(n.getSubasta() != null ? n.getSubasta().getId() : null)
                .build();

        sseService.emitirNotificacion(n.getDestinatario().getId(), Objects.requireNonNull(response));
    }
}
