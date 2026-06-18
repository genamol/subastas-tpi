package com.subastas.tpi.service;

import com.subastas.tpi.dto.request.SubastaRequest;
import com.subastas.tpi.dto.response.SubastaResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SubastaService {

    SubastaResponse crear(Long userId, SubastaRequest request);
    SubastaResponse publicar(Long userId, Long subastaId);
    SubastaResponse cancelar(Long userId, Long subastaId, String motivo);
    SubastaResponse obtenerPorId(Long subastaId);
    Page<SubastaResponse> obtenerTodas(Pageable pageable);
}
