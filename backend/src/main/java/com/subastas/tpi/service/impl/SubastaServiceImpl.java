package com.subastas.tpi.service.impl;

import com.subastas.tpi.dto.request.SubastaRequest;
import com.subastas.tpi.dto.response.HistorialEstadoResponse;
import com.subastas.tpi.dto.response.SubastaResponse;
import com.subastas.tpi.event.EstadoCambiadoEvent;
import com.subastas.tpi.exception.BusinessException;
import com.subastas.tpi.model.HistorialEstado;
import com.subastas.tpi.model.ImagenProducto;
import com.subastas.tpi.model.Producto;
import com.subastas.tpi.model.Subasta;
import com.subastas.tpi.model.Usuario;
import com.subastas.tpi.model.enums.EstadoSubasta;
import com.subastas.tpi.repository.CalificacionRepository;
import com.subastas.tpi.repository.HistorialEstadoRepository;
import com.subastas.tpi.repository.PagoRepository;
import com.subastas.tpi.repository.ProductoRepository;
import com.subastas.tpi.repository.SubastaRepository;
import com.subastas.tpi.repository.UsuarioRepository;
import com.subastas.tpi.scheduler.SubastaTransactionHelper;
import com.subastas.tpi.service.SubastaService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

// usamos supress por los warnings de lombok si no hay que hacer el constructor manual
@Slf4j
@SuppressWarnings("null")
@Service
@RequiredArgsConstructor
public class SubastaServiceImpl implements SubastaService {

    private final SubastaRepository subastaRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final HistorialEstadoRepository historialEstadoRepository;
    private final CalificacionRepository calificacionRepository;
    private final PagoRepository pagoRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final SubastaTransactionHelper transactionHelper;

    @Value("${subasta.visibilidad-horas:12}")
    private int visibilidadHoras;

    @Override
    @Transactional
    public SubastaResponse crearSubasta(SubastaRequest request, Long vendedorId) {
        Usuario vendedor = usuarioRepository.findById(vendedorId)
                .orElseThrow(() -> new BusinessException("usuario.no.encontrado", HttpStatus.NOT_FOUND));

        if (vendedor.isBloqueado()) {
            throw new BusinessException("usuario.bloqueado", HttpStatus.FORBIDDEN);
        }

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
        Instant limite = Instant.now().minus(visibilidadHoras, ChronoUnit.HOURS);
        return subastaRepository.findVisibles(
                List.of(EstadoSubasta.PUBLICADA, EstadoSubasta.ACTIVA, EstadoSubasta.ADJUDICADA),
                List.of(EstadoSubasta.FINALIZADA),
                limite,
                pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SubastaResponse> obtenerMisSubastas(Long vendedorId, Pageable pageable) {
        return subastaRepository.findByVendedorId(vendedorId, pageable).map(this::mapToResponse);
    }

    @Override
    public void procesarCierresAutomaticos() {
        Instant ahora = Instant.now();

        for (Subasta s : subastaRepository.findByEstadoAndFechaInicioBefore(EstadoSubasta.PUBLICADA, ahora)) {
            try {
                transactionHelper.activarSubasta(s.getId());
            } catch (Exception e) {
                log.error("Error al activar subasta {}: {}", s.getId(), e.getMessage(), e);
            }
        }

        for (Subasta s : subastaRepository.findByEstadoAndFechaCierreBefore(EstadoSubasta.ACTIVA, ahora)) {
            try {
                transactionHelper.cerrarSubasta(s.getId(), ahora);
            } catch (Exception e) {
                log.error("Error al cerrar subasta {}: {}", s.getId(), e.getMessage(), e);
            }
        }

        Instant limite48h = ahora.minus(48, ChronoUnit.HOURS);
        for (Subasta s : subastaRepository.findByEstadoAndFechaAdjudicacionBefore(EstadoSubasta.ADJUDICADA, limite48h)) {
            try {
                transactionHelper.procesarPagoVencido(s.getId());
            } catch (Exception e) {
                log.error("Error al procesar pago vencido de subasta {}: {}", s.getId(), e.getMessage(), e);
            }
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

    @Override
    @Transactional(readOnly = true)
    public List<HistorialEstadoResponse> obtenerHistorial(Long subastaId) {
        return historialEstadoRepository.findBySubastaIdOrderByFechaAsc(subastaId).stream()
                .map(h -> HistorialEstadoResponse.builder()
                        .id(h.getId())
                        .estadoAnterior(h.getEstadoAnterior() != null ? h.getEstadoAnterior().name() : null)
                        .estadoNuevo(h.getEstadoNuevo().name())
                        .fecha(h.getFecha())
                        .motivo(h.getMotivo())
                        .usuarioResponsableNombre(h.getUsuarioResponsable() != null ? h.getUsuarioResponsable().getNombre() : null)
                        .build())
                .toList();
    }

    private SubastaResponse mapToResponse(Subasta subasta) {
        Producto producto = subasta.getProducto();
        List<String> imagenes = producto.getImagenes() != null
                ? producto.getImagenes().stream().map(ImagenProducto::getUrl).toList()
                : List.of();
        int totalPujas = subasta.getPujas() != null ? subasta.getPujas().size() : 0;
        String categoriaNombre = producto.getCategoria() != null ? producto.getCategoria().getNombre() : "";

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
                .productoId(producto.getId())
                .productoNombre(producto.getNombre())
                .categoriaNombre(categoriaNombre)
                .imagenes(imagenes)
                .totalPujas(totalPujas)
                .vendedorId(subasta.getVendedor().getId())
                .vendedorNombre(subasta.getVendedor().getNombre())
                .vendedorCalificacionPromedio(calificacionRepository.findPromedioByCalificadoId(subasta.getVendedor().getId()))
                .ganadorId(subasta.getGanador() != null ? subasta.getGanador().getId() : null)
                .ganadorNombre(subasta.getGanador() != null ? subasta.getGanador().getNombre() : null)
                .estadoPago(pagoRepository.findBySubastaId(subasta.getId())
                        .map(p -> p.getEstado().name())
                        .orElse(null))
                .fechaLimitePago(subasta.getEstado() == EstadoSubasta.ADJUDICADA && subasta.getFechaAdjudicacion() != null
                        ? subasta.getFechaAdjudicacion().plus(48, ChronoUnit.HOURS)
                        : null)
                .build();
    }
}