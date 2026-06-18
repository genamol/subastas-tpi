package com.subastas.tpi.service;

import com.subastas.tpi.dto.request.ProductoRequest;
import com.subastas.tpi.dto.response.ProductoResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductoService {

    ProductoResponse crear(ProductoRequest request, Long vendedorId);

    ProductoResponse actualizar(Long id, ProductoRequest request, Long vendedorId);

    ProductoResponse obtenerPorId(Long id);

    Page<ProductoResponse> obtenerTodos(Pageable pageable);

    Page<ProductoResponse> obtenerPorVendedor(Long vendedorId, Pageable pageable);

    void eliminar(Long id, Long vendedorId);


}