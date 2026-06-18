package com.subastas.tpi.service;

import com.subastas.tpi.dto.request.PujaRequest;
import com.subastas.tpi.dto.response.PujaResponse;

public interface PujaService {

    PujaResponse pujar(Long userId, PujaRequest request);
}
