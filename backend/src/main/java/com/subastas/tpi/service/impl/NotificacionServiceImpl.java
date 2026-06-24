package com.subastas.tpi.service.impl;

import com.subastas.tpi.exception.BusinessException;
import com.subastas.tpi.model.Notificacion;
import com.subastas.tpi.model.Subasta;
import com.subastas.tpi.model.enums.TipoNotificacion;
import com.subastas.tpi.repository.NotificacionRepository;
import com.subastas.tpi.repository.SubastaRepository;
import com.subastas.tpi.service.NotificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificacionServiceImpl implements NotificacionService {

    private final NotificacionRepository notificacionRepository;
    private final SubastaRepository subastaRepository;

    @Override
    @Transactional
    public Notificacion notificarVendedorNuevaPuja(@NonNull Long subastaId) {
        Subasta subasta = subastaRepository.findById(subastaId)
                .orElseThrow(() -> new BusinessException("subasta.no.encontrada", HttpStatus.NOT_FOUND));

        Notificacion notificacion = new Notificacion();
        notificacion.setMensaje("Nueva puja recibida en tu subasta #" + subastaId);
        notificacion.setTipo(TipoNotificacion.NUEVA_PUJA);
        notificacion.setDestinatario(subasta.getVendedor());
        notificacion.setSubasta(subasta);

        return notificacionRepository.save(notificacion);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Notificacion> listarPorUsuario(@NonNull Long userId, Pageable pageable) {
        return notificacionRepository.findByDestinatarioIdOrderByFechaCreacionDesc(userId, pageable);
    }

    @Override
    @Transactional
    public void marcarComoLeida(@NonNull Long notificacionId, @NonNull Long userId) {
        Notificacion notificacion = notificacionRepository.findById(notificacionId)
                .orElseThrow(() -> new BusinessException("notificacion.no.encontrada", HttpStatus.NOT_FOUND));

        if (!notificacion.getDestinatario().getId().equals(userId)) {
            throw new BusinessException("notificacion.no.autorizada", HttpStatus.FORBIDDEN);
        }

        notificacion.setLeida(true);
        notificacionRepository.save(notificacion);
    }
}
