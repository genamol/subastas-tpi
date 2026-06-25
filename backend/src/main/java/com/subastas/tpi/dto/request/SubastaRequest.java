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

    @NotNull(message = "{subasta.productoId.requerido}")
    private Long productoId;

    @NotNull(message = "{subasta.precioBase.requerido}")
    @DecimalMin(value = "0.01", message = "{subasta.precioBase.minimo}")
    private BigDecimal precioBase;

    @NotNull(message = "{subasta.incrementoMinimo.requerido}")
    @DecimalMin(value = "0.01", message = "{subasta.incrementoMinimo.minimo}")
    private BigDecimal incrementoMinimo;

    @NotNull(message = "{subasta.fechaInicio.requerida}")
    @Future(message = "{subasta.fechaInicio.futuro}")
    private Instant fechaInicio;

    @NotNull(message = "{subasta.fechaCierre.requerida}")
    @Future(message = "{subasta.fechaCierre.futuro}")
    private Instant fechaCierre;

    private String descripcion;
}
