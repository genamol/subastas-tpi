package com.subastas.tpi.service;

import com.subastas.tpi.model.Notificacion;
import org.springframework.lang.NonNull;

public interface NotificacionService {

    Notificacion notificarVendedorNuevaPuja(@NonNull Long subastaId);
}
