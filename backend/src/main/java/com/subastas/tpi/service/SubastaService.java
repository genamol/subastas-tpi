package com.subastas.tpi.service;

import com.subastas.tpi.dto.request.SubastaRequest;
import com.subastas.tpi.dto.response.SubastaResponse;

public interface SubastaService {

    SubastaResponse crearSubasta(SubastaRequest request, Long vendedorId);
    SubastaResponse publicarSubasta(Long id, Long vendedorId);
    SubastaResponse cancelarSubasta(Long id, Long vendedorId);
    SubastaResponse obtenerPorId(Long id);



}