package com.subastas.tpi.controller;

import com.subastas.tpi.dto.response.ImagenResponse;
import com.subastas.tpi.exception.BusinessException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
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

    private final RestTemplate restTemplate;

    @Value("${storage.s3.endpoint:}")
    private String endpoint;

    @Value("${storage.s3.bucket:}")
    private String bucket;

    @Value("${storage.s3.access-key:}")
    private String accessKey;

    @Value("${storage.s3.secret-key:}")
    private String secretKey;

    public ImagenController() {
        this.restTemplate = new RestTemplate();
    }

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

        if (endpoint != null && !endpoint.isEmpty()) {
            return uploadS3(file, nombre, contentType);
        }
        return uploadLocal(file, nombre);
    }

    private ResponseEntity<ImagenResponse> uploadS3(MultipartFile file, String nombre, String contentType) throws IOException {
        String s3Url = endpoint + "/" + bucket + "/" + nombre;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(contentType));
        headers.setBasicAuth(accessKey, secretKey);

        HttpEntity<byte[]> request = new HttpEntity<>(file.getBytes(), headers);

        try {
            restTemplate.exchange(s3Url, HttpMethod.PUT, request, String.class);
        } catch (Exception e) {
            throw new BusinessException("imagen.error.upload", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return ResponseEntity.ok(new ImagenResponse(s3Url));
    }

    private ResponseEntity<ImagenResponse> uploadLocal(MultipartFile file, String nombre) throws IOException {
        Path dir = Paths.get("uploads");
        Files.createDirectories(dir);
        Path ruta = dir.resolve(nombre);
        Files.copy(file.getInputStream(), ruta);

        return ResponseEntity.ok(new ImagenResponse("/uploads/" + nombre));
    }
}
