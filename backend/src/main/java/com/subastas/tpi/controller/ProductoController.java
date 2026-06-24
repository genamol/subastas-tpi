package com.subastas.tpi.controller;

import com.subastas.tpi.dto.request.ProductoRequest;
import com.subastas.tpi.dto.response.ProductoResponse;
import com.subastas.tpi.model.Usuario;
import com.subastas.tpi.service.ProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    @GetMapping
    public ResponseEntity<Page<ProductoResponse>> listarTodos(Pageable pageable) {
        return ResponseEntity.ok(productoService.obtenerTodos(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoResponse> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.obtenerPorId(id));
    }

    @GetMapping("/mis-productos")
    public ResponseEntity<Page<ProductoResponse>> misProductos(@AuthenticationPrincipal Usuario usuario,
                                                               Pageable pageable) {
        return ResponseEntity.ok(productoService.obtenerPorVendedor(usuario.getId(), pageable));
    }

    @PostMapping
    public ResponseEntity<ProductoResponse> crear(@Valid @RequestBody ProductoRequest request,
                                                  @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(productoService.crear(request, usuario.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductoResponse> actualizar(@PathVariable Long id,
                                                       @Valid @RequestBody ProductoRequest request,
                                                       @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(productoService.actualizar(id, request, usuario.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id,
                                         @AuthenticationPrincipal Usuario usuario) {
        productoService.eliminar(id, usuario.getId());
        return ResponseEntity.noContent().build();
    }
}
