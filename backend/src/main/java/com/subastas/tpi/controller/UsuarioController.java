package com.subastas.tpi.controller;

import com.subastas.tpi.dto.request.ActualizarPerfilRequest;
import com.subastas.tpi.dto.response.UsuarioPerfilResponse;
import com.subastas.tpi.exception.BusinessException;
import com.subastas.tpi.model.Usuario;
import com.subastas.tpi.repository.PujaRepository;
import com.subastas.tpi.repository.SubastaRepository;
import com.subastas.tpi.repository.UsuarioRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;
    private final PujaRepository pujaRepository;
    private final SubastaRepository subastaRepository;

    @GetMapping("/me")
    public ResponseEntity<UsuarioPerfilResponse> miPerfil(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(mapToPerfil(usuario));
    }

    @PutMapping("/me")
    public ResponseEntity<UsuarioPerfilResponse> actualizarPerfil(
            @Valid @RequestBody ActualizarPerfilRequest request,
            @AuthenticationPrincipal Usuario usuario) {

        Usuario u = usuarioRepository.findById(usuario.getId())
                .orElseThrow(() -> new BusinessException("usuario.no.encontrado", HttpStatus.NOT_FOUND));

        u.setNombre(request.getNombre());
        u.setTelefono(request.getTelefono());
        usuarioRepository.save(u);

        return ResponseEntity.ok(mapToPerfil(u));
    }

    private UsuarioPerfilResponse mapToPerfil(Usuario u) {
        long totalPujas = pujaRepository.countByOfertanteId(u.getId());
        long totalSubastas = subastaRepository.countByVendedorId(u.getId());

        return UsuarioPerfilResponse.builder()
                .id(u.getId())
                .nombre(u.getNombre())
                .email(u.getEmail())
                .telefono(u.getTelefono())
                .roles(u.getRoles().stream().map(r -> r.getNombre().name()).collect(Collectors.toList()))
                .createdAt(u.getCreatedAt())
                .totalPujas(totalPujas)
                .totalSubastas(totalSubastas)
                .build();
    }
}
