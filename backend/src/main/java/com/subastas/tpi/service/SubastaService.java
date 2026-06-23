package com.subastas.tpi.service;

import com.subastas.tpi.dto.request.SubastaRequest;
import com.subastas.tpi.dto.response.SubastaResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.NonNull;

public interface SubastaService {

    SubastaResponse crear(@NonNull Long userId, SubastaRequest request);
    SubastaResponse publicar(@NonNull Long userId, @NonNull Long subastaId);
    SubastaResponse cancelar(@NonNull Long userId, @NonNull Long subastaId, String motivo);
    SubastaResponse obtenerPorId(@NonNull Long subastaId);
    Page<SubastaResponse> obtenerTodas(Pageable pageable);
}
