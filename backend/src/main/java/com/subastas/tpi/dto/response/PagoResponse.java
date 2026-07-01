package com.subastas.tpi.dto.response;

import com.subastas.tpi.model.enums.EstadoPago;
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
public class PagoResponse {
    private Long id;
    private Long subastaId;
    private BigDecimal monto;
    private EstadoPago estado;
    private String medioPago;
    private String ultimosCuatroDigitos;
    private Instant fechaCreacion;
    private Instant fechaProcesamiento;
}
