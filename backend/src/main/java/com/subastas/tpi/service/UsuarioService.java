package com.subastas.tpi.service;

import com.subastas.tpi.dto.response.UsuarioPerfilResponse;
import com.subastas.tpi.dto.request.ActualizarPerfilRequest;
import com.subastas.tpi.dto.response.UsuarioResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UsuarioService {

    UsuarioResponse obtenerPorId(Long id);

    Page<UsuarioResponse> listarTodos(Pageable pageable);

    void bloquear(Long id);

    void desbloquear(Long id);

    UsuarioPerfilResponse obtenerPerfil(Long userId);

    UsuarioPerfilResponse actualizarPerfil(Long userId, ActualizarPerfilRequest request);
}
