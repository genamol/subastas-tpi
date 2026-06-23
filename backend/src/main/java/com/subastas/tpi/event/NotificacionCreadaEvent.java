package com.subastas.tpi.event;

import com.subastas.tpi.model.Notificacion;

// Publicado por NotificacionEventListener al persistir una notificacion
public record NotificacionCreadaEvent(Notificacion notificacion) {}
