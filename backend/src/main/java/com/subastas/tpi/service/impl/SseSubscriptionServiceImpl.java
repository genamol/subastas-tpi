package com.subastas.tpi.service.impl;

import com.subastas.tpi.dto.response.NotificacionResponse;
import com.subastas.tpi.dto.response.PujaAdminSseDto;
import com.subastas.tpi.dto.response.PujaSseDto;
import com.subastas.tpi.model.enums.EstadoSubasta;
import com.subastas.tpi.service.SseSubscriptionService;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class SseSubscriptionServiceImpl implements SseSubscriptionService {

    // Canal usuario normal: un emisor por subasta
    private final Map<Long, List<SseEmitter>> emisores = new ConcurrentHashMap<>();

    // Canal admin: emisores globales sin atar a una subasta
    private final List<SseEmitter> emisoresAdmin = new CopyOnWriteArrayList<>();

    @Override
    public SseEmitter suscribir(Long subastaId, Long userId) {
        SseEmitter emitter = new SseEmitter(600_000L); // 10 minutos máximo
        emisores.computeIfAbsent(subastaId, k -> new CopyOnWriteArrayList<>()).add(emitter);

        emitter.onCompletion(() -> remover(subastaId, emitter));
        emitter.onTimeout(() -> remover(subastaId, emitter));
        emitter.onError(e -> remover(subastaId, emitter));

        // Envía un evento de conexión para confirmar al cliente
        try {
            emitter.send(SseEmitter.event()
                    .name("conectado")
                    .data("{\"subastaId\":" + subastaId + "}"));
        } catch (IOException e) {
            remover(subastaId, emitter);
        }

        return emitter;
    }

    @Override
    public void emitirPuja(Long subastaId, @NonNull PujaSseDto datos) {
        List<SseEmitter> lista = emisores.get(subastaId);
        if (lista == null) return;

        for (SseEmitter emisor : lista) {
            try {
                emisor.send(SseEmitter.event()
                        .name("nueva-puja")
                        .data(datos));
            } catch (IOException e) {
                remover(subastaId, emisor);
            }
        }
    }

    @Override
    public void emitirEstado(Long subastaId, EstadoSubasta estadoNuevo) {
        List<SseEmitter> lista = emisores.get(subastaId);
        if (lista == null) return;

        for (SseEmitter emisor : lista) {
            try {
                emisor.send(SseEmitter.event()
                        .name("cambio-estado")
                        .data("{\"estado\":\"" + estadoNuevo.name() + "\"}"));
            } catch (IOException e) {
                remover(subastaId, emisor);
            }
        }
    }

    @Override
    public SseEmitter suscribirAdmin(Long adminId) {
        SseEmitter emitter = new SseEmitter(600_000L);
        emisoresAdmin.add(emitter);

        emitter.onCompletion(() -> emisoresAdmin.remove(emitter));
        emitter.onTimeout(() -> emisoresAdmin.remove(emitter));
        emitter.onError(e -> emisoresAdmin.remove(emitter));

        try {
            emitter.send(SseEmitter.event()
                    .name("conectado-admin")
                    .data("{\"mensaje\":\"Canal admin activo\"}"));
        } catch (IOException e) {
            emisoresAdmin.remove(emitter);
        }

        return emitter;
    }

    @Override
    public void emitirPujaAdmin(Long subastaId, @NonNull PujaAdminSseDto datosCompletos) {
        for (SseEmitter emisor : emisoresAdmin) {
            try {
                emisor.send(SseEmitter.event()
                        .name("nueva-puja-admin")
                        .data(datosCompletos));
            } catch (IOException e) {
                emisoresAdmin.remove(emisor);
            }
        }
    }

    @Override
    public void emitirEstadoAdmin(Long subastaId, EstadoSubasta estadoNuevo) {
        for (SseEmitter emisor : emisoresAdmin) {
            try {
                emisor.send(SseEmitter.event()
                        .name("cambio-estado-admin")
                        .data("{\"subastaId\":" + subastaId
                                + ",\"estado\":\"" + estadoNuevo.name() + "\"}"));
            } catch (IOException e) {
                emisoresAdmin.remove(emisor);
            }
        }
    }

    @Override
    public void removerPorUsuario(Long userId) {
        // Cuando un admin bloquea a un usuario, se cierran sus conexiones
        emisores.values().forEach(lista -> lista.forEach(emisor -> {
            try {
                emisor.completeWithError(new SecurityException("Usuario bloqueado"));
            } catch (Exception ignored) {
                // El emisor ya estaba cerrado
            }
        }));
        removerNotificacionesPorUsuario(userId);
    }

    // Canal de notificaciones push por usuario
    private final Map<Long, List<SseEmitter>> emisoresNotificaciones = new ConcurrentHashMap<>();

    @Override
    public SseEmitter suscribirNotificaciones(Long userId) {
        SseEmitter emitter = new SseEmitter(600_000L);
        emisoresNotificaciones.computeIfAbsent(userId, k -> new CopyOnWriteArrayList<>()).add(emitter);

        emitter.onCompletion(() -> removerNotificacion(userId, emitter));
        emitter.onTimeout(() -> removerNotificacion(userId, emitter));
        emitter.onError(e -> removerNotificacion(userId, emitter));

        try {
            emitter.send(SseEmitter.event()
                    .name("conectado-notificaciones")
                    .data("{\"userId\":" + userId + "}"));
        } catch (IOException e) {
            removerNotificacion(userId, emitter);
        }

        return emitter;
    }

    @Override
    public void emitirNotificacion(Long userId, @NonNull NotificacionResponse notificacion) {
        List<SseEmitter> lista = emisoresNotificaciones.get(userId);
        if (lista == null) return;

        for (SseEmitter emisor : lista) {
            try {
                emisor.send(SseEmitter.event()
                        .name("notificacion-nueva")
                        .data(notificacion));
            } catch (IOException e) {
                removerNotificacion(userId, emisor);
            }
        }
    }

    @Override
    public void removerNotificacionesPorUsuario(Long userId) {
        List<SseEmitter> lista = emisoresNotificaciones.remove(userId);
        if (lista == null) return;

        for (SseEmitter emisor : lista) {
            try {
                emisor.completeWithError(new SecurityException("Usuario bloqueado"));
            } catch (Exception ignored) {
                // El emisor ya estaba cerrado
            }
        }
    }

    private void removerNotificacion(Long userId, SseEmitter emitter) {
        List<SseEmitter> lista = emisoresNotificaciones.get(userId);
        if (lista != null) {
            lista.remove(emitter);
        }
    }

    private void remover(Long subastaId, SseEmitter emitter) {
        List<SseEmitter> lista = emisores.get(subastaId);
        if (lista != null) {
            lista.remove(emitter);
        }
    }
}
