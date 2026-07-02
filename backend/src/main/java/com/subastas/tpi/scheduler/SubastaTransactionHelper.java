package com.subastas.tpi.scheduler;

import com.subastas.tpi.event.EstadoCambiadoEvent;
import com.subastas.tpi.event.PagoVencidoEvent;
import com.subastas.tpi.model.HistorialEstado;
import com.subastas.tpi.model.Puja;
import com.subastas.tpi.model.Subasta;
import com.subastas.tpi.model.Usuario;
import com.subastas.tpi.model.enums.EstadoPago;
import com.subastas.tpi.model.enums.EstadoSubasta;
import com.subastas.tpi.repository.HistorialEstadoRepository;
import com.subastas.tpi.repository.PagoRepository;
import com.subastas.tpi.repository.SubastaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

/**
 * Ejecuta cada operación del scheduler en su propia transacción REQUIRES_NEW,
 * de modo que un error en una subasta no revierta los cambios de las demás.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SubastaTransactionHelper {

    private final SubastaRepository subastaRepository;
    private final HistorialEstadoRepository historialEstadoRepository;
    private final PagoRepository pagoRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void activarSubasta(Long subastaId) {
        Subasta subasta = subastaRepository.findById(subastaId).orElseThrow();
        EstadoSubasta anterior = subasta.getEstado();
        subasta.setEstado(EstadoSubasta.ACTIVA);
        subastaRepository.save(subasta);
        registrarHistorial(subasta, anterior, EstadoSubasta.ACTIVA, "Inicio automático por fecha alcanzada", null);
        eventPublisher.publishEvent(new EstadoCambiadoEvent(subastaId, EstadoSubasta.ACTIVA));
        log.info("Subasta {} activada automáticamente", subastaId);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void cerrarSubasta(Long subastaId, Instant ahora) {
        Subasta subasta = subastaRepository.findById(subastaId).orElseThrow();
        boolean tienePujas = subasta.getPujas() != null && !subasta.getPujas().isEmpty();
        EstadoSubasta anterior = subasta.getEstado();
        EstadoSubasta nuevoEstado = tienePujas ? EstadoSubasta.ADJUDICADA : EstadoSubasta.FINALIZADA;

        subasta.setEstado(nuevoEstado);
        if (tienePujas) {
            subasta.setFechaAdjudicacion(ahora);
            Puja pujaMayor = subasta.getPujas().stream()
                    .max(java.util.Comparator.comparing(Puja::getMonto))
                    .orElse(null);
            if (pujaMayor != null) {
                subasta.setGanador(pujaMayor.getOfertante());
            }
        }
        subastaRepository.save(subasta);
        String motivo = tienePujas
                ? "Adjudicada automáticamente al vencer el tiempo"
                : "Finalizada automáticamente sin ofertas";
        registrarHistorial(subasta, anterior, nuevoEstado, motivo, null);
        eventPublisher.publishEvent(new EstadoCambiadoEvent(subastaId, nuevoEstado));
        log.info("Subasta {} cerrada automáticamente como {}", subastaId, nuevoEstado);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void procesarPagoVencido(Long subastaId) {
        Subasta subasta = subastaRepository.findById(subastaId).orElseThrow();
        boolean pagoAprobado = pagoRepository.findBySubastaId(subastaId)
                .map(p -> p.getEstado() == EstadoPago.APROBADO)
                .orElse(false);
        if (!pagoAprobado) {
            pagoRepository.findBySubastaId(subastaId).ifPresent(pagoRepository::delete);
            EstadoSubasta anterior = subasta.getEstado();
            subasta.setGanador(null);
            subasta.setMontoActual(subasta.getPrecioBase());
            subasta.setFechaAdjudicacion(null);
            subasta.setEstado(EstadoSubasta.BORRADOR);
            subastaRepository.save(subasta);
            registrarHistorial(subasta, anterior, EstadoSubasta.BORRADOR,
                    "Pago no realizado en el plazo de 48 horas", null);
            eventPublisher.publishEvent(new PagoVencidoEvent(subastaId));
            log.info("Subasta {} revertida a BORRADOR por pago vencido", subastaId);
        }
    }

    private void registrarHistorial(Subasta subasta, EstadoSubasta anterior, EstadoSubasta nuevo,
                                     String motivo, Usuario responsable) {
        HistorialEstado historial = HistorialEstado.builder()
                .subasta(subasta)
                .estadoAnterior(anterior)
                .estadoNuevo(nuevo)
                .fecha(Instant.now())
                .usuarioResponsable(responsable)
                .motivo(motivo)
                .build();
        historialEstadoRepository.save(historial);
    }
}
