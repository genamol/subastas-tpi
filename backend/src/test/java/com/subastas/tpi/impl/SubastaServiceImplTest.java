package com.subastas.tpi.impl;

import com.subastas.tpi.event.EstadoCambiadoEvent;
import com.subastas.tpi.service.impl.SubastaServiceImpl;

import com.subastas.tpi.dto.request.SubastaRequest;
import com.subastas.tpi.dto.response.SubastaResponse;
import com.subastas.tpi.exception.BusinessException;
import com.subastas.tpi.model.HistorialEstado;
import com.subastas.tpi.model.Producto;
import com.subastas.tpi.model.Puja;
import com.subastas.tpi.model.Subasta;
import com.subastas.tpi.model.Usuario;
import com.subastas.tpi.model.enums.EstadoSubasta;
import com.subastas.tpi.repository.HistorialEstadoRepository;
import com.subastas.tpi.repository.ProductoRepository;
import com.subastas.tpi.repository.SubastaRepository;
import com.subastas.tpi.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SubastaServiceImplTest {

    @Mock
    private SubastaRepository subastaRepository;

    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private HistorialEstadoRepository historialEstadoRepository;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private SubastaServiceImpl subastaService;

    @Test
    void crearSubasta_Exitosamente() {
        // Arrange
        Long vendedorId = 1L;
        Long productoId = 10L;

        Usuario vendedor = new Usuario();
        vendedor.setId(vendedorId);
        vendedor.setNombre("Carlos");

        Producto producto = new Producto();
        producto.setId(productoId);
        producto.setNombre("Notebook");
        producto.setVendedor(vendedor);

        SubastaRequest request = SubastaRequest.builder()
                .productoId(productoId)
                .precioBase(new BigDecimal("100.00"))
                .incrementoMinimo(new BigDecimal("5.00"))
                .fechaInicio(Instant.now().plus(1, ChronoUnit.HOURS))
                .fechaCierre(Instant.now().plus(2, ChronoUnit.HOURS))
                .descripcion("Subasta Notebook")
                .build();

        Subasta subastaGuardada = new Subasta();
        subastaGuardada.setId(100L);
        subastaGuardada.setPrecioBase(new BigDecimal("100.00"));
        subastaGuardada.setMontoActual(new BigDecimal("100.00"));
        subastaGuardada.setIncrementoMinimo(new BigDecimal("5.00"));
        subastaGuardada.setEstado(EstadoSubasta.BORRADOR);
        subastaGuardada.setProducto(producto);
        subastaGuardada.setVendedor(vendedor);

        when(usuarioRepository.findById(vendedorId)).thenReturn(Optional.of(vendedor));
        when(productoRepository.findById(productoId)).thenReturn(Optional.of(producto));
        when(subastaRepository.save(any(Subasta.class))).thenReturn(subastaGuardada);

        // Act
        SubastaResponse response = subastaService.crearSubasta(request, vendedorId);

        // Assert
        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals(EstadoSubasta.BORRADOR, response.getEstado());

        verify(subastaRepository, times(1)).save(any(Subasta.class));
        verify(historialEstadoRepository, times(1)).save(any(HistorialEstado.class));
    }

    @Test
    void publicarSubasta_Exitosamente() {
        // Arrange
        Long subastaId = 100L;
        Long vendedorId = 1L;

        Usuario vendedor = new Usuario();
        vendedor.setId(vendedorId);

        Producto producto = new Producto();
        producto.setId(10L);
        producto.setNombre("Notebook");

        Subasta subasta = new Subasta();
        subasta.setId(subastaId);
        subasta.setVendedor(vendedor);
        subasta.setProducto(producto);
        subasta.setEstado(EstadoSubasta.BORRADOR);

        when(subastaRepository.findById(subastaId)).thenReturn(Optional.of(subasta));
        when(subastaRepository.save(any(Subasta.class))).thenReturn(subasta);

        // Act
        SubastaResponse response = subastaService.publicarSubasta(subastaId, vendedorId);

        // Assert
        assertNotNull(response);
        assertEquals(EstadoSubasta.PUBLICADA, response.getEstado());

        verify(subastaRepository, times(1)).findById(subastaId);
        verify(subastaRepository, times(1)).save(any(Subasta.class));
        verify(historialEstadoRepository, times(1)).save(any(HistorialEstado.class));
        verify(eventPublisher, times(1)).publishEvent(any(EstadoCambiadoEvent.class));
    }

    @Test
    void cancelarSubasta_ConPujas_LanzaException() {
        // Arrange
        Long subastaId = 100L;
        Long vendedorId = 1L;

        Usuario vendedor = new Usuario();
        vendedor.setId(vendedorId);

        Subasta subasta = new Subasta();
        subasta.setId(subastaId);
        subasta.setVendedor(vendedor);
        subasta.setEstado(EstadoSubasta.ACTIVA);
        subasta.setPujas(List.of(new Puja()));

        when(subastaRepository.findById(subastaId)).thenReturn(Optional.of(subasta));

        // Act & Assert
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            subastaService.cancelarSubasta(subastaId, vendedorId);
        });

        assertEquals("subasta.tiene.pujas", exception.getMessage());
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatus());

        verify(subastaRepository, never()).save(any(Subasta.class));
    }
}