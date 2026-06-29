package com.subastas.tpi.controller;

import com.subastas.tpi.dto.request.ActualizarPerfilRequest;
import com.subastas.tpi.dto.response.UsuarioPerfilResponse;
import com.subastas.tpi.model.Usuario;
import com.subastas.tpi.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping("/me")
    public ResponseEntity<UsuarioPerfilResponse> miPerfil(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(usuarioService.obtenerPerfil(usuario.getId()));
    }

    @PutMapping("/me")
    public ResponseEntity<UsuarioPerfilResponse> actualizarPerfil(
            @Valid @RequestBody ActualizarPerfilRequest request,
            @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(usuarioService.actualizarPerfil(usuario.getId(), request));
    }
}
