package com.subastas.tpi.impl;

import com.subastas.tpi.dto.request.ProductoRequest;
import com.subastas.tpi.dto.response.ProductoResponse;
import com.subastas.tpi.exception.BusinessException;
import com.subastas.tpi.model.Categoria;
import com.subastas.tpi.model.Producto;
import com.subastas.tpi.model.Usuario;
import com.subastas.tpi.model.Rol;
import com.subastas.tpi.model.enums.RolNombre;
import com.subastas.tpi.repository.CategoriaRepository;
import com.subastas.tpi.repository.ProductoRepository;
import com.subastas.tpi.repository.SubastaRepository;
import com.subastas.tpi.repository.UsuarioRepository;
import com.subastas.tpi.service.impl.ProductoServiceImpl;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.util.Optional;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductoServiceImplTest {

    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private CategoriaRepository categoriaRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private SubastaRepository subastaRepository;

    @InjectMocks
    private ProductoServiceImpl productoService;

    @Test
    void crearProducto_Exitosamente() {
        // Arrange
        Long vendedorId = 1L;
        Long categoriaId = 2L;

        ProductoRequest request = ProductoRequest.builder()
                .nombre("Notebook")
                .descripcion("Core i5")
                .categoriaId(categoriaId)
                .imagenes(List.of("http://imagen.url"))
                .build();

        Usuario vendedor = new Usuario();
        vendedor.setId(vendedorId);
        vendedor.setNombre("Carlos");

        Categoria categoria = new Categoria();
        categoria.setId(categoriaId);
        categoria.setNombre("Tecnologia");

        Producto productoGuardado = new Producto();
        productoGuardado.setId(10L);
        productoGuardado.setNombre("Notebook");
        productoGuardado.setVendedor(vendedor);
        productoGuardado.setCategoria(categoria);

        when(usuarioRepository.findById(vendedorId)).thenReturn(Optional.of(vendedor));
        when(categoriaRepository.findById(categoriaId)).thenReturn(Optional.of(categoria));
        when(productoRepository.save(any(Producto.class))).thenReturn(productoGuardado);

        // Act
        ProductoResponse response = productoService.crear(request, vendedorId);

        // Assert
        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals("Notebook", response.getNombre());
        assertEquals(vendedorId, response.getVendedorId());

        verify(productoRepository, times(1)).save(any(Producto.class));
    }

    @Test
    void actualizarProducto_NoAutorizado_LanzaException() {
        // Arrange
        Long productoId = 10L;
        Long vendedorDuenoId = 1L;
        Long vendedorIntrusoId = 99L;

        ProductoRequest request = ProductoRequest.builder()
                .nombre("Notebook Modificada")
                .categoriaId(2L)
                .build();

        Usuario vendedorDueno = new Usuario();
        vendedorDueno.setId(vendedorDuenoId);

        Usuario vendedorIntruso = new Usuario();
        vendedorIntruso.setId(vendedorIntrusoId);

        Producto productoExistente = new Producto();
        productoExistente.setId(productoId);
        productoExistente.setVendedor(vendedorDueno);

        when(productoRepository.findById(productoId)).thenReturn(Optional.of(productoExistente));
        when(usuarioRepository.findById(vendedorIntrusoId)).thenReturn(Optional.of(vendedorIntruso));

        // Act & Assert
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            productoService.actualizar(productoId, request, vendedorIntrusoId);
        });

        assertEquals("producto.no.autorizado", exception.getMessage());
        assertEquals(HttpStatus.FORBIDDEN, exception.getStatus());

        verify(productoRepository, never()).save(any(Producto.class));
    }

    @Test
    void actualizarProducto_ComoDuenioConSubastaActiva_LanzaException() {
        // Arrange
        Long productoId = 10L;
        Long vendedorDuenoId = 1L;

        ProductoRequest request = ProductoRequest.builder()
                .nombre("Notebook Modificada")
                .categoriaId(2L)
                .build();

        Usuario vendedorDueno = new Usuario();
        vendedorDueno.setId(vendedorDuenoId);

        Producto productoExistente = new Producto();
        productoExistente.setId(productoId);
        productoExistente.setVendedor(vendedorDueno);

        when(productoRepository.findById(productoId)).thenReturn(Optional.of(productoExistente));
        when(usuarioRepository.findById(vendedorDuenoId)).thenReturn(Optional.of(vendedorDueno));
        
        // Simulamos que existe subasta activa/publicada
        when(subastaRepository.existsByProductoIdAndEstadoIn(eq(productoId), anyList())).thenReturn(true);

        // Act & Assert
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            productoService.actualizar(productoId, request, vendedorDuenoId);
        });

        assertEquals("producto.edicion.prohibida", exception.getMessage());
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatus());

        verify(productoRepository, never()).save(any(Producto.class));
    }

    @Test
    void actualizarProducto_ComoAdminConSubastaActiva_Exitosamente() {
        // Arrange
        Long productoId = 10L;
        Long adminId = 999L;
        Long categoriaId = 2L;

        ProductoRequest request = ProductoRequest.builder()
                .nombre("Notebook Modificada por Admin")
                .categoriaId(categoriaId)
                .imagenes(List.of("http://imagen.url"))
                .build();

        Usuario vendedorDueno = new Usuario();
        vendedorDueno.setId(1L);

        Usuario admin = new Usuario();
        admin.setId(adminId);
        Rol rolAdmin = new Rol();
        rolAdmin.setNombre(RolNombre.ADMIN);
        admin.setRoles(Set.of(rolAdmin));

        Categoria categoria = new Categoria();
        categoria.setId(categoriaId);
        categoria.setNombre("Tecnologia");

        Producto productoExistente = new Producto();
        productoExistente.setId(productoId);
        productoExistente.setVendedor(vendedorDueno);
        productoExistente.setCategoria(categoria);

        Producto productoGuardado = new Producto();
        productoGuardado.setId(productoId);
        productoGuardado.setNombre("Notebook Modificada por Admin");
        productoGuardado.setVendedor(vendedorDueno);
        productoGuardado.setCategoria(categoria);

        when(productoRepository.findById(productoId)).thenReturn(Optional.of(productoExistente));
        when(usuarioRepository.findById(adminId)).thenReturn(Optional.of(admin));
        when(categoriaRepository.findById(categoriaId)).thenReturn(Optional.of(categoria));
        when(productoRepository.save(any(Producto.class))).thenReturn(productoGuardado);

        // Act
        ProductoResponse response = productoService.actualizar(productoId, request, adminId);

        // Assert
        assertNotNull(response);
        assertEquals("Notebook Modificada por Admin", response.getNombre());
        verify(productoRepository, times(1)).save(any(Producto.class));
        verify(subastaRepository, never()).existsByProductoIdAndEstadoIn(anyLong(), anyList());
    }

    @Test
    void eliminarProducto_ConSubastaActiva_LanzaException() {
        // Arrange
        Long productoId = 10L;
        Long vendedorId = 1L;

        Usuario vendedor = new Usuario();
        vendedor.setId(vendedorId);

        Producto producto = new Producto();
        producto.setId(productoId);
        producto.setVendedor(vendedor);

        when(productoRepository.findById(productoId)).thenReturn(Optional.of(producto));
        when(subastaRepository.existsByProductoIdAndEstadoIn(eq(productoId), anyList())).thenReturn(true);

        // Act & Assert
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            productoService.eliminar(productoId, vendedorId);
        });

        assertEquals("producto.con.subasta.activa", exception.getMessage());
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatus());

        verify(productoRepository, never()).delete(any(Producto.class));
    }
}
