package com.subastas.tpi.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "{register.nombre.requerido}")
    @Size(min = 2, max = 100, message = "{register.nombre.size}")
    private String nombre;

    @NotBlank(message = "{register.email.requerido}")
    @Email(message = "{register.email.invalido}")
    private String email;

    @NotBlank(message = "{register.password.requerido}")
    @Size(min = 8, max = 64, message = "{register.password.size}")
    private String password;
}
