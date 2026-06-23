package com.subastas.tpi.service.impl;

import com.subastas.tpi.dto.request.LoginRequest;
import com.subastas.tpi.dto.request.RegisterRequest;
import com.subastas.tpi.dto.response.AuthResponse;
import com.subastas.tpi.exception.BusinessException;
import com.subastas.tpi.model.TokenBlacklist;
import com.subastas.tpi.model.Usuario;
import com.subastas.tpi.model.enums.RolNombre;
import com.subastas.tpi.repository.RolRepository;
import com.subastas.tpi.repository.TokenBlacklistRepository;
import com.subastas.tpi.repository.UsuarioRepository;
import com.subastas.tpi.security.JwtService;
import com.subastas.tpi.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Arrays;
import java.util.Set;

@Service
public class AuthServiceImpl implements AuthService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final TokenBlacklistRepository tokenBlacklistRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthServiceImpl(UsuarioRepository usuarioRepository,
                           RolRepository rolRepository,
                           TokenBlacklistRepository tokenBlacklistRepository,
                           JwtService jwtService,
                           PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.tokenBlacklistRepository = tokenBlacklistRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void register(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("El email ya está registrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setEmail(request.getEmail());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setTelefono(request.getTelefono());

        var rolUser = rolRepository.findByNombre(RolNombre.USER)
            .orElseThrow(() -> new BusinessException("Rol USER no encontrado"));
        var rolSeller = rolRepository.findByNombre(RolNombre.SELLER)
            .orElseThrow(() -> new BusinessException("Rol SELLER no encontrado"));

        usuario.setRoles(Set.of(rolUser, rolSeller));
        usuarioRepository.save(usuario);
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request, HttpServletResponse response) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new BusinessException("Credenciales inválidas", HttpStatus.UNAUTHORIZED));

        if (usuario.isBloqueado()) {
            throw new BusinessException("La cuenta está bloqueada", HttpStatus.FORBIDDEN);
        }

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new BusinessException("Credenciales inválidas", HttpStatus.UNAUTHORIZED);
        }

        String accessToken = jwtService.generarAccessToken(usuario);
        String refreshToken = jwtService.generarRefreshToken(usuario);

        agregarCookieRefresh(response, refreshToken);

        return AuthResponse.builder()
            .accessToken(accessToken)
            .build();
    }

    @Override
    @Transactional
    public AuthResponse refresh(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = extraerCookieRefresh(request);

        if (refreshToken == null || !jwtService.esValido(refreshToken)) {
            throw new BusinessException("Refresh token inválido", HttpStatus.UNAUTHORIZED);
        }

        if (tokenBlacklistRepository.existsByToken(refreshToken)) {
            throw new BusinessException("Sesión revocada", HttpStatus.UNAUTHORIZED);
        }

        Long userId = jwtService.extraerUserId(refreshToken);
        Usuario usuario = usuarioRepository.findById(userId)
            .orElseThrow(() -> new BusinessException("Usuario no encontrado", HttpStatus.UNAUTHORIZED));

        if (usuario.isBloqueado()) {
            throw new BusinessException("La cuenta está bloqueada", HttpStatus.FORBIDDEN);
        }

        String nuevoAccessToken = jwtService.generarAccessToken(usuario);
        String nuevoRefreshToken = jwtService.generarRefreshToken(usuario);

        revocarToken(refreshToken);
        agregarCookieRefresh(response, nuevoRefreshToken);

        return AuthResponse.builder()
            .accessToken(nuevoAccessToken)
            .build();
    }

    @Override
    @Transactional
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = extraerCookieRefresh(request);

        if (refreshToken != null && jwtService.esValido(refreshToken)) {
            revocarToken(refreshToken);
        }

        eliminarCookieRefresh(response);
    }

    private void revocarToken(String token) {
        TokenBlacklist blacklist = new TokenBlacklist();
        blacklist.setToken(token);
        blacklist.setExpiresAt(jwtService.extraerExpiracion(token).toInstant());
        tokenBlacklistRepository.save(blacklist);
    }

    private void agregarCookieRefresh(HttpServletResponse response, String refreshToken) {
        Cookie cookie = new Cookie("refresh_token", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setPath("/api/auth/refresh");
        cookie.setMaxAge(7 * 24 * 60 * 60);
        response.addCookie(cookie);
    }

    private void eliminarCookieRefresh(HttpServletResponse response) {
        Cookie cookie = new Cookie("refresh_token", "");
        cookie.setHttpOnly(true);
        cookie.setPath("/api/auth/refresh");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }

    private String extraerCookieRefresh(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        return Arrays.stream(request.getCookies())
            .filter(c -> "refresh_token".equals(c.getName()))
            .map(Cookie::getValue)
            .findFirst()
            .orElse(null);
    }
}
