package com.subastas.tpi.repository;

import com.subastas.tpi.model.Calificacion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CalificacionRepository extends JpaRepository<Calificacion, Long> {

    Page<Calificacion> findByCalificadoIdOrderByFechaCreacionDesc(Long calificadoId, Pageable pageable);

    boolean existsBySubastaIdAndCalificadorId(Long subastaId, Long calificadorId);

    @Query("SELECT COALESCE(AVG(c.puntuacion), 0.0) FROM Calificacion c WHERE c.calificado.id = :calificadoId")
    Double findPromedioByCalificadoId(@Param("calificadoId") Long calificadoId);
}
