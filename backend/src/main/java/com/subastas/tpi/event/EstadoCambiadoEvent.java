package com.subastas.tpi.event;

import com.subastas.tpi.model.enums.EstadoSubasta;

// Publicado por SubastaServiceImpl al cambiar el estado de una subasta
public record EstadoCambiadoEvent(Long subastaId, EstadoSubasta estadoNuevo) {}
