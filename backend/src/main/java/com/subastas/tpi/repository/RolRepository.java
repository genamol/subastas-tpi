package com.subastas.tpi.repository;

import com.subastas.tpi.model.Rol;
import com.subastas.tpi.model.enums.RolNombre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RolRepository extends JpaRepository<Rol, Long> {

    Optional<Rol> findByNombre(RolNombre nombre);
}
