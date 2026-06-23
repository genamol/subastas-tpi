package com.subastas.tpi.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DisputaResolucionRequest {

    @NotBlank
    private String resolucion;
}
