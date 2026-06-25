package com.subastas.tpi.service;

import com.subastas.tpi.dto.request.SubastaRequest;
import com.subastas.tpi.dto.response.SubastaResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SubastaService {

    SubastaResponse crearSubasta(SubastaRequest request, Long vendedorId);
    SubastaResponse publicarSubasta(Long id, Long vendedorId);
    SubastaResponse cancelarSubasta(Long id, Long vendedorId);
    SubastaResponse cancelarSubastaAdmin(Long id, Long adminId);
    SubastaResponse obtenerPorId(Long id);
    Page<SubastaResponse> obtenerTodas(Pageable pageable);
    Page<SubastaResponse> obtenerMisSubastas(Long vendedorId, Pageable pageable);
    void procesarCierresAutomaticos();




}