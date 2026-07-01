package com.subastas.tpi.controller;

import com.subastas.tpi.dto.request.PagoRequest;
import com.subastas.tpi.dto.response.PagoResponse;
import com.subastas.tpi.model.Usuario;
import com.subastas.tpi.service.PagoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pagos")
@RequiredArgsConstructor
public class PagoController {

    private final PagoService pagoService;

    @PostMapping("/{subastaId}")
    public ResponseEntity<PagoResponse> procesarPago(@PathVariable Long subastaId,
                                                      @Valid @RequestBody PagoRequest request,
                                                      @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(pagoService.procesarPago(subastaId, request, usuario.getId()));
    }

    @GetMapping("/{subastaId}")
    public ResponseEntity<PagoResponse> obtenerPorSubasta(@PathVariable Long subastaId) {
        return ResponseEntity.ok(pagoService.obtenerPorSubasta(subastaId));
    }
}
