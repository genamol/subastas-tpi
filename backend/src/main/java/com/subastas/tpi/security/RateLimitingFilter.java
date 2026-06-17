package com.subastas.tpi.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final Duration VENTANA = Duration.ofMinutes(1);

    private final ConcurrentHashMap<String, Deque<Instant>> contadores = new ConcurrentHashMap<>();

    private final Map<String, Integer> limites = Map.of(
        "POST:/api/auth/login", 10,
        "POST:/api/auth/register", 5,
        "POST:/api/auth/refresh", 20,
        "POST:/api/pujas", 30,
        "POST:/api/tickets", 10
    );

    // Referencia al JwtService para resolver userId en endpoints privados
    private final JwtService jwtService;

    public RateLimitingFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain chain)
            throws ServletException, IOException {

        String rutaClave = request.getMethod() + ":" + request.getRequestURI();
        Integer limite = limites.get(rutaClave);

        if (limite == null) {
            chain.doFilter(request, response);
            return;
        }

        String clave = resolverClave(request);
        if (!permitir(clave, limite)) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setHeader("Retry-After", "60");
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"rate.limit.exceeded\"}");
            return;
        }

        chain.doFilter(request, response);
    }

    private boolean permitir(String clave, int limite) {
        Instant ahora = Instant.now();
        Instant inicio = ahora.minus(VENTANA);

        Deque<Instant> timestamps = contadores.computeIfAbsent(clave,
                k -> new ArrayDeque<>());

        synchronized (timestamps) {
            // Descarta los timestamps fuera de la ventana de 1 minuto
            while (!timestamps.isEmpty() && timestamps.peekFirst().isBefore(inicio)) {
                timestamps.pollFirst();
            }
            if (timestamps.size() >= limite) {
                return false;
            }
            timestamps.addLast(ahora);
            return true;
        }
    }

    private String resolverClave(HttpServletRequest request) {
        String auth = request.getHeader("Authorization");
        if (auth != null && auth.startsWith("Bearer ")) {
            String token = auth.substring(7);
            if (jwtService.isTokenValid(token)) {
                return "user:" + jwtService.extractUserId(token);
            }
        }
        return "ip:" + request.getRemoteAddr();
    }
}
