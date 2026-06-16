package com.subastas.tpi.service;

import com.subastas.tpi.dto.request.CategoriaRequest;
import com.subastas.tpi.dto.response.CategoriaResponse;

import java.util.List;

public interface CategoriaService {

    CategoriaResponse crear(CategoriaRequest request);
    CategoriaResponse actualizar(Long id, CategoriaRequest request);
    CategoriaResponse obtenerPorId(Long id);

    List<CategoriaResponse> obtenerTodas();
    void eliminar(Long id);
}