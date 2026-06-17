package com.subastas.tpi.service;

import com.subastas.tpi.dto.request.CategoriaRequest;
import com.subastas.tpi.dto.response.CategoriaResponse;
import org.springframework.lang.NonNull;

import java.util.List;

public interface CategoriaService {

    CategoriaResponse crear(CategoriaRequest request);
    CategoriaResponse actualizar(@NonNull Long id, CategoriaRequest request);
    CategoriaResponse obtenerPorId(@NonNull Long id);

    List<CategoriaResponse> obtenerTodas();
    void eliminar(@NonNull Long id);
}