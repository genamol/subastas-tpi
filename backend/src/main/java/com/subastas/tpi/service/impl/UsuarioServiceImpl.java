package com.subastas.tpi.service.impl;

import com.subastas.tpi.dto.response.UsuarioResponse;
import com.subastas.tpi.exception.BusinessException;
import com.subastas.tpi.model.Usuario;
import com.subastas.tpi.repository.UsuarioRepository;
import com.subastas.tpi.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;

    @Override
    @Transactional(readOnly = true)
    public UsuarioResponse obtenerPorId(Long id) {
        return mapToResponse(buscarOFallar(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UsuarioResponse> listarTodos(Pageable pageable) {
        return usuarioRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional
    public void bloquear(Long id) {
        Usuario usuario = buscarOFallar(id);
        if (usuario.isBloqueado()) {
            throw new BusinessException("usuario.ya.bloqueado");
        }
        usuario.setBloqueado(true);
        usuarioRepository.save(usuario);
    }

    @Override
    @Transactional
    public void desbloquear(Long id) {
        Usuario usuario = buscarOFallar(id);
        if (!usuario.isBloqueado()) {
            throw new BusinessException("usuario.no.bloqueado");
        }
        usuario.setBloqueado(false);
        usuarioRepository.save(usuario);
    }

    private Usuario buscarOFallar(Long id) {
        return usuarioRepository.findById(id)
            .orElseThrow(() -> new BusinessException("usuario.no.encontrado", HttpStatus.NOT_FOUND));
    }

    private UsuarioResponse mapToResponse(Usuario usuario) {
        List<String> roles = usuario.getRoles().stream()
            .map(r -> r.getNombre().name())
            .toList();

        return UsuarioResponse.builder()
            .id(usuario.getId())
            .nombre(usuario.getNombre())
            .email(usuario.getEmail())
            .telefono(usuario.getTelefono())
            .bloqueado(usuario.isBloqueado())
            .createdAt(usuario.getCreatedAt())
            .roles(roles)
            .build();
    }
}
