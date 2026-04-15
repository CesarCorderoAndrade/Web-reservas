INSERT INTO users (id, email, password, role, "fullName", "createdAt", "updatedAt") 
VALUES (gen_random_uuid(), 'admin@estetica.com', 'admin123', 'admin', 'Administrador Local', NOW(), NOW());