package com.subastas.tpi.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
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
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {

    private int status;
    private String mensaje;
    private List<String> errores;
    private Instant timestamp;

    public static ErrorResponse of(int status, String mensaje) {
        return ErrorResponse.builder()
            .status(status)
            .mensaje(mensaje)
            .timestamp(Instant.now())
            .build();
    }

    public static ErrorResponse withErrors(int status, String mensaje, List<String> errores) {
        return ErrorResponse.builder()
            .status(status)
            .mensaje(mensaje)
            .errores(errores)
            .timestamp(Instant.now())
            .build();
    }
}
