package com.subastas.tpi.service.impl;

import com.subastas.tpi.dto.request.PujaRequest;
import com.subastas.tpi.dto.response.PujaResponse;
import com.subastas.tpi.dto.response.PujaSseDto;
import com.subastas.tpi.event.NuevaPujaEvent;
import com.subastas.tpi.exception.BusinessException;
import com.subastas.tpi.model.Puja;
import com.subastas.tpi.model.Subasta;
import com.subastas.tpi.model.Usuario;
import com.subastas.tpi.model.enums.EstadoSubasta;
import com.subastas.tpi.repository.PujaRepository;
import com.subastas.tpi.repository.SubastaRepository;
import com.subastas.tpi.repository.UsuarioRepository;
import com.subastas.tpi.service.PujaService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class PujaServiceImpl implements PujaService {

    private final PujaRepository pujaRepository;
    private final SubastaRepository subastaRepository;
    private final UsuarioRepository usuarioRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public PujaResponse pujar(Long userId, PujaRequest request) {
        Usuario ofertante = usuarioRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("usuario.no.encontrado", HttpStatus.NOT_FOUND));

        // Bloqueo pesimista: solo una puja se procesa a la vez por subasta
        Subasta subasta = subastaRepository.findByIdForUpdate(request.getSubastaId())
                .orElseThrow(() -> new BusinessException("subasta.no.encontrada", HttpStatus.NOT_FOUND));

        if (subasta.getEstado() != EstadoSubasta.ACTIVA) {
            throw new BusinessException("subasta.no.activa", HttpStatus.BAD_REQUEST);
        }

        if (subasta.getFechaCierre().isBefore(Instant.now())) {
            throw new BusinessException("subasta.expirada", HttpStatus.BAD_REQUEST);
        }

        if (subasta.getVendedor().getId().equals(userId)) {
            throw new BusinessException("puja.vendedor.invalido", HttpStatus.BAD_REQUEST);
        }

        // El monto se valida contra la BD, nunca contra lo que el cliente envía
        if (subasta.getMontoActual().compareTo(subasta.getPrecioBase()) == 0) {
            // Primera puja: debe ser >= precioBase
            if (request.getMonto().compareTo(subasta.getPrecioBase()) < 0) {
                throw new BusinessException("puja.monto.insuficiente", HttpStatus.BAD_REQUEST);
            }
        } else {
            // Pujas siguientes: monto >= montoActual + incrementoMinimo
            if (request.getMonto().compareTo(subasta.getMontoActual().add(subasta.getIncrementoMinimo())) < 0) {
                throw new BusinessException("puja.monto.insuficiente", HttpStatus.BAD_REQUEST);
            }
        }

        Puja puja = new Puja();
        puja.setMonto(request.getMonto());
        puja.setSubasta(subasta);
        puja.setOfertante(ofertante);

        pujaRepository.save(puja);

        // Actualiza el monto actual de la subasta
        subasta.setMontoActual(request.getMonto());

        // Publica el evento para SSE y notificaciones (Observer)
        PujaSseDto sseDto = PujaSseDto.builder()
                .subastaId(subasta.getId())
                .monto(puja.getMonto())
                .montoActual(subasta.getMontoActual())
                .fechaPuja(puja.getFechaPuja())
                .build();

        eventPublisher.publishEvent(new NuevaPujaEvent(
                subasta.getId(), sseDto, ofertante.getId(), ofertante.getNombre()));

        return PujaResponse.builder()
                .id(puja.getId())
                .monto(puja.getMonto())
                .fechaPuja(puja.getFechaPuja())
                .subastaId(subasta.getId())
                .montoActual(subasta.getMontoActual())
                .build();
    }
}
