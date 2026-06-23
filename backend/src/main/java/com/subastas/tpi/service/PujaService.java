package com.subastas.tpi.service;

import com.subastas.tpi.dto.request.PujaRequest;
import com.subastas.tpi.dto.response.PujaResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PujaService {

    PujaResponse registrarPuja(PujaRequest request, Long ofertanteId);

    Page<PujaResponse> obtenerMisPujas(Long ofertanteId, Pageable pageable);

    Page<PujaResponse> obtenerPujasPorSubasta(Long subastaId, Long solicitanteId, boolean esAdmin, Pageable pageable);
}
