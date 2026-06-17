package com.subastas.tpi.service.impl;

import com.subastas.tpi.dto.request.LoginRequest;
import com.subastas.tpi.dto.request.RegisterRequest;
import com.subastas.tpi.dto.response.AuthResponse;
import com.subastas.tpi.exception.BusinessException;
import com.subastas.tpi.model.Rol;
import com.subastas.tpi.model.TokenBlacklist;
import com.subastas.tpi.model.Usuario;
import com.subastas.tpi.model.enums.RolNombre;
import com.subastas.tpi.repository.RolRepository;
import com.subastas.tpi.repository.TokenBlacklistRepository;
import com.subastas.tpi.repository.UsuarioRepository;
import com.subastas.tpi.security.JwtService;
import com.subastas.tpi.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final TokenBlacklistRepository tokenBlacklistRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void register(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("auth.email.duplicado", HttpStatus.CONFLICT);
        }

        Rol rolUser = rolRepository.findByNombre(RolNombre.USER)
                .orElseThrow(() -> new BusinessException("rol.no.encontrado"));
        Rol rolSeller = rolRepository.findByNombre(RolNombre.SELLER)
                .orElseThrow(() -> new BusinessException("rol.no.encontrado"));

        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setEmail(request.getEmail());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setRoles(Set.of(rolUser, rolSeller));

        usuarioRepository.save(usuario);
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request, HttpServletResponse response) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException("auth.credenciales.invalidas",
                        HttpStatus.UNAUTHORIZED));

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new BusinessException("auth.credenciales.invalidas", HttpStatus.UNAUTHORIZED);
        }

        if (usuario.isBloqueado()) {
            throw new BusinessException("usuario.bloqueado", HttpStatus.FORBIDDEN);
        }

        List<String> roles = usuario.getRoles().stream()
                .map(r -> r.getNombre().name())
                .toList();

        String accessToken = jwtService.generateAccessToken(
                usuario.getId(), usuario.getEmail(), roles);
        String refreshToken = jwtService.generateRefreshToken(usuario.getId());

        setRefreshCookie(response, refreshToken, 604800); // 7 días

        return AuthResponse.builder()
                .accessToken(accessToken)
                .email(usuario.getEmail())
                .nombre(usuario.getNombre())
                .build();
    }

    @Override
    @Transactional
    public AuthResponse refresh(String refreshToken, HttpServletResponse response) {
        if (!jwtService.isTokenValid(refreshToken)) {
            throw new BusinessException("token.invalido", HttpStatus.UNAUTHORIZED);
        }

        // Verifica que no esté en la blacklist
        if (tokenBlacklistRepository.existsByToken(refreshToken)) {
            throw new BusinessException("token.invalido", HttpStatus.UNAUTHORIZED);
        }

        Long userId = jwtService.extractUserId(refreshToken);
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("usuario.no.encontrado",
                        HttpStatus.UNAUTHORIZED));

        if (usuario.isBloqueado()) {
            throw new BusinessException("usuario.bloqueado", HttpStatus.FORBIDDEN);
        }

        List<String> roles = usuario.getRoles().stream()
                .map(r -> r.getNombre().name())
                .toList();

        // Revoca el refresh token usado y emite uno nuevo (rotación)
        TokenBlacklist blacklist = new TokenBlacklist();
        blacklist.setToken(refreshToken);
        // expira cuando expiraba el token original
        blacklist.setExpiresAt(jwtService.validateToken(refreshToken).getExpiration().toInstant());
        tokenBlacklistRepository.save(blacklist);

        String newAccessToken = jwtService.generateAccessToken(
                usuario.getId(), usuario.getEmail(), roles);
        String newRefreshToken = jwtService.generateRefreshToken(usuario.getId());

        setRefreshCookie(response, newRefreshToken, 604800);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .email(usuario.getEmail())
                .nombre(usuario.getNombre())
                .build();
    }

    @Override
    @Transactional
    public void logout(String refreshToken, HttpServletResponse response) {
        if (refreshToken != null && jwtService.isTokenValid(refreshToken)) {
            TokenBlacklist blacklist = new TokenBlacklist();
            blacklist.setToken(refreshToken);
            blacklist.setExpiresAt(
                    jwtService.validateToken(refreshToken).getExpiration().toInstant());
            tokenBlacklistRepository.save(blacklist);
        }

        // Borra la cookie
        Cookie cookie = new Cookie("refresh_token", "");
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // true solo en producción con HTTPS
        cookie.setPath("/api/auth/refresh");
        cookie.setMaxAge(0);
        cookie.setAttribute("SameSite", "Strict");
        response.addCookie(cookie);
    }

    private void setRefreshCookie(HttpServletResponse response, String token, int maxAge) {
        Cookie cookie = new Cookie("refresh_token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // true solo en producción con HTTPS
        cookie.setPath("/api/auth/refresh");
        cookie.setMaxAge(maxAge);
        cookie.setAttribute("SameSite", "Strict");
        response.addCookie(cookie);
    }
}
