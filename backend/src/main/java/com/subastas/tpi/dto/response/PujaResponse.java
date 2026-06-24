package com.subastas.tpi.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PujaResponse {

    private Long id;
    private BigDecimal monto;
    private Instant fechaPuja;
    private Long subastaId;
    // ofertante solo visible para el propio usuario, vendedor (post-cierre) y ADMIN
    private Long ofertanteId;
    private String ofertanteNombre;
}
