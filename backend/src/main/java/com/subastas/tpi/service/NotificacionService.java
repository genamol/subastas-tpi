package com.subastas.tpi.service;

import com.subastas.tpi.model.Notificacion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.NonNull;

public interface NotificacionService {

    Notificacion notificarVendedorNuevaPuja(@NonNull Long subastaId);

    Page<Notificacion> listarPorUsuario(@NonNull Long userId, Pageable pageable);

    void marcarComoLeida(@NonNull Long notificacionId, @NonNull Long userId);
}
