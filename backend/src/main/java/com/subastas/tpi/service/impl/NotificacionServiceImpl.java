package com.subastas.tpi.service.impl;

import com.subastas.tpi.dto.response.NotificacionResponse;
import com.subastas.tpi.exception.BusinessException;
import com.subastas.tpi.model.Notificacion;
import com.subastas.tpi.model.Subasta;
import com.subastas.tpi.model.enums.TipoNotificacion;
import com.subastas.tpi.repository.NotificacionRepository;
import com.subastas.tpi.repository.SubastaRepository;
import com.subastas.tpi.service.NotificacionService;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.MessageFormat;

@Service
public class NotificacionServiceImpl implements NotificacionService {

    private final NotificacionRepository notificacionRepository;
    private final SubastaRepository subastaRepository;
    private final MessageSource messageSource;

    public NotificacionServiceImpl(NotificacionRepository notificacionRepository,
                                    SubastaRepository subastaRepository,
                                    MessageSource messageSource) {
        this.notificacionRepository = notificacionRepository;
        this.subastaRepository = subastaRepository;
        this.messageSource = messageSource;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificacionResponse> obtenerMisNotificaciones(Long usuarioId, Pageable pageable) {
        return notificacionRepository
            .findByDestinatarioIdOrderByFechaCreacionDesc(usuarioId, pageable)
            .map(this::mapToResponse);
    }

    @Override
    @Transactional
    public void marcarTodasLeidas(Long usuarioId) {
        notificacionRepository.marcarTodasComoLeidas(usuarioId);
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

    @Override
    @Transactional
    public Notificacion notificarVendedorNuevaPuja(Long subastaId, BigDecimal monto) {
        Subasta subasta = subastaRepository.findById(subastaId)
                .orElseThrow(() -> new BusinessException("subasta.no.encontrada", HttpStatus.NOT_FOUND));

        String plantilla = messageSource.getMessage("notificacion.nueva.puja", null,
                LocaleContextHolder.getLocale());
        String mensaje = MessageFormat.format(plantilla, "$" + monto, subasta.getProducto().getNombre());

        Notificacion notificacion = new Notificacion();
        notificacion.setMensaje(mensaje);
        notificacion.setTipo(TipoNotificacion.NUEVA_PUJA);
        notificacion.setDestinatario(subasta.getVendedor());
        notificacion.setSubasta(subasta);

        return notificacionRepository.save(notificacion);
    }

    @Override
    @Transactional
    public Notificacion notificarVendedorPagoVencido(Long subastaId) {
        Subasta subasta = subastaRepository.findById(subastaId)
                .orElseThrow(() -> new BusinessException("subasta.no.encontrada", HttpStatus.NOT_FOUND));

        String plantilla = messageSource.getMessage("notificacion.pago.vencido", null,
                LocaleContextHolder.getLocale());
        String mensaje = MessageFormat.format(plantilla, subasta.getProducto().getNombre());

        Notificacion notificacion = new Notificacion();
        notificacion.setMensaje(mensaje);
        notificacion.setTipo(TipoNotificacion.PAGO_VENCIDO);
        notificacion.setDestinatario(subasta.getVendedor());
        notificacion.setSubasta(subasta);

        return notificacionRepository.save(notificacion);
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
