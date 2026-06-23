package com.subastas.tpi.controller;

import com.subastas.tpi.dto.response.UsuarioResponse;
import com.subastas.tpi.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UsuarioService usuarioService;

    @GetMapping("/usuarios")
    public ResponseEntity<Page<UsuarioResponse>> listarUsuarios(Pageable pageable) {
        return ResponseEntity.ok(usuarioService.listarTodos(pageable));
    }

    @GetMapping("/usuarios/{id}")
    public ResponseEntity<UsuarioResponse> obtenerUsuario(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.obtenerPorId(id));
    }

    @PutMapping("/usuarios/{id}/bloquear")
    public ResponseEntity<Void> bloquear(@PathVariable Long id) {
        usuarioService.bloquear(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/usuarios/{id}/desbloquear")
    public ResponseEntity<Void> desbloquear(@PathVariable Long id) {
        usuarioService.desbloquear(id);
        return ResponseEntity.noContent().build();
    }
}
