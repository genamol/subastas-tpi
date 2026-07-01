package com.subastas.tpi.controller;

import com.subastas.tpi.dto.response.ImagenResponse;
import com.subastas.tpi.exception.BusinessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/imagenes")
public class ImagenController {

    private static final long MAX_SIZE = 5 * 1024 * 1024;
    private static final Set<String> TIPOS_PERMITIDOS = Set.of("image/jpeg", "image/png");

    @PostMapping("/upload")
    public ResponseEntity<ImagenResponse> upload(@RequestParam MultipartFile file) throws IOException {
        if (file.getSize() > MAX_SIZE) {
            throw new BusinessException("imagen.tamano.excedido", HttpStatus.BAD_REQUEST);
        }

        String contentType = file.getContentType();
        if (contentType == null || !TIPOS_PERMITIDOS.contains(contentType)) {
            throw new BusinessException("imagen.formato.invalido", HttpStatus.BAD_REQUEST);
        }

        String nombre = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path dir = Paths.get("uploads");
        Files.createDirectories(dir);
        Files.copy(file.getInputStream(), dir.resolve(nombre));

        return ResponseEntity.ok(new ImagenResponse("/uploads/" + nombre));
    }
}
