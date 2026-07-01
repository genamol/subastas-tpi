package com.subastas.tpi.service.impl;

import com.subastas.tpi.dto.request.PagoRequest;
import com.subastas.tpi.dto.response.PagoResponse;
import com.subastas.tpi.exception.BusinessException;
import com.subastas.tpi.model.Pago;
import com.subastas.tpi.model.Subasta;
import com.subastas.tpi.model.Usuario;
import com.subastas.tpi.model.enums.EstadoPago;
import com.subastas.tpi.model.enums.EstadoSubasta;
import com.subastas.tpi.repository.PagoRepository;
import com.subastas.tpi.repository.SubastaRepository;
import com.subastas.tpi.repository.UsuarioRepository;
import com.subastas.tpi.service.PagoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class PagoServiceImpl implements PagoService {

    private final PagoRepository pagoRepository;
    private final SubastaRepository subastaRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    @Transactional
    public PagoResponse procesarPago(Long subastaId, PagoRequest request, Long compradorId) {
        Subasta subasta = subastaRepository.findById(subastaId)
                .orElseThrow(() -> new BusinessException("subasta.no.encontrada", HttpStatus.NOT_FOUND));

        if (subasta.getEstado() != EstadoSubasta.ADJUDICADA) {
            throw new BusinessException("pago.subasta.no.adjudicada", HttpStatus.BAD_REQUEST);
        }

        if (subasta.getGanador() == null || !subasta.getGanador().getId().equals(compradorId)) {
            throw new BusinessException("pago.no.autorizado", HttpStatus.FORBIDDEN);
        }

        pagoRepository.findBySubastaId(subastaId).ifPresent(p -> {
            if (p.getEstado() == EstadoPago.APROBADO) {
                throw new BusinessException("pago.ya.existe", HttpStatus.CONFLICT);
            }
            pagoRepository.delete(p); // permite reintentar si fue rechazado
        });

        Usuario comprador = usuarioRepository.findById(compradorId)
                .orElseThrow(() -> new BusinessException("usuario.no.encontrado", HttpStatus.NOT_FOUND));

        String ultimosDigitos = request.getNumeroTarjeta()
                .substring(request.getNumeroTarjeta().length() - 4);

        // Simulación: tarjeta terminada en "0000" es rechazada
        boolean aprobado = !ultimosDigitos.equals("0000");
        EstadoPago estadoPago = aprobado ? EstadoPago.APROBADO : EstadoPago.RECHAZADO;

        Pago pago = new Pago();
        pago.setSubasta(subasta);
        pago.setComprador(comprador);
        pago.setMonto(subasta.getMontoActual());
        pago.setEstado(estadoPago);
        pago.setUltimosCuatroDigitos(ultimosDigitos);
        pago.setMedioPago(request.getMedioPago());
        pago.setFechaProcesamiento(Instant.now());

        if (aprobado) {
            subasta.setEstado(EstadoSubasta.FINALIZADA);
            subastaRepository.save(subasta);
        }

        return mapToResponse(pagoRepository.save(pago));
    }

    @Override
    @Transactional(readOnly = true)
    public PagoResponse obtenerPorSubasta(Long subastaId) {
        return pagoRepository.findBySubastaId(subastaId)
                .map(this::mapToResponse)
                .orElseThrow(() -> new BusinessException("pago.no.encontrado", HttpStatus.NOT_FOUND));
    }

    private PagoResponse mapToResponse(Pago pago) {
        return PagoResponse.builder()
                .id(pago.getId())
                .subastaId(pago.getSubasta().getId())
                .monto(pago.getMonto())
                .estado(pago.getEstado())
                .medioPago(pago.getMedioPago())
                .ultimosCuatroDigitos(pago.getUltimosCuatroDigitos())
                .fechaCreacion(pago.getFechaCreacion())
                .fechaProcesamiento(pago.getFechaProcesamiento())
                .build();
    }
}
