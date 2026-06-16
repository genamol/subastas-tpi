package com.subastas.tpi.repository;

import com.subastas.tpi.model.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    Page<Producto> findByVendedorId(Long vendedorId, Pageable pageable);
    boolean existsByCategoriaId(Long categoriaId);

}
