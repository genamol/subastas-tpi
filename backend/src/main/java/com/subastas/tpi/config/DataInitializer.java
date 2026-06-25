package com.subastas.tpi.config;

import com.subastas.tpi.model.Categoria;
import com.subastas.tpi.model.Rol;
import com.subastas.tpi.model.Usuario;
import com.subastas.tpi.model.enums.RolNombre;
import com.subastas.tpi.repository.CategoriaRepository;
import com.subastas.tpi.repository.RolRepository;
import com.subastas.tpi.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final CategoriaRepository categoriaRepository;
    private final RolRepository rolRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        inicializarRoles();
        inicializarCategorias();
        inicializarAdmin();
    }

    private void inicializarRoles() {
        for (RolNombre nombre : RolNombre.values()) {
            if (rolRepository.findByNombre(nombre).isEmpty()) {
                Rol rol = new Rol();
                rol.setNombre(nombre);
                rolRepository.save(rol);
            }
        }
    }

    private void inicializarCategorias() {
        List<String[]> categorias = List.of(
            new String[]{"Electrónica", "Smartphones, laptops, tablets y más"},
            new String[]{"Vehículos", "Autos, motos y repuestos"},
            new String[]{"Inmuebles", "Casas, departamentos y terrenos"},
            new String[]{"Ropa y Accesorios", "Indumentaria y moda"},
            new String[]{"Hogar y Jardín", "Muebles, decoración y electrodomésticos"},
            new String[]{"Deportes", "Equipamiento deportivo y fitness"},
            new String[]{"Arte y Coleccionables", "Obras de arte, antigüedades y colecciones"},
            new String[]{"Herramientas", "Herramientas y maquinaria"},
            new String[]{"Libros y Música", "Libros, instrumentos y medios"},
            new String[]{"Otros", "Artículos varios"}
        );

        for (String[] cat : categorias) {
            if (categoriaRepository.findByNombre(cat[0]).isEmpty()) {
                Categoria categoria = new Categoria();
                categoria.setNombre(cat[0]);
                categoria.setDescripcion(cat[1]);
                categoriaRepository.save(categoria);
            }
        }
    }

    private void inicializarAdmin() {
        String adminEmail = "admin@subastas.com";
        if (usuarioRepository.findByEmail(adminEmail).isEmpty()) {
            Rol rolAdmin = rolRepository.findByNombre(RolNombre.ADMIN).orElseThrow();
            Rol rolUser = rolRepository.findByNombre(RolNombre.USER).orElseThrow();

            Usuario admin = new Usuario();
            admin.setNombre("Administrador");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode("Admin1234!"));
            admin.setTelefono("0000000000");
            admin.setRoles(Set.of(rolAdmin, rolUser));
            usuarioRepository.save(admin);
        }
    }
}
