INSERT INTO roles (nombre) VALUES ('USER'), ('SELLER'), ('ADMIN') ON CONFLICT DO NOTHING;

INSERT INTO usuarios (nombre, email, password, telefono, bloqueado, created_at)
VALUES ('Admin', 'admin@subastas.com',
        '$2a$10$rS5QOs8i0GMok.zJfFqQYu.EAyLOWQpKPHGqCfKpMjVqzKFvS3NUS',
        '', false, NOW())
ON CONFLICT DO NOTHING;

INSERT INTO usuarios_roles (usuario_id, rol_id)
SELECT u.id, r.id FROM usuarios u, roles r
WHERE u.email = 'admin@subastas.com' AND r.nombre = 'ADMIN'
AND NOT EXISTS (SELECT 1 FROM usuarios_roles ur WHERE ur.usuario_id = u.id AND ur.rol_id = r.id);
