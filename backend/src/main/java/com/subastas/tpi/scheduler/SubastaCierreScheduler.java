package com.subastas.tpi.scheduler;

import com.subastas.tpi.service.SubastaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class SubastaCierreScheduler {

    private final SubastaService subastaService;

    @Scheduled(fixedDelay = 30000)
    public void procesarCierres() {
        try {
            subastaService.procesarCierresAutomaticos();
        } catch (Exception e) {
            log.error("Error en procesarCierresAutomaticos: {}", e.getMessage(), e);
        }
    }
}