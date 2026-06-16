package com.subastas.tpi.repository;

import com.subastas.tpi.model.Disputa;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DisputaRepository extends JpaRepository<Disputa, Long> {

    Page<Disputa> findBySubastaId(Long subastaId, Pageable pageable);

    boolean existsBySubastaIdAndResolucionAdminIsNull(Long subastaId);
}
