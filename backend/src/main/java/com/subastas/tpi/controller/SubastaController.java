package com.subastas.tpi.controller;

import com.subastas.tpi.dto.request.SubastaRequest;
import com.subastas.tpi.dto.response.HistorialEstadoResponse;
import com.subastas.tpi.dto.response.SubastaResponse;
import com.subastas.tpi.model.Usuario;
import com.subastas.tpi.service.SubastaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subastas")
@RequiredArgsConstructor
public class SubastaController {

    private final SubastaService subastaService;

    @GetMapping
    public ResponseEntity<Page<SubastaResponse>> listar(Pageable pageable) {
        return ResponseEntity.ok(subastaService.obtenerTodas(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubastaResponse> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(subastaService.obtenerPorId(id));
    }

    @PreAuthorize("hasRole('SELLER')")
    @PostMapping
    public ResponseEntity<SubastaResponse> crear(@Valid @RequestBody SubastaRequest request,
                                                  @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(subastaService.crearSubasta(request, usuario.getId()));
    }

    @PreAuthorize("hasRole('SELLER')")
    @PutMapping("/{id}/publicar")
    public ResponseEntity<SubastaResponse> publicar(@PathVariable Long id,
                                                     @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(subastaService.publicarSubasta(id, usuario.getId()));
    }

    @PutMapping("/{id}/cancelar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SubastaResponse> cancelar(@PathVariable Long id,
                                                     @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(subastaService.cancelarSubastaAdmin(id, usuario.getId()));
    }

    @GetMapping("/mis-subastas")
    public ResponseEntity<Page<SubastaResponse>> misSubastas(@AuthenticationPrincipal Usuario usuario,
                                                              Pageable pageable) {
        return ResponseEntity.ok(subastaService.obtenerMisSubastas(usuario.getId(), pageable));
    }

    @PutMapping("/{id}/cancelar-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SubastaResponse> cancelarAdmin(@PathVariable Long id,
                                                          @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(subastaService.cancelarSubastaAdmin(id, usuario.getId()));
    }

    @GetMapping("/{id}/historial")
    public ResponseEntity<List<HistorialEstadoResponse>> historial(@PathVariable Long id) {
        return ResponseEntity.ok(subastaService.obtenerHistorial(id));
    }
}
