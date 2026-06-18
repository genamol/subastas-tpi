package com.subastas.tpi.service.impl;

import com.subastas.tpi.model.Puja;
import com.subastas.tpi.model.Subasta;
import com.subastas.tpi.model.Usuario;
import com.subastas.tpi.model.enums.EstadoSubasta;
import com.subastas.tpi.repository.PujaRepository;
import com.subastas.tpi.repository.SubastaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Component
@RequiredArgsConstructor
public class SubastaCierreScheduler {

    private final SubastaRepository subastaRepository;
    private final PujaRepository pujaRepository;
    private final SubastaServiceImpl subastaService;

    @Scheduled(fixedRateString = "${subasta.cierre.intervalo-ms}")
    @Transactional
    public void procesarCierres() {
        Instant ahora = Instant.now();
        activarSubastas(ahora);
        cerrarSubastas(ahora);
    }

    private void activarSubastas(Instant ahora) {
        List<Subasta> paraActivar = subastaRepository
                .findByEstadoAndFechaInicioBefore(EstadoSubasta.PUBLICADA, ahora);

        for (Subasta subasta : paraActivar) {
            subastaService.cambiarEstado(subasta, EstadoSubasta.ACTIVA,
                    subasta.getVendedor(), "Inicio automático");
        }
    }

    private void cerrarSubastas(Instant ahora) {
        List<Subasta> paraCerrar = subastaRepository
                .findByEstadoAndFechaCierreBefore(EstadoSubasta.ACTIVA, ahora);

        for (Subasta subasta : paraCerrar) {
            var pujas = pujaRepository.findBySubastaIdOrderByFechaPujaDesc(
                    subasta.getId(), Pageable.ofSize(1));

            if (pujas.isEmpty()) {
                subastaService.cambiarEstado(subasta, EstadoSubasta.FINALIZADA,
                        null, "Cierre automático sin pujas");
            } else {
                Puja ultimaPuja = pujas.getContent().get(0);
                Usuario ganador = ultimaPuja.getOfertante();
                subasta.setGanador(ganador);
                subasta.setFechaAdjudicacion(ahora);
                subastaService.cambiarEstado(subasta, EstadoSubasta.ADJUDICADA,
                        null, "Cierre automático con puja ganadora");
            }
        }
    }
}
