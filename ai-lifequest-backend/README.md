# AI LifeQuest Backend

Backend Sprint 1 construido con Spring Boot 3, Java 17, JPA y PostgreSQL.

## Requisitos

- Java 17
- Maven
- PostgreSQL con una base creada llamada `lifequest_db`

Guias de instalacion de PostgreSQL:

- Linux Mint/Ubuntu: `POSTGRES_SETUP.md`
- Windows: `POSTGRES_SETUP_WINDOWS.md`

## Configuracion

La conexion por defecto esta en `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/lifequest_db
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update
```

## Ejecutar

Primero asegúrate de tener PostgreSQL corriendo y la base `lifequest_db` creada.
Luego inicia la aplicacion:

```bash
mvn spring-boot:run
```

Verifica que el usuario/password sean `postgres/postgres`, o cambia esos valores en `src/main/resources/application.properties`.

Si aparece un error de conexion a PostgreSQL, revisa la seccion "Errores comunes" de la guia de tu sistema operativo.

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
