package com.subastas.tpi.repository;

import com.subastas.tpi.model.Calificacion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CalificacionRepository extends JpaRepository<Calificacion, Long> {

    Page<Calificacion> findByCalificadoIdOrderByFechaCreacionDesc(Long calificadoId, Pageable pageable);

    boolean existsBySubastaIdAndCalificadorId(Long subastaId, Long calificadorId);
}
