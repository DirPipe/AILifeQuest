-- =============================================================================
-- SCRIPT DE SEMBRADO PARA AILIFEQUEST (Paso a paso garantizado)
-- =============================================================================

-- 1. USUARIOS DEMO (Contraseña demo: 123456)
INSERT INTO public.users (id, name, email, password_hash, status, total_xp, created_at, updated_at)
VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Alex Cyber', 'alex@lifequest.ai', '$2a$10$8.UnVuG9HHg73Jy1YA523O8H15.M2aOu3P0w5rA8n1I4e3M5zZ1uO', 'ACTIVE', 150, NOW(), NOW()),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Elena Rostova', 'elena@lifequest.ai', '$2a$10$8.UnVuG9HHg73Jy1YA523O8H15.M2aOu3P0w5rA8n1I4e3M5zZ1uO', 'ACTIVE', 0, NOW(), NOW()),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Carlos Dev', 'carlos@lifequest.ai', '$2a$10$8.UnVuG9HHg73Jy1YA523O8H15.M2aOu3P0w5rA8n1I4e3M5zZ1uO', 'ACTIVE', 0, NOW(), NOW()),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Maria Quest', 'maria@lifequest.ai', '$2a$10$8.UnVuG9HHg73Jy1YA523O8H15.M2aOu3P0w5rA8n1I4e3M5zZ1uO', 'ACTIVE', 0, NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET total_xp = EXCLUDED.total_xp, status = EXCLUDED.status;


-- 2. METAS DEMO (GOALS)
INSERT INTO public.goals (id, user_id, title, description, category, target_date, status, created_at, updated_at)
VALUES 
  ('b1fecb99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Demo - Dominar Arquitectura de Software', 'Practicar patrones, capas y buenas decisiones de diseño para proyectos empresariales.', 'Tecnología', '2026-11-30', 'ACTIVE', NOW(), NOW()),
  ('b1fecb99-9c0b-4ef8-bb6d-6bb9bd380a12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Demo - Mejorar rutina personal de estudio', 'Organizar sesiones de aprendizaje constantes durante la semana.', 'Estudios', '2026-12-15', 'ACTIVE', NOW(), NOW()),
  ('b1fecb99-9c0b-4ef8-bb6d-6bb9bd380a13', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Demo - Fortalecer hábitos saludables', 'Mantener energía y constancia con pequeñas acciones diarias.', 'Salud/Deporte', '2026-10-31', 'ACTIVE', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;


-- 3. RETOS DEMO (CHALLENGES)
INSERT INTO public.challenges (id, goal_id, title, description, xp_reward, sort_order, status, completed_at, created_at, updated_at)
VALUES 
  ('c2adcb99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b1fecb99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Repasar arquitectura por capas', 'Identificar responsabilidades de presentación, aplicación, dominio e infraestructura.', 50, 1, 'COMPLETED', NOW(), NOW(), NOW()),
  ('c2adcb99-9c0b-4ef8-bb6d-6bb9bd380a12', 'b1fecb99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Crear diagrama del sistema', 'Dibujar un flujo claro entre frontend, API y base de datos.', 100, 2, 'COMPLETED', NOW(), NOW(), NOW()),
  ('c2adcb99-9c0b-4ef8-bb6d-6bb9bd380a13', 'b1fecb99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Documentar decisiones técnicas', 'Escribir notas cortas sobre decisiones importantes del proyecto.', 50, 3, 'AVAILABLE', NULL, NOW(), NOW()),
  ('c2adcb99-9c0b-4ef8-bb6d-6bb9bd380a21', 'b1fecb99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Planear semana de estudio', 'Separar bloques de trabajo y descanso.', 25, 1, 'AVAILABLE', NULL, NOW(), NOW()),
  ('c2adcb99-9c0b-4ef8-bb6d-6bb9bd380a22', 'b1fecb99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Completar sesión profunda', 'Estudiar sin distracciones durante al menos una hora.', 50, 2, 'AVAILABLE', NULL, NOW(), NOW()),
  ('c2adcb99-9c0b-4ef8-bb6d-6bb9bd380a31', 'b1fecb99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Caminar 30 minutos', 'Realizar una caminata continua durante el día.', 25, 1, 'AVAILABLE', NULL, NOW(), NOW()),
  ('c2adcb99-9c0b-4ef8-bb6d-6bb9bd380a32', 'b1fecb99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Tomar agua suficiente', 'Cumplir una meta simple de hidratación.', 25, 2, 'AVAILABLE', NULL, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;


-- 4. PROGRESO DE METAS (GOAL_PROGRESS)
INSERT INTO public.goal_progress (id, goal_id, completed_challenges, total_challenges, progress_percentage, updated_at)
VALUES 
  ('d3becb99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b1fecb99-9c0b-4ef8-bb6d-6bb9bd380a11', 2, 3, 66.67, NOW()),
  ('d3becb99-9c0b-4ef8-bb6d-6bb9bd380a12', 'b1fecb99-9c0b-4ef8-bb6d-6bb9bd380a12', 0, 2, 0.0, NOW()),
  ('d3becb99-9c0b-4ef8-bb6d-6bb9bd380a13', 'b1fecb99-9c0b-4ef8-bb6d-6bb9bd380a13', 0, 2, 0.0, NOW())
ON CONFLICT (goal_id) DO UPDATE SET progress_percentage = EXCLUDED.progress_percentage;


-- 5. HISTORIAL DE XP (XP_TRANSACTIONS)
INSERT INTO public.xp_transactions (id, user_id, challenge_id, amount, reason, created_at)
VALUES 
  ('e4cfcb99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c2adcb99-9c0b-4ef8-bb6d-6bb9bd380a11', 50, 'Reto completado: Repasar arquitectura por capas', NOW()),
  ('e4cfcb99-9c0b-4ef8-bb6d-6bb9bd380a12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c2adcb99-9c0b-4ef8-bb6d-6bb9bd380a12', 100, 'Reto completado: Crear diagrama del sistema', NOW())
ON CONFLICT (id) DO NOTHING;