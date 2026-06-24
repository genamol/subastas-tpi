package com.subastas.tpi.service;

import com.subastas.tpi.dto.request.CalificacionRequest;
import com.subastas.tpi.dto.response.CalificacionResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CalificacionService {

    CalificacionResponse calificar(Long calificadorId, CalificacionRequest request);

    Page<CalificacionResponse> obtenerPorUsuario(Long usuarioId, Pageable pageable);
}
