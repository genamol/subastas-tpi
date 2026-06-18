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
    private BigDecimal montoActual;
    // ofertanteId no se expone al usuario normal (privacidad de pujas)
}
