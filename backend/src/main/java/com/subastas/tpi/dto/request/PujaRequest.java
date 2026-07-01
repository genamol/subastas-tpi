package com.subastas.tpi.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PujaRequest {

    @NotNull(message = "{puja.subastaId.requerido}")
    private Long subastaId;

    @NotNull(message = "{puja.monto.requerido}")
    @DecimalMin(value = "0.01", message = "{puja.monto.minimo}")
    private BigDecimal monto;
}
