package com.subastas.tpi.dto.request;

import com.subastas.tpi.model.enums.EstadoSubasta;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DisputaResolucionRequest {

    @NotBlank
    private String resolucion;

    @NotNull
    private EstadoSubasta estadoFinal;
}
