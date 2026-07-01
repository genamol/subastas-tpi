package com.subastas.tpi.dto.response;

import com.subastas.tpi.model.enums.EstadoSubasta;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubastaResponse {

    private Long id;
    private BigDecimal precioBase;
    private BigDecimal montoActual;
    private BigDecimal incrementoMinimo;
    private Instant fechaInicio;
    private Instant fechaCierre;
    private EstadoSubasta estado;
    private String descripcion;
    private Instant fechaAdjudicacion;
    private Long productoId;
    private String productoNombre;
    private String categoriaNombre;
    private List<String> imagenes;
    private int totalPujas;
    private Long vendedorId;
    private String vendedorNombre;
    private Long ganadorId;
    private String ganadorNombre;
    private Double vendedorCalificacionPromedio;
}
