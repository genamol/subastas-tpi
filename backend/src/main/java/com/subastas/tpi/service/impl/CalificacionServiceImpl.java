package com.subastas.tpi.service.impl;

import com.subastas.tpi.dto.request.CalificacionRequest;
import com.subastas.tpi.dto.response.CalificacionResponse;
import com.subastas.tpi.exception.BusinessException;
import com.subastas.tpi.model.Calificacion;
import com.subastas.tpi.model.Subasta;
import com.subastas.tpi.model.Usuario;
import com.subastas.tpi.model.enums.EstadoSubasta;
import com.subastas.tpi.repository.CalificacionRepository;
import com.subastas.tpi.repository.SubastaRepository;
import com.subastas.tpi.repository.UsuarioRepository;
import com.subastas.tpi.service.CalificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CalificacionServiceImpl implements CalificacionService {

    private final CalificacionRepository calificacionRepository;
    private final SubastaRepository subastaRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    @Transactional
    public CalificacionResponse calificar(Long calificadorId, CalificacionRequest request) {
        Subasta subasta = subastaRepository.findById(request.getSubastaId())
                .orElseThrow(() -> new BusinessException("subasta.no.encontrada", HttpStatus.NOT_FOUND));

        if (subasta.getEstado() != EstadoSubasta.ADJUDICADA
                && subasta.getEstado() != EstadoSubasta.FINALIZADA) {
            throw new BusinessException("calificacion.subasta.no.terminada", HttpStatus.BAD_REQUEST);
        }

        Usuario calificado = usuarioRepository.findById(request.getCalificadoId())
                .orElseThrow(() -> new BusinessException("usuario.no.encontrado", HttpStatus.NOT_FOUND));

        if (calificacionRepository.existsBySubastaIdAndCalificadorId(request.getSubastaId(), calificadorId)) {
            throw new BusinessException("calificacion.ya.existe", HttpStatus.CONFLICT);
        }

        Calificacion calificacion = new Calificacion();
        calificacion.setPuntuacion(request.getPuntuacion());
        calificacion.setComentario(request.getComentario());
        calificacion.setSubasta(subasta);
        calificacion.setCalificador(usuarioRepository.getReferenceById(calificadorId));
        calificacion.setCalificado(calificado);

        calificacionRepository.save(calificacion);
        return mapToResponse(calificacion);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CalificacionResponse> obtenerPorUsuario(Long usuarioId, Pageable pageable) {
        return calificacionRepository.findByCalificadoIdOrderByFechaCreacionDesc(usuarioId, pageable)
                .map(this::mapToResponse);
    }

    private CalificacionResponse mapToResponse(Calificacion c) {
        return CalificacionResponse.builder()
                .id(c.getId())
                .puntuacion(c.getPuntuacion())
                .comentario(c.getComentario())
                .fechaCreacion(c.getFechaCreacion())
                .subastaId(c.getSubasta().getId())
                .calificadorId(c.getCalificador().getId())
                .calificadorNombre(c.getCalificador().getNombre())
                .calificadoId(c.getCalificado().getId())
                .calificadoNombre(c.getCalificado().getNombre())
                .build();
    }
}
