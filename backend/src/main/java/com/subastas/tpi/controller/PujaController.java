package com.subastas.tpi.controller;

import com.subastas.tpi.dto.request.PujaRequest;
import com.subastas.tpi.dto.response.ErrorResponse;
import com.subastas.tpi.dto.response.PujaResponse;
import com.subastas.tpi.service.PujaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Pujas", description = "Registro de pujas en subastas activas")
@RestController
@RequestMapping("/api/pujas")
@RequiredArgsConstructor
public class PujaController {

    private final PujaService pujaService;

    @Operation(summary = "Registrar una nueva puja en una subasta activa")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Puja registrada exitosamente"),
        @ApiResponse(responseCode = "400", description = "Subasta no activa, expirada o monto insuficiente",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Subasta no encontrada",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "429", description = "Rate limit excedido (30 pujas/minuto)")
    })
    @PostMapping
    public ResponseEntity<PujaResponse> pujar(@Valid @RequestBody PujaRequest request,
                                              Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        PujaResponse response = pujaService.pujar(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
