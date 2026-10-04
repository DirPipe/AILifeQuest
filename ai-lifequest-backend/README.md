# AI LifeQuest Backend

Backend Sprint 1 construido con Spring Boot 3, Java 17, JPA y PostgreSQL.

## Requisitos

- Java 17
- Maven
- Docker Desktop o Docker Engine con Docker Compose

## Configuracion

La conexion por defecto esta en `src/main/resources/application.properties` y puede cambiarse con variables de entorno:

```properties
spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5433/lifequest_db}
spring.datasource.username=${DB_USERNAME:lifequest}
spring.datasource.password=${DB_PASSWORD:lifequest_dev}
spring.jpa.hibernate.ddl-auto=update
```

Estos defaults coinciden con el contenedor Docker:

```text
base de datos: lifequest_db
usuario: lifequest
contraseña: lifequest_dev
puerto local: 5433
```

## PostgreSQL Local

La forma recomendada para el equipo es usar PostgreSQL con Docker. Asi todos trabajan con la misma base, usuario, password y puerto, sin depender de instalaciones personales.

Desde la raiz del repositorio:

```bash
docker compose up -d postgres
```

Docker crea automaticamente la base `lifequest_db` la primera vez que inicia el contenedor. Los datos quedan guardados en el volumen `ai-lifequest-postgres-data`.

Comandos utiles:

```bash
docker compose ps
docker compose down
docker compose down -v
```

Usa `docker compose down -v` solo si quieres borrar la base local y empezar desde cero.

Si el puerto `5433` esta ocupado, crea un archivo `.env` en la raiz del proyecto y cambia el puerto:

```text
POSTGRES_PORT=5434
```

Tambien exporta `DB_URL` con el mismo puerto antes de iniciar el backend:

```bash
export DB_URL=jdbc:postgresql://localhost:5434/lifequest_db
```

### Alternativa Sin Docker

Si alguien no puede usar Docker, puede instalar PostgreSQL manualmente en Linux o Windows y crear esta base:

```sql
CREATE USER lifequest WITH PASSWORD 'lifequest_dev';
CREATE DATABASE lifequest_db OWNER lifequest;
```

Como el backend apunta por defecto al contenedor en `localhost:5433`, para PostgreSQL instalado manualmente en el puerto clasico `5432` se debe iniciar la app con estas variables:

```bash
DB_URL=jdbc:postgresql://localhost:5432/lifequest_db \
DB_USERNAME=lifequest \
DB_PASSWORD=lifequest_dev \
mvn spring-boot:run
```

En PowerShell:

```powershell
$env:DB_URL="jdbc:postgresql://localhost:5432/lifequest_db"
$env:DB_USERNAME="lifequest"
$env:DB_PASSWORD="lifequest_dev"
mvn spring-boot:run
```

## Ejecutar

Primero levanta PostgreSQL desde la raiz del repositorio:

```bash
docker compose up -d postgres
```

Luego inicia la aplicacion desde esta carpeta:

```bash
mvn spring-boot:run
```

Hibernate/JPA creara o actualizara las tablas dentro de `lifequest_db`.

## Probar

```bash
mvn test
```

## Endpoints Sprint 1

| Metodo | Endpoint | Proposito |
|---|---|---|
| POST | `/api/auth/register` | Registrar usuario con `name`, `email` y `password`. |
| POST | `/api/auth/login` | Iniciar sesion con `email` y `password`. |
| GET | `/api/users?userId=...` | Consultar usuario por identificador. |
| POST | `/api/goals` | Crear meta asociada a un usuario. |
| GET | `/api/goals?userId=...` | Listar metas de un usuario. |
| POST | `/api/challenges` | Crear reto asociado a una meta. |
| GET | `/api/challenges?goalId=...` | Listar retos de una meta. |
| PATCH | `/api/challenges/complete` | Completar reto enviando `challengeId` en el body. |
