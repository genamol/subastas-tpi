package com.subastas.tpi.service.impl;

import com.subastas.tpi.dto.request.ActualizarPerfilRequest;
import com.subastas.tpi.dto.response.UsuarioPerfilResponse;
import com.subastas.tpi.dto.response.UsuarioPublicoResponse;
import com.subastas.tpi.dto.response.UsuarioResponse;
import com.subastas.tpi.exception.BusinessException;
import com.subastas.tpi.model.Usuario;
import com.subastas.tpi.repository.PujaRepository;
import com.subastas.tpi.repository.SubastaRepository;
import com.subastas.tpi.repository.UsuarioRepository;
import com.subastas.tpi.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PujaRepository pujaRepository;
    private final SubastaRepository subastaRepository;

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

    @Override
    @Transactional(readOnly = true)
    public UsuarioPublicoResponse obtenerPerfilPublico(Long id) {
        Usuario u = buscarOFallar(id);
        long totalPujas = pujaRepository.countByOfertanteId(u.getId());
        long totalSubastas = subastaRepository.countByVendedorId(u.getId());
        return UsuarioPublicoResponse.builder()
                .id(u.getId())
                .nombre(u.getNombre())
                .roles(u.getRoles().stream().map(r -> r.getNombre().name()).toList())
                .createdAt(u.getCreatedAt())
                .totalPujas(totalPujas)
                .totalSubastas(totalSubastas)
                .build();
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

    @Override
    @Transactional(readOnly = true)
    public UsuarioPerfilResponse obtenerPerfil(Long userId) {
        Usuario u = usuarioRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("usuario.no.encontrado", HttpStatus.NOT_FOUND));

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

    @Override
    @Transactional
    public UsuarioPerfilResponse actualizarPerfil(Long userId, ActualizarPerfilRequest request) {
        Usuario u = usuarioRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("usuario.no.encontrado", HttpStatus.NOT_FOUND));

        u.setNombre(request.getNombre());
        u.setTelefono(request.getTelefono());
        usuarioRepository.save(u);

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
