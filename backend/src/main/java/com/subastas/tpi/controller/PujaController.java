package com.subastas.tpi.controller;

import com.subastas.tpi.dto.request.PujaRequest;
import com.subastas.tpi.dto.response.PujaResponse;
import com.subastas.tpi.model.Usuario;
import com.subastas.tpi.service.PujaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/pujas")
@RequiredArgsConstructor
public class PujaController {

    private final PujaService pujaService;

    @PostMapping
    public ResponseEntity<PujaResponse> registrar(@Valid @RequestBody PujaRequest request,
                                                   @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(pujaService.registrarPuja(request, usuario.getId()));
    }

    @GetMapping("/mis-pujas")
    public ResponseEntity<Page<PujaResponse>> misPujas(@AuthenticationPrincipal Usuario usuario,
                                                        Pageable pageable) {
        return ResponseEntity.ok(pujaService.obtenerMisPujas(usuario.getId(), pageable));
    }

    @GetMapping("/subasta/{subastaId}")
    public ResponseEntity<Page<PujaResponse>> porSubasta(@PathVariable Long subastaId,
                                                          @AuthenticationPrincipal Usuario usuario,
                                                          Pageable pageable) {
        boolean esAdmin = usuario.getRoles().stream()
            .anyMatch(r -> r.getNombre().name().equals("ADMIN"));
        return ResponseEntity.ok(pujaService.obtenerPujasPorSubasta(subastaId, usuario.getId(), esAdmin, pageable));
    }

    @GetMapping("/subasta/{subastaId}/mi-posicion")
    public ResponseEntity<Map<String, Integer>> miPosicion(@PathVariable Long subastaId,
                                                            @AuthenticationPrincipal Usuario usuario) {
        int posicion = pujaService.obtenerMiPosicion(subastaId, usuario.getId());
        return ResponseEntity.ok(Map.of("posicion", posicion));
    }
}
