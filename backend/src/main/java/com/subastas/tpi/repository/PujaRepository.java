package com.subastas.tpi.repository;

import com.subastas.tpi.model.Puja;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.Optional;

public interface PujaRepository extends JpaRepository<Puja, Long> {

    Page<Puja> findByOfertanteIdOrderByFechaPujaDesc(Long ofertanteId, Pageable pageable);

    Page<Puja> findBySubastaIdOrderByFechaPujaDesc(Long subastaId, Pageable pageable);

    long countByOfertanteId(Long ofertanteId);

    @Query("SELECT MAX(p.monto) FROM Puja p WHERE p.subasta.id = :subastaId AND p.ofertante.id = :ofertanteId")
    Optional<BigDecimal> findMejorMonto(@Param("subastaId") Long subastaId, @Param("ofertanteId") Long ofertanteId);

    @Query("""
        SELECT COUNT(DISTINCT p.ofertante.id) FROM Puja p
        WHERE p.subasta.id = :subastaId
        AND p.ofertante.id <> :usuarioId
        AND p.monto > :miMejorMonto
        """)
    long countBiddersAheadOf(@Param("subastaId") Long subastaId,
                              @Param("usuarioId") Long usuarioId,
                              @Param("miMejorMonto") BigDecimal miMejorMonto);
}
