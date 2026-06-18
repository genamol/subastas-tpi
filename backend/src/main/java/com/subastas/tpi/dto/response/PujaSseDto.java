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
public class PujaSseDto {

    private Long subastaId;
    private BigDecimal monto;
    private BigDecimal montoActual;
    private Instant fechaPuja;
    // ofertante queda anónimo para usuarios normales; ADMIN ve todo vía otro canal
}
