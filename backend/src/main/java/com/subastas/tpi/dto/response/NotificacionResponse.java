package com.subastas.tpi.dto.response;

import com.subastas.tpi.model.enums.TipoNotificacion;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificacionResponse {

    private Long id;
    private String mensaje;
    private TipoNotificacion tipo;
    private boolean leida;
    private Instant fechaCreacion;
    private Long subastaId;
}
