# Diagrama de secuencia: crear una meta y agregar retos

## Propósito

Cada solicitud POST es independiente. Crear una meta persiste también su registro de progreso; luego se puede agregar cada reto mediante otra solicitud.

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
  themeCSS: "g rect.rect { fill: transparent !important; stroke: rgba(148, 163, 184, 0.28) !important; stroke-width: 1px !important; filter: none !important; } g:nth-of-type(1) rect.rect { stroke: #FB923C !important; } g:nth-of-type(2) rect.rect { stroke: #4ADE80 !important; } g:nth-of-type(3) rect.rect { stroke: #38BDF8 !important; } g:nth-of-type(4) rect.rect { stroke: #FB923C !important; } g:nth-of-type(5) rect.rect { stroke: #4ADE80 !important; } g:nth-of-type(6) rect.rect { stroke: #38BDF8 !important; } g[data-et=participant] rect.actor-top ~ text.actor-box:nth-of-type(2) { display: none !important; }"
---
sequenceDiagram
    actor U as Usuario
    box transparent API - metas
        participant GC as GoalController
    end
    box transparent Servicios - metas
        participant GS as GoalService
    end
    box transparent Persistencia - metas
        participant UR as UserRepository
        participant GR as GoalRepository
    end
    box transparent API - retos
        participant CC as ChallengeController
    end
    box transparent Servicios - retos
        participant CS as ChallengeService
    end
    box transparent Persistencia - retos
        participant CR as ChallengeRepository
    end

    rect rgba(21, 40, 75, 1)
        Note over U,GS: 1. Solicitud y validación del usuario
        U->>GC: POST /api/goals (datos de meta)
        GC->>GS: createGoal(request)
        GS->>UR: findById(userId)
        UR-->>GS: usuario
        GS->>GS: validar usuario activo y construir Goal
    end

    rect rgba(16, 53, 44, 1)
        Note over GS,GR: 2. Validar título y guardar meta con su progreso
        GS->>GR: existsActiveTitle(userId, titulo normalizado)
        GR-->>GS: no existe duplicado
        GS->>GR: save(goal)
        Note over GR: Persiste Goal y crea/actualiza GOAL_PROGRESS
        GR-->>GS: meta guardada
        GS-->>GC: GoalResponseDTO
        GC-->>U: 201 Created
    end

    loop Por cada reto que agrega el usuario
        rect rgba(65, 49, 27, 1)
            Note over U,CS: 3. Solicitud y validación del reto
            U->>CC: POST /api/challenges (datos del reto)
            CC->>CS: createChallenge(request)
            CS->>GR: findById(goalId)
            GR-->>CS: meta con retos y progreso
            CS->>UR: findById(goal.userId)
            UR-->>CS: usuario propietario
            CS->>CS: validar usuario activo y XP requerida
            CS->>CR: existsPendingTitle(goalId, titulo normalizado)
            CR-->>CS: no existe duplicado pendiente
            CS->>CS: construir Challenge y goal.addChallenge()
        end

        rect rgba(47, 33, 81, 1)
            Note over CS,CR: 4. Guardar reto y actualizar progreso
            CS->>CR: save(challenge)
            CR-->>CS: reto guardado
            CS->>GR: save(goal)
            Note over GR: Actualiza GOAL_PROGRESS
            GR-->>CS: meta y progreso guardados
            CS-->>CC: ChallengeResponseDTO
            CC-->>U: 201 Created
        end
    end
~~~

Guía de color: azul = solicitud y validación del usuario; verde = guardar la meta; ámbar = validar el reto; violeta = guardar el reto y actualizar el progreso.

Guía de bordes: azul = API; verde = servicios; naranja = persistencia. Los colores se repiten para metas y retos.

Los recuadros de contorno separan los componentes por responsabilidad (API, servicios y persistencia). Cada nombre aparece arriba en el borde de su sección y abajo junto al participante correspondiente.

Si el usuario no existe, está inactivo, falta un dato requerido o el título está duplicado, el servicio rechaza la operación y no guarda la entidad.

## Recorrido del flujo

1. **Crear meta:** `POST /api/goals` pasa por el controlador y el servicio. El servicio busca al usuario, verifica que esté activo y construye la meta.
2. **Guardar meta:** comprueba que no exista un título activo duplicado, guarda la meta y crea o actualiza `GOAL_PROGRESS`. La API responde `201 Created`.
3. **Validar reto:** por cada reto, `POST /api/challenges` carga la meta y su usuario propietario, valida que el usuario esté activo y que la recompensa XP sea válida, y comprueba títulos pendientes duplicados.
4. **Guardar reto:** el servicio adjunta el reto a la meta, guarda ambos y actualiza `GOAL_PROGRESS`. La API responde `201 Created`.

Si el usuario no existe o está inactivo, falta un dato requerido o el título está duplicado, la operación se rechaza sin guardar la entidad.
