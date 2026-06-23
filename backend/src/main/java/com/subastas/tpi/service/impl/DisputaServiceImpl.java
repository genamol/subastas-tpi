package com.subastas.tpi.service.impl;

import com.subastas.tpi.dto.request.DisputaRequest;
import com.subastas.tpi.dto.request.DisputaResolucionRequest;
import com.subastas.tpi.dto.response.DisputaResponse;
import com.subastas.tpi.exception.BusinessException;
import com.subastas.tpi.model.Disputa;
import com.subastas.tpi.model.Subasta;
import com.subastas.tpi.model.Usuario;
import com.subastas.tpi.model.enums.EstadoSubasta;
import com.subastas.tpi.repository.DisputaRepository;
import com.subastas.tpi.repository.SubastaRepository;
import com.subastas.tpi.repository.UsuarioRepository;
import com.subastas.tpi.service.DisputaService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class DisputaServiceImpl implements DisputaService {

    private final DisputaRepository disputaRepository;
    private final SubastaRepository subastaRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    @Transactional
    public DisputaResponse abrir(DisputaRequest request, Long iniciadorId) {
        Subasta subasta = subastaRepository.findById(request.getSubastaId())
            .orElseThrow(() -> new BusinessException("subasta.no.encontrada", HttpStatus.NOT_FOUND));

        if (subasta.getEstado() != EstadoSubasta.ADJUDICADA) {
            throw new BusinessException("disputa.subasta.no.adjudicada", HttpStatus.BAD_REQUEST);
        }

        Usuario iniciador = usuarioRepository.findById(iniciadorId)
            .orElseThrow(() -> new BusinessException("usuario.no.encontrado", HttpStatus.NOT_FOUND));

        boolean esVendedor = subasta.getVendedor().getId().equals(iniciadorId);
        boolean esGanador = subasta.getGanador() != null && subasta.getGanador().getId().equals(iniciadorId);

        if (!esVendedor && !esGanador) {
            throw new BusinessException("disputa.no.autorizado", HttpStatus.FORBIDDEN);
        }

        if (disputaRepository.existsBySubastaIdAndResolucionAdminIsNull(request.getSubastaId())) {
            throw new BusinessException("disputa.ya.existe.abierta", HttpStatus.BAD_REQUEST);
        }

        Disputa disputa = new Disputa();
        disputa.setTipo(request.getTipo());
        disputa.setDescripcion(request.getDescripcion());
        disputa.setSubasta(subasta);
        disputa.setIniciador(iniciador);

        disputaRepository.save(disputa);

        subasta.setEstado(EstadoSubasta.EN_DISPUTA);
        subastaRepository.save(subasta);

        return mapToResponse(disputa);
    }

    @Override
    @Transactional
    public DisputaResponse resolver(Long disputaId, DisputaResolucionRequest request, Long adminId) {
        Disputa disputa = disputaRepository.findById(disputaId)
            .orElseThrow(() -> new BusinessException("disputa.no.encontrada", HttpStatus.NOT_FOUND));

        if (disputa.getResolucionAdmin() != null) {
            throw new BusinessException("disputa.ya.resuelta", HttpStatus.BAD_REQUEST);
        }

        Usuario admin = usuarioRepository.findById(adminId)
            .orElseThrow(() -> new BusinessException("usuario.no.encontrado", HttpStatus.NOT_FOUND));

        disputa.setResolucionAdmin(request.getResolucion());
        disputa.setResoltor(admin);
        disputa.setFechaResolucion(Instant.now());

        disputaRepository.save(disputa);

        // Al resolver la disputa la subasta vuelve a ADJUDICADA
        Subasta subasta = disputa.getSubasta();
        subasta.setEstado(EstadoSubasta.ADJUDICADA);
        subastaRepository.save(subasta);

        return mapToResponse(disputa);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DisputaResponse> obtenerPorSubasta(Long subastaId, Pageable pageable) {
        return disputaRepository.findBySubastaId(subastaId, pageable)
            .map(this::mapToResponse);
    }

    private DisputaResponse mapToResponse(Disputa disputa) {
        return DisputaResponse.builder()
            .id(disputa.getId())
            .tipo(disputa.getTipo())
            .descripcion(disputa.getDescripcion())
            .resolucionAdmin(disputa.getResolucionAdmin())
            .fechaCreacion(disputa.getFechaCreacion())
            .fechaResolucion(disputa.getFechaResolucion())
            .subastaId(disputa.getSubasta().getId())
            .iniciadorId(disputa.getIniciador().getId())
            .iniciadorNombre(disputa.getIniciador().getNombre())
            .build();
    }
}
