package com.subastas.tpi.security;

import com.subastas.tpi.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JwtService {

    @Value("${jwt.secret-key}")
    private String secretKey;

    @Value("${jwt.access-expiration}")
    private long accessExpiration;

    @Value("${jwt.refresh-expiration}")
    private long refreshExpiration;

    public String generarAccessToken(Usuario usuario) {
        List<String> roles = usuario.getRoles().stream()
            .map(r -> r.getNombre().name())
            .collect(Collectors.toList());

        return Jwts.builder()
            .subject(String.valueOf(usuario.getId()))
            .claim("email", usuario.getEmail())
            .claim("roles", roles)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + accessExpiration))
            .signWith(getKey())
            .compact();
    }

    public String generarRefreshToken(Usuario usuario) {
        return Jwts.builder()
            .subject(String.valueOf(usuario.getId()))
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + refreshExpiration))
            .signWith(getKey())
            .compact();
    }

    public boolean esValido(String token) {
        try {
            getClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Long extraerUserId(String token) {
        return Long.parseLong(getClaims(token).getSubject());
    }

    public String extraerEmail(String token) {
        return getClaims(token).get("email", String.class);
    }

    @SuppressWarnings("unchecked")
    public List<String> extraerRoles(String token) {
        return getClaims(token).get("roles", List.class);
    }

    public Date extraerExpiracion(String token) {
        return getClaims(token).getExpiration();
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
            .verifyWith(getKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }
}
