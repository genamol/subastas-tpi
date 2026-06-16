package com.subastas.tpi.service.impl;

import com.subastas.tpi.dto.request.CategoriaRequest;
import com.subastas.tpi.dto.response.CategoriaResponse;
import com.subastas.tpi.exception.BusinessException;
import com.subastas.tpi.model.Categoria;
import com.subastas.tpi.repository.CategoriaRepository;
import com.subastas.tpi.repository.ProductoRepository;
import com.subastas.tpi.service.CategoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriaServiceImpl implements CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;

    @Override
    @Transactional
    public CategoriaResponse crear(CategoriaRequest request) {
        if (categoriaRepository.existsByNombre(request.getNombre())) {
            throw new BusinessException("categoria.nombre.duplicado", HttpStatus.CONFLICT);
        }

        Categoria categoria = new Categoria();
        categoria.setNombre(request.getNombre());
        categoria.setDescripcion(request.getDescripcion());

        Categoria guardada = categoriaRepository.save(categoria);
        return mapToResponse(guardada);
    }

    @Override
    @Transactional
    public CategoriaResponse actualizar(Long id, CategoriaRequest request) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new BusinessException("categoria.no.encontrada", HttpStatus.NOT_FOUND));

        // Si se cambia el nombre, validar que el nuevo nombre no esté registrado por otra categoría
        if (!categoria.getNombre().equalsIgnoreCase(request.getNombre())
                && categoriaRepository.existsByNombre(request.getNombre())) {
            throw new BusinessException("categoria.nombre.duplicado", HttpStatus.CONFLICT);
        }

        categoria.setNombre(request.getNombre());
        categoria.setDescripcion(request.getDescripcion());

        Categoria actualizada = categoriaRepository.save(categoria);
        return mapToResponse(actualizada);
    }

    @Override
    @Transactional(readOnly = true)
    public CategoriaResponse obtenerPorId(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new BusinessException("categoria.no.encontrada", HttpStatus.NOT_FOUND));
        return mapToResponse(categoria);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoriaResponse> obtenerTodas() {
        return categoriaRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new BusinessException("categoria.no.encontrada", HttpStatus.NOT_FOUND);
        }

        // Regla de negocio crítica: No permitir eliminar una categoría si tiene productos asociados
        if (productoRepository.existsByCategoriaId(id)) {
            throw new BusinessException("categoria.con.productos", HttpStatus.BAD_REQUEST);
        }

        categoriaRepository.deleteById(id);
    }

    // Método helper para mapear la Entidad al DTO de Respuesta
    private CategoriaResponse mapToResponse(Categoria categoria) {
        return CategoriaResponse.builder()
                .id(categoria.getId())
                .nombre(categoria.getNombre())
                .descripcion(categoria.getDescripcion())
                .build();
    }
}