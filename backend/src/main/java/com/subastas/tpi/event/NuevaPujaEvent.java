package com.subastas.tpi.event;

import com.subastas.tpi.dto.response.PujaSseDto;
import org.springframework.lang.NonNull;

// Publicado por PujaServiceImpl al confirmar una puja
public record NuevaPujaEvent(Long subastaId, @NonNull PujaSseDto datos) {}
