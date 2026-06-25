package com.subastas.tpi.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioPerfilResponse {

    private Long id;
    private String nombre;
    private String email;
    private String telefono;
    private List<String> roles;
    private Instant createdAt;
    private long totalPujas;
    private long totalSubastas;
}
