package com.subastas.tpi.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductoRequest {

    @NotBlank(message = "{producto.nombre.requerido}")
    private String nombre;

    private String descripcion;

    @NotNull(message = "{producto.categoria.requerida}")
    private Long categoriaId;

    @Size(max = 5, message = "{producto.imagenes.maximo}")
    private List<String> imagenes;
}