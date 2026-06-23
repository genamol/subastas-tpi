package com.subastas.tpi.model;

import com.subastas.tpi.model.enums.EstadoSubasta;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "subastas")
@Getter
@Setter
public class Subasta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal precioBase;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal montoActual;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal incrementoMinimo;

    @Column(nullable = false)
    private Instant fechaInicio;

    @Column(nullable = false)
    private Instant fechaCierre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoSubasta estado = EstadoSubasta.BORRADOR;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    private Instant fechaAdjudicacion;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vendedor_id", nullable = false)
    private Usuario vendedor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ganador_id")
    private Usuario ganador;

    @OneToMany(mappedBy = "subasta", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Puja> pujas = new ArrayList<>();

    @OneToMany(mappedBy = "subasta", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HistorialEstado> historialEstados = new ArrayList<>();

    @OneToMany(mappedBy = "subasta", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Notificacion> notificaciones = new ArrayList<>();
}
