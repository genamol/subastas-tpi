package com.subastas.tpi.repository;

import com.subastas.tpi.model.HistorialEstado;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistorialEstadoRepository extends JpaRepository<HistorialEstado, Long> {

    List<HistorialEstado> findBySubastaIdOrderByFechaAsc(Long subastaId);
}
