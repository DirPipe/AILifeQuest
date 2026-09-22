# Configuracion de PostgreSQL en Windows para AI LifeQuest

Esta guia deja PostgreSQL funcionando en Windows para el backend Sprint 1 sin Docker y sin cambiar la arquitectura del proyecto.

Spring Boot/JPA crea las tablas automaticamente, pero PostgreSQL y la base `lifequest_db` deben existir antes de iniciar la aplicacion.

## 1. Instalar PostgreSQL

1. Descargar el instalador oficial desde:

```text
https://www.postgresql.org/download/windows/
```

2. Ejecutar el instalador.

3. Durante la instalacion, dejar seleccionados al menos:

```text
PostgreSQL Server
pgAdmin 4
Command Line Tools
```

4. Cuando el instalador pida password para el superusuario `postgres`, usar:

```text
postgres
```

5. Dejar el puerto por defecto:

```text
5432
```

6. Finalizar la instalacion.

Stack Builder es opcional. Para este proyecto no es necesario instalar extensiones adicionales.

## 2. Verificar que PostgreSQL este corriendo

Abrir PowerShell y ejecutar:

```powershell
Get-Service postgresql*
```

Debe aparecer un servicio de PostgreSQL con estado `Running`.

Si esta detenido, iniciar desde PowerShell como administrador:

```powershell
Start-Service postgresql*
```

Tambien se puede iniciar desde:

```text
Services / Servicios de Windows
```

buscando un servicio parecido a:

```text
postgresql-x64-16
```

## 3. Crear la base usando pgAdmin

1. Abrir `pgAdmin 4`.
2. Conectarse al servidor local.
3. Si pide password del usuario `postgres`, escribir:

```text
postgres
```

4. En el panel izquierdo:

```text
Servers > PostgreSQL > Databases
```

5. Clic derecho en `Databases`.
6. Seleccionar `Create > Database...`.
7. En `Database`, escribir:

```text
lifequest_db
```

8. En `Owner`, dejar:

```text
postgres
```

9. Guardar.

## 4. Crear la base usando SQL Shell

Esta alternativa sirve si no quieren usar pgAdmin.

1. Abrir `SQL Shell (psql)` desde el menu de inicio.
2. Presionar Enter en:

```text
Server [localhost]:
Database [postgres]:
Port [5432]:
Username [postgres]:
```

3. Cuando pida password, escribir:

```text
postgres
```

4. Ejecutar:

```sql
CREATE DATABASE lifequest_db;
```

5. Salir:

```sql
\q
```

## 5. Verificar la conexion

Abrir `SQL Shell (psql)` y conectarse a la base:

```text
Server [localhost]:
Database [postgres]: lifequest_db
Port [5432]:
Username [postgres]:
Password for user postgres: postgres
```

Si aparece:

```text
lifequest_db=#
```

la conexion esta funcionando.

## 6. Ejecutar el backend

Abrir PowerShell o la terminal del IDE en la carpeta del backend:

```powershell
cd AILifeQuest\ai-lifequest-backend
mvn spring-boot:run
```

Hibernate/JPA creara o actualizara las tablas dentro de `lifequest_db` usando:

```properties
spring.jpa.hibernate.ddl-auto=update
```

No es necesario crear manualmente tablas como `users`, `goals`, `challenges` o `xp_transactions`.

## 7. Probar que la API responde

Con la app corriendo, probar registro desde PowerShell:

```powershell
curl.exe -X POST http://localhost:8080/api/auth/register `
  -H "Content-Type: application/json" `
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"123456\"}"
```

Tambien pueden ejecutar pruebas:

```powershell
mvn test
```

## 8. Errores comunes

### `Connection attempt failed`

PostgreSQL no esta corriendo o no escucha en `localhost:5432`.

Solucion:

```powershell
Get-Service postgresql*
Start-Service postgresql*
```

### `database "lifequest_db" does not exist`

La base no fue creada.

Solucion: crear `lifequest_db` desde pgAdmin o SQL Shell.

### `password authentication failed for user "postgres"`

La contrasena del usuario `postgres` no coincide con `application.properties`.

Solucion recomendada para desarrollo:

1. Abrir pgAdmin.
2. Ir a:

```text
Login/Group Roles > postgres
```

3. Clic derecho en `postgres`.
4. Seleccionar `Properties`.
5. En `Definition`, cambiar password a:

```text
postgres
```

6. Guardar.

### `Port 5432 already in use`

Ya hay otro PostgreSQL o servicio usando el puerto.

Solucion recomendada para el equipo: usar el puerto `5432` para evitar cambiar `application.properties`. Si no es posible, cambiar el puerto en PostgreSQL y tambien en:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/lifequest_db
```

### `Port 8080 already in use`

Otra aplicacion esta usando el puerto del backend.

Solucion temporal:

```powershell
mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8081
```

## 9. Convencion para el equipo

Cada integrante debe usar estos valores en desarrollo local:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/lifequest_db
spring.datasource.username=postgres
spring.datasource.password=postgres
```

Estas credenciales son solo para desarrollo academico/local. No deben usarse en produccion.
