package com.subastas.tpi.service.impl;

import com.subastas.tpi.exception.BusinessException;
import com.subastas.tpi.model.Notificacion;
import com.subastas.tpi.model.Subasta;
import com.subastas.tpi.model.enums.TipoNotificacion;
import com.subastas.tpi.repository.NotificacionRepository;
import com.subastas.tpi.repository.SubastaRepository;
import com.subastas.tpi.service.NotificacionService;
import lombok.RequiredArgsConstructor;
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
    public void notificarVendedorNuevaPuja(@NonNull Long subastaId) {
        Subasta subasta = subastaRepository.findById(subastaId)
                .orElseThrow(() -> new BusinessException("subasta.no.encontrada", HttpStatus.NOT_FOUND));

        Notificacion notificacion = new Notificacion();
        notificacion.setMensaje("Nueva puja recibida en tu subasta #" + subastaId);
        notificacion.setTipo(TipoNotificacion.NUEVA_PUJA);
        notificacion.setDestinatario(subasta.getVendedor());
        notificacion.setSubasta(subasta);

        notificacionRepository.save(notificacion);
    }
}
