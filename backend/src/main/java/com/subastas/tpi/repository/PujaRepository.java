package com.subastas.tpi.repository;

import com.subastas.tpi.model.Puja;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PujaRepository extends JpaRepository<Puja, Long> {

    Page<Puja> findByOfertanteIdOrderByFechaPujaDesc(Long ofertanteId, Pageable pageable);

    Page<Puja> findBySubastaIdOrderByFechaPujaDesc(Long subastaId, Pageable pageable);
}
