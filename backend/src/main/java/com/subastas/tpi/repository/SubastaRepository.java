package com.subastas.tpi.repository;

import com.subastas.tpi.model.Subasta;
import com.subastas.tpi.model.enums.EstadoSubasta;
import jakarta.persistence.LockModeType;
import jakarta.persistence.QueryHint;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface SubastaRepository extends JpaRepository<Subasta, Long> {

    // Bloqueo pesimista para evitar colisiones al registrar pujas
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @QueryHints(@QueryHint( name = "jakarta.persistence.lock.timeout", value = "3000")) // Timeout de 3 segundos para el bloqueo
    @Query("SELECT s FROM Subasta s WHERE s.id = :id")
    Optional<Subasta> findByIdForUpdate(@Param("id") Long id);

    Page<Subasta> findByEstadoIn(List<EstadoSubasta> estados, Pageable pageable);

    List<Subasta> findByEstadoAndFechaInicioBefore(EstadoSubasta estado, Instant fecha);

    List<Subasta> findByEstadoAndFechaCierreBefore(EstadoSubasta estado, Instant fecha);
}
