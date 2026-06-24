package com.subastas.tpi.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalificacionRequest {

    @NotNull
    private Long subastaId;

    @NotNull
    private Long calificadoId;

    @Min(1) @Max(5)
    private int puntuacion;

    private String comentario;
}
