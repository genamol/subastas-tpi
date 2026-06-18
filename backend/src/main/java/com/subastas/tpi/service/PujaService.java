package com.subastas.tpi.service;

import com.subastas.tpi.dto.request.PujaRequest;
import com.subastas.tpi.dto.response.PujaResponse;
import org.springframework.lang.NonNull;

public interface PujaService {

    PujaResponse pujar(@NonNull Long userId, PujaRequest request);
}
