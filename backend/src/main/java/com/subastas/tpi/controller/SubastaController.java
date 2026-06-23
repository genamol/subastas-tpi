package com.subastas.tpi.controller;

import com.subastas.tpi.dto.request.SubastaRequest;
import com.subastas.tpi.dto.response.ErrorResponse;
import com.subastas.tpi.dto.response.SubastaResponse;
import com.subastas.tpi.service.SubastaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

@Tag(name = "Subastas", description = "Gestión y consulta de subastas")
@RestController
@RequestMapping("/api/subastas")
@RequiredArgsConstructor
public class SubastaController {

    private final SubastaService subastaService;

    @Operation(summary = "Crear una nueva subasta (BORRADOR)")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Subasta creada"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Producto no encontrado",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping
    public ResponseEntity<SubastaResponse> crear(@Valid @RequestBody SubastaRequest request,
                                                  Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        SubastaResponse response = subastaService.crearSubasta(request, Objects.requireNonNull(userId));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Publicar una subasta (BORRADOR → PUBLICADA)")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Subasta publicada"),
        @ApiResponse(responseCode = "403", description = "Solo el vendedor puede publicar"),
        @ApiResponse(responseCode = "404", description = "Subasta no encontrada")
    })
    @PutMapping("/{id}/publicar")
    public ResponseEntity<SubastaResponse> publicar(@PathVariable Long id,
                                                     Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        SubastaResponse response = subastaService.publicarSubasta(Objects.requireNonNull(id), Objects.requireNonNull(userId));
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Cancelar una subasta (PUBLICADA/ACTIVA → CANCELADA)")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Subasta cancelada"),
        @ApiResponse(responseCode = "400", description = "Estado no cancelable"),
        @ApiResponse(responseCode = "403", description = "Sin permisos para cancelar"),
        @ApiResponse(responseCode = "404", description = "Subasta no encontrada")
    })
    @PutMapping("/{id}/cancelar")
    public ResponseEntity<SubastaResponse> cancelar(@PathVariable Long id,
                                                     @RequestParam(required = false) String motivo,
                                                     Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        SubastaResponse response = subastaService.cancelarSubasta(Objects.requireNonNull(id), Objects.requireNonNull(userId));
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Listar subastas públicas")
    @GetMapping
    public ResponseEntity<Page<SubastaResponse>> obtenerTodas(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(subastaService.obtenerTodas(pageable));
    }

    @Operation(summary = "Ver detalle de una subasta")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Detalle de subasta"),
        @ApiResponse(responseCode = "404", description = "Subasta no encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<SubastaResponse> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(subastaService.obtenerPorId(Objects.requireNonNull(id)));
    }
}
