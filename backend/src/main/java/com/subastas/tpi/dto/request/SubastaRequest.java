package com.subastas.tpi.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
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
public class SubastaRequest {

    @NotNull(message = "El producto a subastar es obligatorio")
    private Long productoId;

    @NotNull(message = "El precio base es obligatorio")
    @DecimalMin(value = "0.01", message = "El precio base debe ser mayor a 0")
    private BigDecimal precioBase;

    @NotNull(message = "El incremento mínimo es obligatorio")
    @DecimalMin(value = "0.01", message = "El incremento mínimo debe ser mayor a 0")
    private BigDecimal incrementoMinimo;

    @NotNull(message = "La fecha de inicio es obligatoria")
    @Future(message = "La fecha de inicio debe ser en el futuro")
    private Instant fechaInicio;

    @NotNull(message = "La fecha de cierre es obligatoria")
    @Future(message = "La fecha de cierre debe ser en el futuro")
    private Instant fechaCierre;

    private String descripcion;
}