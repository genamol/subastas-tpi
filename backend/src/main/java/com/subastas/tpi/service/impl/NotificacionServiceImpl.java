package com.subastas.tpi.service.impl;

import com.subastas.tpi.dto.response.NotificacionResponse;
import com.subastas.tpi.exception.BusinessException;
import com.subastas.tpi.model.Notificacion;
import com.subastas.tpi.repository.NotificacionRepository;
import com.subastas.tpi.service.NotificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificacionServiceImpl implements NotificacionService {

    private final NotificacionRepository notificacionRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<NotificacionResponse> obtenerMisNotificaciones(Long usuarioId, Pageable pageable) {
        return notificacionRepository
            .findByDestinatarioIdOrderByFechaCreacionDesc(usuarioId, pageable)
            .map(this::mapToResponse);
    }

    @Override
    @Transactional
    public void marcarComoLeida(Long notificacionId, Long usuarioId) {
        Notificacion notificacion = notificacionRepository.findById(notificacionId)
            .orElseThrow(() -> new BusinessException("notificacion.no.encontrada", HttpStatus.NOT_FOUND));

        if (!notificacion.getDestinatario().getId().equals(usuarioId)) {
            throw new BusinessException("notificacion.no.autorizada", HttpStatus.FORBIDDEN);
        }

        notificacion.setLeida(true);
        notificacionRepository.save(notificacion);
    }

    @Override
    @Transactional(readOnly = true)
    public long contarNoLeidas(Long usuarioId) {
        return notificacionRepository.countByDestinatarioIdAndLeidaFalse(usuarioId);
    }

    private NotificacionResponse mapToResponse(Notificacion notificacion) {
        return NotificacionResponse.builder()
            .id(notificacion.getId())
            .mensaje(notificacion.getMensaje())
            .tipo(notificacion.getTipo())
            .leida(notificacion.isLeida())
            .fechaCreacion(notificacion.getFechaCreacion())
            .subastaId(notificacion.getSubasta() != null ? notificacion.getSubasta().getId() : null)
            .build();
    }
}
