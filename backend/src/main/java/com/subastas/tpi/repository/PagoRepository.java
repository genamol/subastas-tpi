package com.subastas.tpi.repository;

import com.subastas.tpi.model.Pago;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PagoRepository extends JpaRepository<Pago, Long> {
    Optional<Pago> findBySubastaId(Long subastaId);
    boolean existsBySubastaId(Long subastaId);
}
