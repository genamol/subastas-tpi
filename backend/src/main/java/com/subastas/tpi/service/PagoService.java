package com.subastas.tpi.service;

import com.subastas.tpi.dto.request.PagoRequest;
import com.subastas.tpi.dto.response.PagoResponse;

public interface PagoService {
    PagoResponse procesarPago(Long subastaId, PagoRequest request, Long compradorId);
    PagoResponse obtenerPorSubasta(Long subastaId);
}
