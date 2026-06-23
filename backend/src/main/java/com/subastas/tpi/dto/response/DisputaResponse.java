package com.subastas.tpi.dto.response;

import com.subastas.tpi.model.enums.TipoConflicto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DisputaResponse {

    private Long id;
    private TipoConflicto tipo;
    private String descripcion;
    private String resolucionAdmin;
    private Instant fechaCreacion;
    private Instant fechaResolucion;
    private Long subastaId;
    private Long iniciadorId;
    private String iniciadorNombre;
}
