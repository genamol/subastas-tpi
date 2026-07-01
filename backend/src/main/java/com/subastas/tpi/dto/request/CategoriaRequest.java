package com.subastas.tpi.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoriaRequest {

    @NotBlank(message = "{categoria.nombre.requerido}")
    @Size(max = 100, message = "{categoria.nombre.size}")
    private String nombre;

    private String descripcion;
}

