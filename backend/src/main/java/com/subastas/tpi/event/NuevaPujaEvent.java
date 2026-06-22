package com.subastas.tpi.event;

import com.subastas.tpi.dto.response.PujaSseDto;

// Publicado por PujaServiceImpl al confirmar una puja
public record NuevaPujaEvent(Long subastaId, PujaSseDto datos, Long ofertanteId, String ofertanteNombre) {}
