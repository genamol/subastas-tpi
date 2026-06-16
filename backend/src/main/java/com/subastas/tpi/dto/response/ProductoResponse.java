package com.subastas.tpi.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductoResponse {

    private Long id;
    private String nombre;
    private String descripcion;
    private Instant createdAt;
    private Long vendedorId;
    private String vendedorNombre;
    private Long categoriaId;
    private String categoriaNombre;
    private List<String> imagenes;
}