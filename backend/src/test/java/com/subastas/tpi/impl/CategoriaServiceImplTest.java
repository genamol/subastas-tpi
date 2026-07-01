package com.subastas.tpi.impl;

import com.subastas.tpi.dto.request.CategoriaRequest;
import com.subastas.tpi.dto.response.CategoriaResponse;
import com.subastas.tpi.exception.BusinessException;
import com.subastas.tpi.model.Categoria;
import com.subastas.tpi.repository.CategoriaRepository;
import com.subastas.tpi.repository.ProductoRepository;
import com.subastas.tpi.service.impl.CategoriaServiceImpl;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoriaServiceImplTest {

    @Mock
    private CategoriaRepository categoriaRepository;

    @Mock
    private ProductoRepository productoRepository;

    @InjectMocks
    private CategoriaServiceImpl categoriaService;

    @Test
    void crearCategoria_Exitosamente() {
        CategoriaRequest request = CategoriaRequest.builder()
                .nombre("Muebles")
                .descripcion("Muebles para el hogar")
                .build();

        Categoria categoriaGuardada = new Categoria();
        categoriaGuardada.setId(1L);
        categoriaGuardada.setNombre("Muebles");
        categoriaGuardada.setDescripcion("Muebles para el hogar");

        when(categoriaRepository.existsByNombre("Muebles")).thenReturn(false);
        when(categoriaRepository.save(any(Categoria.class))).thenReturn(categoriaGuardada);

        CategoriaResponse response = categoriaService.crear(request);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Muebles", response.getNombre());

        verify(categoriaRepository, times(1)).existsByNombre("Muebles");
        verify(categoriaRepository, times(1)).save(any(Categoria.class));
    }

    @Test
    void crearCategoria_Duplicada_LanzaException() {
        CategoriaRequest request = CategoriaRequest.builder()
                .nombre("Muebles")
                .build();

        when(categoriaRepository.existsByNombre("Muebles")).thenReturn(true);

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            categoriaService.crear(request);
        });

        assertEquals("categoria.nombre.duplicado", exception.getMessage());
        assertEquals(HttpStatus.CONFLICT, exception.getStatus());

        verify(categoriaRepository, never()).save(any(Categoria.class));
    }

    @Test
    void eliminarCategoria_ConProductos_LanzaException() {
        Long categoriaId = 1L;

        when(categoriaRepository.existsById(categoriaId)).thenReturn(true);
        when(productoRepository.existsByCategoriaId(categoriaId)).thenReturn(true);

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            categoriaService.eliminar(categoriaId);
        });

        assertEquals("categoria.con.productos", exception.getMessage());
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatus());

        verify(categoriaRepository, never()).deleteById(anyLong());
    }
}