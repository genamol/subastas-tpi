package com.subastas.tpi.event;

import com.subastas.tpi.dto.response.PujaAdminSseDto;
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

        PujaAdminSseDto adminDto = PujaAdminSseDto.builder()
                .subastaId(event.subastaId())
                .monto(event.datos().getMonto())
                .montoActual(event.datos().getMontoActual())
                .fechaPuja(event.datos().getFechaPuja())
                .ofertanteId(event.ofertanteId())
                .ofertanteNombre(event.ofertanteNombre())
                .build();

        sseService.emitirPujaAdmin(event.subastaId(), adminDto);
    }

    @EventListener
    public void onEstadoCambiado(EstadoCambiadoEvent event) {
        sseService.emitirEstado(event.subastaId(), event.estadoNuevo());
        sseService.emitirEstadoAdmin(event.subastaId(), event.estadoNuevo());
    }
}
