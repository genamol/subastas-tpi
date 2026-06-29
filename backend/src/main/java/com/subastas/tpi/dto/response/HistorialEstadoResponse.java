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
public class HistorialEstadoResponse {
    private Long id;
    private String estadoAnterior;
    private String estadoNuevo;
    private Instant fecha;
    private String motivo;
    private String usuarioResponsableNombre;
}
