package com.subastas.tpi.service.impl;

import com.subastas.tpi.dto.request.PujaRequest;
import com.subastas.tpi.dto.response.PujaResponse;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Override
    @Transactional
    public PujaResponse registrarPuja(PujaRequest request, Long ofertanteId) {
        // Bloqueo pesimista: SELECT FOR UPDATE para evitar condiciones de carrera
        Subasta subasta = subastaRepository.findByIdForUpdate(request.getSubastaId())
            .orElseThrow(() -> new BusinessException("subasta.no.encontrada", HttpStatus.NOT_FOUND));

        if (subasta.getEstado() != EstadoSubasta.ACTIVA) {
            throw new BusinessException("puja.subasta.no.activa", HttpStatus.BAD_REQUEST);
        }

        if (Instant.now().isAfter(subasta.getFechaCierre())) {
            throw new BusinessException("puja.subasta.vencida", HttpStatus.BAD_REQUEST);
        }

        Usuario ofertante = usuarioRepository.findById(ofertanteId)
            .orElseThrow(() -> new BusinessException("usuario.no.encontrado", HttpStatus.NOT_FOUND));

        if (ofertante.isBloqueado()) {
            throw new BusinessException("puja.usuario.bloqueado", HttpStatus.FORBIDDEN);
        }

        if (subasta.getVendedor().getId().equals(ofertanteId)) {
            throw new BusinessException("puja.vendedor.no.puede.pujar", HttpStatus.BAD_REQUEST);
        }

        // Validar monto contra el valor en BD, nunca contra lo que envió el cliente
        int comparacion = request.getMonto().compareTo(
            subasta.getMontoActual().add(subasta.getIncrementoMinimo())
        );

        boolean esPrimeraPuja = subasta.getPujas().isEmpty();
        if (esPrimeraPuja) {
            if (request.getMonto().compareTo(subasta.getPrecioBase()) < 0) {
                throw new BusinessException("puja.monto.menor.precio.base", HttpStatus.BAD_REQUEST);
            }
        } else if (comparacion < 0) {
            throw new BusinessException("puja.monto.insuficiente", HttpStatus.BAD_REQUEST);
        }

        Puja puja = new Puja();
        puja.setMonto(request.getMonto());
        puja.setSubasta(subasta);
        puja.setOfertante(ofertante);
        puja.setFechaPuja(Instant.now());

        pujaRepository.save(puja);

        subasta.setMontoActual(request.getMonto());
        subasta.setGanador(ofertante);
        subastaRepository.save(subasta);

        return mapToResponse(puja, true);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PujaResponse> obtenerMisPujas(Long ofertanteId, Pageable pageable) {
        return pujaRepository.findByOfertanteIdOrderByFechaPujaDesc(ofertanteId, pageable)
            .map(p -> mapToResponse(p, true));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PujaResponse> obtenerPujasPorSubasta(Long subastaId, Long solicitanteId,
                                                      boolean esAdmin, Pageable pageable) {
        Subasta subasta = subastaRepository.findById(subastaId)
            .orElseThrow(() -> new BusinessException("subasta.no.encontrada", HttpStatus.NOT_FOUND));

        boolean subastaFinalizada = subasta.getEstado() == EstadoSubasta.FINALIZADA
            || subasta.getEstado() == EstadoSubasta.ADJUDICADA;

        boolean esVendedor = subasta.getVendedor().getId().equals(solicitanteId);

        // Solo ADMIN o vendedor (post-cierre) pueden ver la identidad de los ofertantes
        boolean verIdentidad = esAdmin || (esVendedor && subastaFinalizada);

        return pujaRepository.findBySubastaIdOrderByFechaPujaDesc(subastaId, pageable)
            .map(p -> mapToResponse(p, verIdentidad));
    }

    private PujaResponse mapToResponse(Puja puja, boolean verIdentidad) {
        return PujaResponse.builder()
            .id(puja.getId())
            .monto(puja.getMonto())
            .fechaPuja(puja.getFechaPuja())
            .subastaId(puja.getSubasta().getId())
            .ofertanteId(verIdentidad ? puja.getOfertante().getId() : null)
            .ofertanteNombre(verIdentidad ? puja.getOfertante().getNombre() : null)
            .build();
    }
}
