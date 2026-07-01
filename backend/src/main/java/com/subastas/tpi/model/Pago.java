package com.subastas.tpi.model;

import com.subastas.tpi.model.enums.EstadoPago;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "pagos")
@Getter
@Setter
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "subasta_id", nullable = false, unique = true)
    private Subasta subasta;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "comprador_id", nullable = false)
    private Usuario comprador;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal monto;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPago estado;

    @Column(length = 4)
    private String ultimosCuatroDigitos;

    @Column(length = 20)
    private String medioPago;

    @Column(nullable = false)
    private Instant fechaCreacion = Instant.now();

    private Instant fechaProcesamiento;
}
