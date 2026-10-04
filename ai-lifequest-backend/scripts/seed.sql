-- =============================================================================
-- SCRIPT DE SEMBRADO DE DATOS COMPLETO - AILIFEQUEST (seed.sql)
-- Credencial de acceso para todos los usuarios demo:
-- Emails: alex@lifequest.ai | elena@lifequest.ai | carlos@lifequest.ai | maria@lifequest.ai
-- Password: 123456 (Encriptado con SHA-256 compatible con tu Spring Boot)
-- Ejecución en DBeaver: Seleccionar todo y presionar Alt + X (Run Script)
-- =============================================================================

-- 1. LIMPIEZA TOTAL DE TABLAS
TRUNCATE TABLE 
  public.user_achievements,
  public.xp_transactions, 
  public.goal_progress, 
  public.challenges, 
  public.goals, 
  public.users,
  public.achievements 
CASCADE;


-- 2. LOGROS MAESTROS (ACHIEVEMENTS)
INSERT INTO public.achievements (id, active, code, condition_type, condition_value, created_at, description, name)
VALUES 
  ('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', true, 'FIRST_GOAL', 'CREATE_GOAL', 1, NOW(), 'Has creado tu primera meta en AILifeQuest.', 'Primer Paso'),
  ('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', true, 'ARCHITECT_LVL1', 'COMPLETE_CHALLENGE', 2, NOW(), 'Has completado 2 retos de arquitectura.', 'Arquitecto Junior'),
  ('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', true, 'XP_100', 'REACH_XP', 100, NOW(), 'Has acumulado tus primeros 100 puntos de experiencia.', 'Cazador de XP');


-- 3. USUARIOS DEMO (USERS)
-- Hash SHA-256 para "123456": 8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92
INSERT INTO public.users (id, name, email, password_hash, status, total_xp, created_at, updated_at)
VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Alex Cyber', 'alex@lifequest.ai', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'ACTIVE', 150, NOW(), NOW()),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Elena Rostova', 'elena@lifequest.ai', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'ACTIVE', 0, NOW(), NOW()),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Carlos Dev', 'carlos@lifequest.ai', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'ACTIVE', 0, NOW(), NOW()),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Maria Quest', 'maria@lifequest.ai', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'ACTIVE', 0, NOW(), NOW());


-- 4. LOGROS DESBLOQUEADOS DE USUARIOS (USER_ACHIEVEMENTS)
INSERT INTO public.user_achievements (id, achievement_id, user_id, unlocked_at)
VALUES 
  ('11eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW()),
  ('11eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW());


-- 5. METAS DEMO (GOALS)
INSERT INTO public.goals (id, user_id, title, description, category, target_date, status, created_at, updated_at)
VALUES 
  ('b1fecb99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Demo - Dominar Arquitectura de Software de alexcyber', 'Practicar patrones, capas y buenas decisiones de diseño para proyectos empresariales.', 'Tecnologia', '2026-11-30', 'ACTIVE', NOW(), NOW()),
  ('b1fecb99-9c0b-4ef8-bb6d-6bb9bd380a12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Demo - Mejorar rutina personal de estudio de alexcyber', 'Organizar sesiones de aprendizaje constantes durante la semana.', 'Estudios', '2026-12-15', 'ACTIVE', NOW(), NOW()),
  ('b1fecb99-9c0b-4ef8-bb6d-6bb9bd380a13', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Demo - Fortalecer habitos saludables de alexcyber', 'Mantener energia y constancia con pequenas acciones diarias.', 'Salud/Deporte', '2026-10-31', 'ACTIVE', NOW(), NOW());


-- 6. RETOS DEMO (CHALLENGES)
INSERT INTO public.challenges (id, goal_id, title, description, xp_reward, sort_order, status, completed_at, created_at, updated_at)
VALUES 
  ('c2adcb99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b1fecb99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Repasar arquitectura por capas', 'Identificar responsabilidades de presentacion, aplicacion, dominio e infraestructura.', 50, 1, 'COMPLETED', NOW(), NOW(), NOW()),
  ('c2adcb99-9c0b-4ef8-bb6d-6bb9bd380a12', 'b1fecb99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Crear diagrama del sistema', 'Dibujar un flujo claro entre frontend, API y base de datos.', 100, 2, 'COMPLETED', NOW(), NOW(), NOW()),
  ('c2adcb99-9c0b-4ef8-bb6d-6bb9bd380a13', 'b1fecb99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Documentar decisiones tecnicas', 'Escribir notas cortas sobre decisiones importantes del proyecto.', 50, 3, 'AVAILABLE', NULL, NOW(), NOW()),
  ('c2adcb99-9c0b-4ef8-bb6d-6bb9bd380a21', 'b1fecb99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Planear semana de estudio', 'Separar bloques de trabajo y descanso.', 25, 1, 'AVAILABLE', NULL, NOW(), NOW()),
  ('c2adcb99-9c0b-4ef8-bb6d-6bb9bd380a22', 'b1fecb99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Completar sesion profunda', 'Estudiar sin distracciones durante al menos una hora.', 50, 2, 'AVAILABLE', NULL, NOW(), NOW()),
  ('c2adcb99-9c0b-4ef8-bb6d-6bb9bd380a31', 'b1fecb99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Caminar 30 minutos', 'Realizar una caminata continua durante el dia.', 25, 1, 'AVAILABLE', NULL, NOW(), NOW()),
  ('c2adcb99-9c0b-4ef8-bb6d-6bb9bd380a32', 'b1fecb99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Tomar agua suficiente', 'Cumplir una meta simple de hidratacion.', 25, 2, 'AVAILABLE', NULL, NOW(), NOW());


-- 7. PROGRESO DE METAS (GOAL_PROGRESS)
INSERT INTO public.goal_progress (id, goal_id, completed_challenges, total_challenges, progress_percentage, updated_at)
VALUES 
  ('d3becb99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b1fecb99-9c0b-4ef8-bb6d-6bb9bd380a11', 2, 3, 66.67, NOW()),
  ('d3becb99-9c0b-4ef8-bb6d-6bb9bd380a12', 'b1fecb99-9c0b-4ef8-bb6d-6bb9bd380a12', 0, 2, 0.0, NOW()),
  ('d3becb99-9c0b-4ef8-bb6d-6bb9bd380a13', 'b1fecb99-9c0b-4ef8-bb6d-6bb9bd380a13', 0, 2, 0.0, NOW());


-- 8. TRANSACCIONES DE XP (XP_TRANSACTIONS)
INSERT INTO public.xp_transactions (id, user_id, challenge_id, amount, reason, created_at)
VALUES 
  ('e4cfcb99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c2adcb99-9c0b-4ef8-bb6d-6bb9bd380a11', 50, 'Reto completado: Repasar arquitectura por capas', NOW()),
  ('e4cfcb99-9c0b-4ef8-bb6d-6bb9bd380a12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c2adcb99-9c0b-4ef8-bb6d-6bb9bd380a12', 100, 'Reto completado: Crear diagrama del sistema', NOW());