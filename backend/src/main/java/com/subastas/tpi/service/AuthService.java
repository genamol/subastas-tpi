package com.subastas.tpi.service;

import com.subastas.tpi.dto.request.LoginRequest;
import com.subastas.tpi.dto.request.RegisterRequest;
import com.subastas.tpi.dto.response.AuthResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {

    void register(RegisterRequest request);

    AuthResponse login(LoginRequest request, HttpServletResponse response);

    AuthResponse refresh(HttpServletRequest request, HttpServletResponse response);

    void logout(HttpServletRequest request, HttpServletResponse response);
}
