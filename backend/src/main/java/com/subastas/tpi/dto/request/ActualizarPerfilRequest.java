package com.subastas.tpi.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ActualizarPerfilRequest {

    @NotBlank(message = "{usuario.nombre.requerido}")
    private String nombre;

    @NotBlank(message = "{usuario.telefono.requerido}")
    private String telefono;
}
