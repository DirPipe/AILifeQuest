# Diagrama de secuencia: registro e inicio de sesión

## Propósito

Este flujo registra una cuenta o valida credenciales existentes. La respuesta contiene los datos del usuario; no se emite token ni se crea una sesión.

~~~mermaid
---
config:
  theme: dark
  htmlLabels: false
  fontSize: 20
  sequence:
    actorFontSize: 20
    messageFontSize: 18
    noteFontSize: 17
    messageMargin: 34
  themeVariables:
    actorBkg: '#1E293B'
    actorBorder: '#94A3B8'
    actorTextColor: '#F8FAFC'
    actorLineColor: '#64748B'
    signalColor: '#CBD5E1'
    signalTextColor: '#F8FAFC'
    labelBoxBkgColor: '#1E293B'
    labelBoxBorderColor: '#64748B'
    labelTextColor: '#F8FAFC'
    loopTextColor: '#F8FAFC'
    noteBkgColor: '#1E293B'
    noteBorderColor: '#94A3B8'
    noteTextColor: '#F8FAFC'
  themeCSS: "g rect.rect { fill: transparent !important; stroke: rgba(148, 163, 184, 0.28) !important; stroke-width: 1px !important; filter: none !important; } g:nth-of-type(1) rect.rect { stroke: #FB923C !important; } g:nth-of-type(2) rect.rect { stroke: #4ADE80 !important; } g:nth-of-type(3) rect.rect { stroke: #38BDF8 !important; }"
---
sequenceDiagram
    actor U as Usuario
    box transparent API
        participant AC as AuthController
        participant EH as GlobalExceptionHandler
    end
    box transparent Servicios
        participant AS as AuthService
        participant PH as PasswordHasher
    end
    box transparent Persistencia
        participant UR as UserRepository
        participant UC as UserCredentialsRepository
    end

    alt Registro
        U->>AC: POST /api/auth/register (name, email, password)
        alt DTO inválido
            rect rgba(47, 25, 38, 1)
                AC-->>EH: error de validación (@Valid)
                EH-->>U: 400 Bad Request
            end
        else DTO válido
            AC->>AS: register(RegisterRequestDTO)
            AS->>AS: normalizar email y nombre
            AS->>UR: existsByEmail(email normalizado)
            UR-->>AS: existe o no existe
            alt Email ya registrado
                rect rgba(47, 25, 38, 1)
                    AS-->>EH: ConflictException
                    EH-->>U: 409 Conflict
                end
            else Email disponible
                rect rgba(14, 39, 39, 1)
                    AS->>AS: crear User(UUID, ACTIVE, XP=0)
                    AS->>PH: hash(password)
                    PH-->>AS: passwordHash
                    AS->>UC: saveNewUser(user, passwordHash)
                    UC-->>AS: usuario guardado
                    AS-->>AC: AuthResponseDTO
                    AC-->>U: 201 Created
                end
            end
        end
    else Inicio de sesión
        U->>AC: POST /api/auth/login (email, password)
        alt DTO inválido
            rect rgba(47, 25, 38, 1)
                AC-->>EH: error de validación (@Valid)
                EH-->>U: 400 Bad Request
            end
        else DTO válido
            AC->>AS: login(LoginRequestDTO)
            AS->>AS: normalizar email
            AS->>UR: findByEmail(email normalizado)
            alt Usuario no encontrado
                rect rgba(47, 25, 38, 1)
                    UR-->>AS: sin resultados
                    AS-->>EH: UnauthorizedException
                    EH-->>U: 401 Unauthorized
                end
            else Usuario encontrado
                UR-->>AS: User
                AS->>UC: findPasswordHashByEmail(email normalizado)
                alt Hash no encontrado
                    rect rgba(47, 25, 38, 1)
                        UC-->>AS: sin resultados
                        AS-->>EH: UnauthorizedException
                        EH-->>U: 401 Unauthorized
                    end
                else Hash encontrado
                    UC-->>AS: passwordHash
                    AS->>PH: matches(password, passwordHash)
                    alt Contraseña incorrecta
                        rect rgba(47, 25, 38, 1)
                            PH-->>AS: no coincide
                            AS-->>EH: UnauthorizedException
                            EH-->>U: 401 Unauthorized
                        end
                    else Credenciales válidas
                        rect rgba(21, 40, 75, 1)
                            PH-->>AS: coincide
                            AS-->>AC: AuthResponseDTO
                            AC-->>U: 200 OK
                        end
                    end
                end
            end
        end
    end
~~~

Guía de color: rojo = solicitud rechazada; verde = registro exitoso; azul = inicio de sesión exitoso.

Guía de bordes: azul = API; verde = servicios; naranja = persistencia.

## Recorrido del flujo

1. **Registro:** el usuario envía `POST /api/auth/register`. La API valida el DTO; el servicio normaliza los datos y comprueba si el correo ya existe. Si está disponible, crea el usuario, genera el hash de la contraseña y persiste ambos. Termina con `201 Created`.
2. **Errores de registro:** un DTO inválido responde `400 Bad Request`; un correo ya registrado responde `409 Conflict`.
3. **Inicio de sesión:** el usuario envía `POST /api/auth/login`. El servicio busca la cuenta y el hash, compara la contraseña y devuelve `200 OK` si coincide.
4. **Errores de inicio:** usuario, hash o contraseña no válidos terminan en `401 Unauthorized`.
