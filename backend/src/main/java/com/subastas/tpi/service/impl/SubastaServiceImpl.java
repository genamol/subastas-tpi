package com.subastas.tpi.service.impl;

import com.subastas.tpi.dto.request.SubastaRequest;
import com.subastas.tpi.dto.response.SubastaResponse;
import com.subastas.tpi.event.EstadoCambiadoEvent;
import com.subastas.tpi.exception.BusinessException;
import com.subastas.tpi.model.HistorialEstado;
import com.subastas.tpi.model.Producto;
import com.subastas.tpi.model.Subasta;
import com.subastas.tpi.model.Usuario;
import com.subastas.tpi.model.enums.EstadoSubasta;
import com.subastas.tpi.repository.HistorialEstadoRepository;
import com.subastas.tpi.repository.ProductoRepository;
import com.subastas.tpi.repository.SubastaRepository;
import com.subastas.tpi.repository.UsuarioRepository;
import com.subastas.tpi.service.SubastaService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class SubastaServiceImpl implements SubastaService {

    private final SubastaRepository subastaRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final HistorialEstadoRepository historialEstadoRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public SubastaResponse crear(@NonNull Long userId, SubastaRequest request) {
        Usuario vendedor = usuarioRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("usuario.no.encontrado", HttpStatus.NOT_FOUND));

        Producto producto = productoRepository.findById(Objects.requireNonNull(request.getProductoId()))
                .orElseThrow(() -> new BusinessException("producto.no.encontrado", HttpStatus.NOT_FOUND));

        Subasta subasta = new Subasta();
        subasta.setProducto(producto);
        subasta.setVendedor(vendedor);
        subasta.setPrecioBase(request.getPrecioBase());
        subasta.setMontoActual(request.getPrecioBase());
        subasta.setIncrementoMinimo(request.getIncrementoMinimo());
        subasta.setFechaInicio(request.getFechaInicio());
        subasta.setFechaCierre(request.getFechaCierre());
        subasta.setDescripcion(request.getDescripcion());
        subasta.setEstado(EstadoSubasta.BORRADOR);

        subastaRepository.save(subasta);

        registrarHistorial(subasta, null, EstadoSubasta.BORRADOR, vendedor, "Creación de subasta");

        return mapToResponse(subasta);
    }

    @Override
    @Transactional
    public SubastaResponse publicar(@NonNull Long userId, @NonNull Long subastaId) {
        Subasta subasta = subastaRepository.findById(subastaId)
                .orElseThrow(() -> new BusinessException("subasta.no.encontrada", HttpStatus.NOT_FOUND));

        if (!subasta.getVendedor().getId().equals(userId)) {
            throw new BusinessException("Solo el vendedor puede publicar la subasta", HttpStatus.FORBIDDEN);
        }

        cambiarEstado(subasta, EstadoSubasta.PUBLICADA, subasta.getVendedor(), "Publicación de subasta");

        return mapToResponse(subasta);
    }

    @Override
    @Transactional
    public SubastaResponse cancelar(@NonNull Long userId, @NonNull Long subastaId, String motivo) {
        Subasta subasta = subastaRepository.findById(subastaId)
                .orElseThrow(() -> new BusinessException("subasta.no.encontrada", HttpStatus.NOT_FOUND));

        Usuario responsable = usuarioRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("usuario.no.encontrado", HttpStatus.NOT_FOUND));

        // Solo el vendedor o un admin pueden cancelar
        boolean esVendedor = subasta.getVendedor().getId().equals(userId);
        boolean esAdmin = responsable.getRoles().stream()
                .anyMatch(r -> r.getNombre().name().equals("ADMIN"));

        if (!esVendedor && !esAdmin) {
            throw new BusinessException("No tiene permisos para cancelar esta subasta", HttpStatus.FORBIDDEN);
        }

        EstadoSubasta estado = subasta.getEstado();
        if (estado != EstadoSubasta.PUBLICADA && estado != EstadoSubasta.ACTIVA) {
            throw new BusinessException("Solo se pueden cancelar subastas en estado PUBLICADA o ACTIVA",
                    HttpStatus.BAD_REQUEST);
        }

        cambiarEstado(subasta, EstadoSubasta.CANCELADA, responsable, motivo != null ? motivo : "Cancelación");

        return mapToResponse(subasta);
    }

    @Override
    @Transactional(readOnly = true)
    public SubastaResponse obtenerPorId(@NonNull Long subastaId) {
        Subasta subasta = subastaRepository.findById(subastaId)
                .orElseThrow(() -> new BusinessException("subasta.no.encontrada", HttpStatus.NOT_FOUND));

        return mapToResponse(subasta);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SubastaResponse> obtenerTodas(Pageable pageable) {
        return subastaRepository.findByEstadoIn(
                List.of(EstadoSubasta.PUBLICADA, EstadoSubasta.ACTIVA, EstadoSubasta.FINALIZADA,
                        EstadoSubasta.ADJUDICADA),
                pageable).map(this::mapToResponse);
    }

    void cambiarEstado(Subasta subasta, EstadoSubasta nuevoEstado, Usuario responsable, String motivo) {
        EstadoSubasta estadoAnterior = subasta.getEstado();
        subasta.setEstado(nuevoEstado);

        registrarHistorial(subasta, estadoAnterior, nuevoEstado, responsable, motivo);

        eventPublisher.publishEvent(new EstadoCambiadoEvent(subasta.getId(), nuevoEstado));
    }

    private void registrarHistorial(Subasta subasta, EstadoSubasta anterior, EstadoSubasta nuevo,
                                    Usuario responsable, String motivo) {
        HistorialEstado historial = new HistorialEstado();
        historial.setSubasta(subasta);
        historial.setEstadoAnterior(anterior);
        historial.setEstadoNuevo(nuevo);
        historial.setUsuarioResponsable(responsable);
        historial.setMotivo(motivo);

        historialEstadoRepository.save(historial);
    }

    private SubastaResponse mapToResponse(Subasta s) {
        SubastaResponse.SubastaResponseBuilder builder = SubastaResponse.builder()
                .id(s.getId())
                .precioBase(s.getPrecioBase())
                .montoActual(s.getMontoActual())
                .incrementoMinimo(s.getIncrementoMinimo())
                .fechaInicio(s.getFechaInicio())
                .fechaCierre(s.getFechaCierre())
                .estado(s.getEstado())
                .descripcion(s.getDescripcion())
                .fechaAdjudicacion(s.getFechaAdjudicacion())
                .productoId(s.getProducto().getId())
                .productoNombre(s.getProducto().getNombre())
                .vendedorId(s.getVendedor().getId())
                .vendedorNombre(s.getVendedor().getNombre());

        // Privacidad: ganador solo visible cuando la subasta terminó
        if (s.getEstado() == EstadoSubasta.FINALIZADA
                || s.getEstado() == EstadoSubasta.ADJUDICADA
                || s.getEstado() == EstadoSubasta.EN_DISPUTA) {
            if (s.getGanador() != null) {
                builder.ganadorId(s.getGanador().getId());
                builder.ganadorNombre(s.getGanador().getNombre());
            }
        }

        return builder.build();
    }
}
