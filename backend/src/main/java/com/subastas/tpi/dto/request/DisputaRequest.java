package com.subastas.tpi.dto.request;

import com.subastas.tpi.model.enums.TipoConflicto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DisputaRequest {

    @NotNull
    private Long subastaId;

    @NotNull
    private TipoConflicto tipo;

    @NotBlank
    private String descripcion;
}
