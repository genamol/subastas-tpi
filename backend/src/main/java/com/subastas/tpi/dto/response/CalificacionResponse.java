package com.subastas.tpi.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalificacionResponse {

    private Long id;
    private int puntuacion;
    private String comentario;
    private Instant fechaCreacion;
    private Long subastaId;
    private Long calificadorId;
    private String calificadorNombre;
    private Long calificadoId;
    private String calificadoNombre;
}
