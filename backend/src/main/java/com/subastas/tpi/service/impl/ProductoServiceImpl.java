package com.subastas.tpi.service.impl;

import com.subastas.tpi.dto.request.ProductoRequest;
import com.subastas.tpi.dto.response.ProductoResponse;
import com.subastas.tpi.exception.BusinessException;
import com.subastas.tpi.model.Categoria;
import com.subastas.tpi.model.ImagenProducto;
import com.subastas.tpi.model.Producto;
import com.subastas.tpi.model.Usuario;
import com.subastas.tpi.model.enums.EstadoSubasta;
import com.subastas.tpi.model.enums.RolNombre;
import com.subastas.tpi.repository.CategoriaRepository;
import com.subastas.tpi.repository.ProductoRepository;
import com.subastas.tpi.repository.SubastaRepository;
import com.subastas.tpi.repository.UsuarioRepository;
import com.subastas.tpi.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

// usamos supress por los warnings de lombok si no hay que hacer el constructor manual
@SuppressWarnings("null")
@Service
@RequiredArgsConstructor
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final UsuarioRepository usuarioRepository;
    private final SubastaRepository subastaRepository;

    @Override
    @Transactional
    public ProductoResponse crear(ProductoRequest request, @NonNull Long vendedorId) {
        Usuario vendedor = usuarioRepository.findById(vendedorId)
                .orElseThrow(() -> new BusinessException("usuario.no.encontrado", HttpStatus.NOT_FOUND));

        if (vendedor.isBloqueado()) {
            throw new BusinessException("usuario.bloqueado", HttpStatus.FORBIDDEN);
        }

        Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                .orElseThrow(() -> new BusinessException("categoria.no.encontrada", HttpStatus.NOT_FOUND));

        Producto producto = new Producto();
        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setVendedor(vendedor);
        producto.setCategoria(categoria);

        if (request.getImagenes() != null) {
            List<ImagenProducto> imagenes = new ArrayList<>();
            for (int i = 0; i < request.getImagenes().size(); i++) {
                ImagenProducto img = new ImagenProducto();
                img.setUrl(request.getImagenes().get(i));
                img.setOrden(i + 1);
                img.setProducto(producto);
                imagenes.add(img);
            }
            producto.setImagenes(imagenes);
        }

        Producto guardado = productoRepository.save(producto);
        return mapToResponse(guardado);
    }

    @Override
    @Transactional
    public ProductoResponse actualizar(Long id, ProductoRequest request, Long vendedorId) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new BusinessException("producto.no.encontrado", HttpStatus.NOT_FOUND));

        Usuario usuario = usuarioRepository.findById(vendedorId)
                .orElseThrow(() -> new BusinessException("usuario.no.encontrado", HttpStatus.NOT_FOUND));

        boolean esAdmin = usuario.getRoles().stream()
                .anyMatch(rol -> rol.getNombre() == RolNombre.ADMIN);

        // Nadie puede editar un producto con subasta ACTIVA (protege a los pujadores)
        if (subastaRepository.existsByProductoIdAndEstadoIn(id, List.of(EstadoSubasta.ACTIVA))) {
            throw new BusinessException("producto.edicion.prohibida", HttpStatus.BAD_REQUEST);
        }

        if (!esAdmin) {
            if (!producto.getVendedor().getId().equals(vendedorId)) {
                throw new BusinessException("producto.no.autorizado", HttpStatus.FORBIDDEN);
            }

            List<EstadoSubasta> estadosRestringidos = List.of(
                    EstadoSubasta.PUBLICADA,
                    EstadoSubasta.FINALIZADA,
                    EstadoSubasta.ADJUDICADA,
                    EstadoSubasta.EN_DISPUTA
            );

            if (subastaRepository.existsByProductoIdAndEstadoIn(id, estadosRestringidos)) {
                throw new BusinessException("producto.edicion.prohibida", HttpStatus.BAD_REQUEST);
            }
        }

        Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                .orElseThrow(() -> new BusinessException("categoria.no.encontrada", HttpStatus.NOT_FOUND));

        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setCategoria(categoria);

        producto.getImagenes().clear();
        if (request.getImagenes() != null) {
            for (int i = 0; i < request.getImagenes().size(); i++) {
                ImagenProducto img = new ImagenProducto();
                img.setUrl(request.getImagenes().get(i));
                img.setOrden(i + 1);
                img.setProducto(producto);
                producto.getImagenes().add(img);
            }
        }

        Producto actualizado = productoRepository.save(producto);
        return mapToResponse(actualizado);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductoResponse obtenerPorId(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new BusinessException("producto.no.encontrado", HttpStatus.NOT_FOUND));
        return mapToResponse(producto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductoResponse> obtenerTodos(Pageable pageable) {
        return productoRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductoResponse> obtenerPorVendedor(Long vendedorId, Pageable pageable) {
        return productoRepository.findByVendedorId(vendedorId, pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional
    public void eliminar(Long id, Long vendedorId) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new BusinessException("producto.no.encontrado", HttpStatus.NOT_FOUND));

        Usuario usuario = usuarioRepository.findById(vendedorId)
                .orElseThrow(() -> new BusinessException("usuario.no.encontrado", HttpStatus.NOT_FOUND));
        boolean esAdmin = usuario.getRoles().stream()
                .anyMatch(rol -> rol.getNombre() == RolNombre.ADMIN);

        if (!esAdmin && !producto.getVendedor().getId().equals(vendedorId)) {
            throw new BusinessException("producto.no.autorizado", HttpStatus.FORBIDDEN);
        }

        List<EstadoSubasta> estadosActivos = List.of(
                EstadoSubasta.PUBLICADA,
                EstadoSubasta.ACTIVA,
                EstadoSubasta.ADJUDICADA,
                EstadoSubasta.EN_DISPUTA
        );
        if (subastaRepository.existsByProductoIdAndEstadoIn(id, estadosActivos)) {
            throw new BusinessException("producto.con.subasta.activa", HttpStatus.BAD_REQUEST);
        }

        productoRepository.delete(producto);
    }

    private ProductoResponse mapToResponse(Producto producto) {
        List<String> urlsImagenes = producto.getImagenes().stream()
                .map(ImagenProducto::getUrl)
                .toList();

        return ProductoResponse.builder()
                .id(producto.getId())
                .nombre(producto.getNombre())
                .descripcion(producto.getDescripcion())
                .createdAt(producto.getCreatedAt())
                .vendedorId(producto.getVendedor().getId())
                .vendedorNombre(producto.getVendedor().getNombre())
                .categoriaId(producto.getCategoria().getId())
                .categoriaNombre(producto.getCategoria().getNombre())
                .imagenes(urlsImagenes)
                .build();
    }
}