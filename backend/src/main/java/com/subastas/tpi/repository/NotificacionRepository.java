package com.subastas.tpi.repository;

import com.subastas.tpi.model.Notificacion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {

    Page<Notificacion> findByDestinatarioIdOrderByFechaCreacionDesc(Long destinatarioId, Pageable pageable);

    long countByDestinatarioIdAndLeidaFalse(Long destinatarioId);

    @Modifying
    @Query("UPDATE Notificacion n SET n.leida = true WHERE n.destinatario.id = :usuarioId AND n.leida = false")
    void marcarTodasComoLeidas(@Param("usuarioId") Long usuarioId);
}
