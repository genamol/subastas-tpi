package com.subastas.tpi.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PagoRequest {

    @NotBlank
    @Pattern(regexp = "\\d{16}", message = "El número de tarjeta debe tener 16 dígitos")
    private String numeroTarjeta;

    @NotBlank
    private String nombreTitular;

    @NotBlank
    @Pattern(regexp = "(0[1-9]|1[0-2])/\\d{2}", message = "Formato de vencimiento inválido (MM/AA)")
    private String vencimiento;

    @NotBlank
    @Size(min = 3, max = 4)
    private String cvv;

    @NotBlank
    private String medioPago; // "CREDITO" o "DEBITO"
}
