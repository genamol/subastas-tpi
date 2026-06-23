package com.subastas.tpi.scheduler;

import com.subastas.tpi.service.SubastaService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SubastaCierreScheduler {

    private final SubastaService subastaService;

    @Scheduled(fixedDelay = 30000)
    public void procesarCierres() {
        subastaService.procesarCierresAutomaticos();
    }
}