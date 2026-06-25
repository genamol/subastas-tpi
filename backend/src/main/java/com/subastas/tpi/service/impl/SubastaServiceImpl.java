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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

// usamos supress por los warnings de lombok si no hay que hacer el constructor manual
@SuppressWarnings("null")
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
    public SubastaResponse crearSubasta(SubastaRequest request, Long vendedorId) {
        Usuario vendedor = usuarioRepository.findById(vendedorId)
                .orElseThrow(() -> new BusinessException("usuario.no.encontrado", HttpStatus.NOT_FOUND));

        Producto producto = productoRepository.findById(request.getProductoId())
                .orElseThrow(() -> new BusinessException("producto.no.encontrado", HttpStatus.NOT_FOUND));

        if (!producto.getVendedor().getId().equals(vendedorId)) {
            throw new BusinessException("producto.no.autorizado", HttpStatus.FORBIDDEN);
        }

        if (request.getFechaCierre().isBefore(request.getFechaInicio())) {
            throw new BusinessException("subasta.fechas.invalidas", HttpStatus.BAD_REQUEST);
        }

        Subasta subasta = new Subasta();
        subasta.setPrecioBase(request.getPrecioBase());
        subasta.setMontoActual(request.getPrecioBase());
        subasta.setIncrementoMinimo(request.getIncrementoMinimo());
        subasta.setFechaInicio(request.getFechaInicio());
        subasta.setFechaCierre(request.getFechaCierre());
        subasta.setDescripcion(request.getDescripcion());
        subasta.setProducto(producto);
        subasta.setVendedor(vendedor);
        subasta.setEstado(EstadoSubasta.BORRADOR);

        Subasta guardada = subastaRepository.save(subasta);
        registrarHistorialEstado(guardada, null, EstadoSubasta.BORRADOR, "Subasta creada en borrador", vendedor);

        return mapToResponse(guardada);
    }

    @Override
    @Transactional
    public SubastaResponse publicarSubasta(Long id, Long vendedorId) {
        Subasta subasta = subastaRepository.findById(id)
                .orElseThrow(() -> new BusinessException("subasta.no.encontrada", HttpStatus.NOT_FOUND));

        if (!subasta.getVendedor().getId().equals(vendedorId)) {
            throw new BusinessException("subasta.no.autorizada", HttpStatus.FORBIDDEN);
        }

        if (subasta.getEstado() != EstadoSubasta.BORRADOR) {
            throw new BusinessException("subasta.estado.invalido.publicar", HttpStatus.BAD_REQUEST);
        }

        EstadoSubasta estadoAnterior = subasta.getEstado();
        subasta.setEstado(EstadoSubasta.PUBLICADA);
        Subasta actualizada = subastaRepository.save(subasta);
        registrarHistorialEstado(actualizada, estadoAnterior, EstadoSubasta.PUBLICADA, "Subasta publicada", subasta.getVendedor());
        eventPublisher.publishEvent(new EstadoCambiadoEvent(actualizada.getId(), EstadoSubasta.PUBLICADA));
        return mapToResponse(actualizada);
    }

    @Override
    @Transactional
    public SubastaResponse cancelarSubasta(Long id, Long vendedorId) {
        Subasta subasta = subastaRepository.findById(id)
                .orElseThrow(() -> new BusinessException("subasta.no.encontrada", HttpStatus.NOT_FOUND));

        if (!subasta.getVendedor().getId().equals(vendedorId)) {
            throw new BusinessException("subasta.no.autorizada", HttpStatus.FORBIDDEN);
        }

        if (subasta.getPujas() != null && !subasta.getPujas().isEmpty()) {
            throw new BusinessException("subasta.tiene.pujas", HttpStatus.BAD_REQUEST);
        }

        EstadoSubasta estadoActual = subasta.getEstado();
        if (estadoActual != EstadoSubasta.BORRADOR && estadoActual != EstadoSubasta.PUBLICADA && estadoActual != EstadoSubasta.ACTIVA) {
            throw new BusinessException("subasta.estado.invalido.cancelar", HttpStatus.BAD_REQUEST);
        }

        subasta.setEstado(EstadoSubasta.CANCELADA);
        Subasta actualizada = subastaRepository.save(subasta);
        registrarHistorialEstado(actualizada, estadoActual, EstadoSubasta.CANCELADA, "Subasta cancelada por el vendedor", subasta.getVendedor());
        eventPublisher.publishEvent(new EstadoCambiadoEvent(actualizada.getId(), EstadoSubasta.CANCELADA));

        return mapToResponse(actualizada);
    }

    @Override
    @Transactional
    public SubastaResponse cancelarSubastaAdmin(Long id, Long adminId) {
        Subasta subasta = subastaRepository.findById(id)
                .orElseThrow(() -> new BusinessException("subasta.no.encontrada", HttpStatus.NOT_FOUND));

        EstadoSubasta estadoActual = subasta.getEstado();
        if (estadoActual == EstadoSubasta.FINALIZADA || estadoActual == EstadoSubasta.CANCELADA) {
            throw new BusinessException("subasta.estado.invalido.cancelar", HttpStatus.BAD_REQUEST);
        }

        Usuario admin = usuarioRepository.findById(adminId)
                .orElseThrow(() -> new BusinessException("usuario.no.encontrado", HttpStatus.NOT_FOUND));

        subasta.setEstado(EstadoSubasta.CANCELADA);
        Subasta actualizada = subastaRepository.save(subasta);
        registrarHistorialEstado(actualizada, estadoActual, EstadoSubasta.CANCELADA, "Cancelada por administrador", admin);
        eventPublisher.publishEvent(new EstadoCambiadoEvent(actualizada.getId(), EstadoSubasta.CANCELADA));

        return mapToResponse(actualizada);
    }

    @Override
    @Transactional(readOnly = true)
    public SubastaResponse obtenerPorId(Long id) {
        Subasta subasta = subastaRepository.findById(id)
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

    @Override
    @Transactional
    public void procesarCierresAutomaticos() {
        Instant ahora = Instant.now();

        List<Subasta> aActivar = subastaRepository.findByEstadoAndFechaInicioBefore(EstadoSubasta.PUBLICADA, ahora);
        for (Subasta subasta : aActivar) {
            EstadoSubasta anterior = subasta.getEstado();
            subasta.setEstado(EstadoSubasta.ACTIVA);
            subastaRepository.save(subasta);
            registrarHistorialEstado(subasta, anterior, EstadoSubasta.ACTIVA, "Inicio automático por fecha alcanzada", null);
            eventPublisher.publishEvent(new EstadoCambiadoEvent(subasta.getId(), EstadoSubasta.ACTIVA));
        }

        List<Subasta> aCerrar = subastaRepository.findByEstadoAndFechaCierreBefore(EstadoSubasta.ACTIVA, ahora);
        for (Subasta subasta : aCerrar) {
            boolean tienePujas = subasta.getPujas() != null && !subasta.getPujas().isEmpty();
            EstadoSubasta anterior = subasta.getEstado();
            EstadoSubasta nuevoEstado = tienePujas ? EstadoSubasta.ADJUDICADA : EstadoSubasta.FINALIZADA;

            subasta.setEstado(nuevoEstado);
            if (tienePujas) {
                subasta.setFechaAdjudicacion(ahora);
            }
            subastaRepository.save(subasta);

            String motivo = tienePujas ? "Adjudicada automáticamente al vencer el tiempo" : "Finalizada automáticamente sin ofertas";
            registrarHistorialEstado(subasta, anterior, nuevoEstado, motivo, null);
            eventPublisher.publishEvent(new EstadoCambiadoEvent(subasta.getId(), nuevoEstado));
        }
    }

    private void registrarHistorialEstado(Subasta subasta, EstadoSubasta anterior, EstadoSubasta nuevo,
                                           String motivo, Usuario responsable) {
        HistorialEstado historial = HistorialEstado.builder()
                .subasta(subasta)
                .estadoAnterior(anterior)
                .estadoNuevo(nuevo)
                .fecha(Instant.now())
                .usuarioResponsable(responsable)
                .motivo(motivo)
                .build();
        historialEstadoRepository.save(historial);
    }

    private SubastaResponse mapToResponse(Subasta subasta) {
        return SubastaResponse.builder()
                .id(subasta.getId())
                .precioBase(subasta.getPrecioBase())
                .montoActual(subasta.getMontoActual())
                .incrementoMinimo(subasta.getIncrementoMinimo())
                .fechaInicio(subasta.getFechaInicio())
                .fechaCierre(subasta.getFechaCierre())
                .estado(subasta.getEstado())
                .descripcion(subasta.getDescripcion())
                .fechaAdjudicacion(subasta.getFechaAdjudicacion())
                .productoId(subasta.getProducto().getId())
                .productoNombre(subasta.getProducto().getNombre())
                .vendedorId(subasta.getVendedor().getId())
                .vendedorNombre(subasta.getVendedor().getNombre())
                .ganadorId(subasta.getGanador() != null ? subasta.getGanador().getId() : null)
                .ganadorNombre(subasta.getGanador() != null ? subasta.getGanador().getNombre() : null)
                .build();
    }
}