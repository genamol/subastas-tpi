package com.subastas.tpi.model;

import com.subastas.tpi.model.enums.TipoConflicto;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "disputas")
@Getter
@Setter
public class Disputa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoConflicto tipo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    @Column(columnDefinition = "TEXT")
    private String resolucionAdmin;

    @Column(nullable = false)
    private Instant fechaCreacion = Instant.now();

    private Instant fechaResolucion;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "subasta_id", nullable = false)
    private Subasta subasta;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "iniciador_id", nullable = false)
    private Usuario iniciador;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resoltor_id")
    private Usuario resoltor;
}
