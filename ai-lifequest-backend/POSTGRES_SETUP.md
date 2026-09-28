# Configuracion de PostgreSQL para AI LifeQuest

Esta guia deja PostgreSQL funcionando para el backend Sprint 1 sin Docker y sin cambiar la arquitectura del proyecto.

Spring Boot/JPA crea las tablas automaticamente, pero PostgreSQL y la base `lifequest_db` deben existir antes de iniciar la aplicacion.

## 1. Instalar PostgreSQL en Linux Mint / Ubuntu

Actualizar paquetes:

```bash
sudo apt update
```

Instalar PostgreSQL y herramientas cliente:

```bash
sudo apt install postgresql postgresql-contrib
```

Verificar instalacion:

```bash
psql --version
```

## 2. Activar el servicio

Arrancar PostgreSQL:

```bash
sudo systemctl start postgresql
```

Dejarlo activo al iniciar el sistema:

```bash
sudo systemctl enable postgresql
```

Verificar estado:

```bash
sudo systemctl status postgresql
```

Debe aparecer como `active (running)`.

## 3. Crear la base del proyecto

Entrar a la consola de PostgreSQL como administrador:

```bash
sudo -u postgres psql
```

Crear la base:

```sql
CREATE DATABASE lifequest_db;
```

Configurar la contrasena del usuario `postgres` para que coincida con `application.properties`:

```sql
ALTER USER postgres WITH PASSWORD 'postgres';
```

Salir:

```sql
\q
```

## 4. Probar la conexion manual

Ejecutar:

```bash
psql -h localhost -U postgres -d lifequest_db
```

Cuando pida password:

```text
postgres
```

Si entra a una consola que dice `lifequest_db=#`, la conexion esta funcionando. Salir con:

```sql
\q
```

## 5. Ejecutar el backend

Desde la carpeta del backend:

```bash
cd AILifeQuest/ai-lifequest-backend
mvn spring-boot:run
```

Hibernate/JPA creara o actualizara las tablas dentro de `lifequest_db` usando:

```properties
spring.jpa.hibernate.ddl-auto=update
```

No es necesario crear manualmente tablas como `users`, `goals`, `challenges` o `xp_transactions`.

## 6. Verificaciones rapidas

Verificar que PostgreSQL responde:

```bash
pg_isready -h localhost -p 5432
```

Ejecutar pruebas:

```bash
mvn test
```

Probar registro cuando la app este corriendo:

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"123456"}'
```

## 7. Errores comunes

### `Connection attempt failed`

PostgreSQL no esta corriendo o no escucha en `localhost:5432`.

Solucion:

```bash
sudo systemctl start postgresql
pg_isready -h localhost -p 5432
```

### `database "lifequest_db" does not exist`

La base no fue creada.

Solucion:

```bash
sudo -u postgres psql
CREATE DATABASE lifequest_db;
\q
```

### `password authentication failed for user "postgres"`

La contrasena del usuario `postgres` no coincide con `application.properties`.

Solucion:

```bash
sudo -u postgres psql
ALTER USER postgres WITH PASSWORD 'postgres';
\q
```

### `Port 8080 already in use`

Otra aplicacion esta usando el puerto del backend.

Solucion temporal:

```bash
mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8081
```

## 8. Convencion para el equipo

Cada integrante debe usar estos valores en desarrollo local:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/lifequest_db
spring.datasource.username=postgres
spring.datasource.password=postgres
```

Estas credenciales son solo para desarrollo academico/local. No deben usarse en produccion.
