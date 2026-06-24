package com.subastas.tpi.service;

import com.subastas.tpi.dto.request.DisputaRequest;
import com.subastas.tpi.dto.request.DisputaResolucionRequest;
import com.subastas.tpi.dto.response.DisputaResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface DisputaService {

    DisputaResponse abrir(DisputaRequest request, Long iniciadorId);

    DisputaResponse resolver(Long disputaId, DisputaResolucionRequest request, Long adminId);

    Page<DisputaResponse> obtenerPorSubasta(Long subastaId, Pageable pageable);
}
