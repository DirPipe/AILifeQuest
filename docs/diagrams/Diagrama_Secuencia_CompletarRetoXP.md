# Diagrama de secuencia: completar un reto y asignar XP

## Propósito

La operación completa un reto y registra su recompensa. Los cambios del reto, usuario, meta/progreso y transacción XP se confirman en una sola transacción.

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
  themeCSS: "g rect.rect { fill: transparent !important; stroke: rgba(148, 163, 184, 0.28) !important; stroke-width: 1px !important; filter: none !important; } g:nth-of-type(1) rect.rect { stroke: #FB923C !important; } g:nth-of-type(2) rect.rect { stroke: #4ADE80 !important; } g:nth-of-type(3) rect.rect { stroke: #38BDF8 !important; } g[data-et=participant] rect.actor-top ~ text.actor-box:nth-of-type(2) { display: none !important; }"
---
sequenceDiagram
    actor U as Usuario
    box transparent API
        participant CC as ChallengeController
        participant EH as GlobalExceptionHandler
    end
    box transparent Servicios
        participant CS as ChallengeService
    end
    box transparent Persistencia
        participant CR as ChallengeRepository
        participant GR as GoalRepository
        participant UR as UserRepository
        participant XR as XpTransactionRepository
    end

    U->>CC: PATCH /api/challenges/complete (challengeId)
    CC->>CS: completeChallenge(challengeId)
    CS->>CR: findById(challengeId)
    alt Reto no encontrado
        rect rgba(47, 25, 38, 1)
            CR-->>CS: sin resultados
            CS-->>EH: NotFoundException
            EH-->>U: 404 Not Found
        end
    else Reto encontrado
        CR-->>CS: reto
        CS->>CS: challenge.complete()

        alt Reto ya completado
            rect rgba(47, 25, 38, 1)
                CS-->>EH: ChallengeAlreadyCompletedException
                EH-->>U: 400 Bad Request
            end
        else Reto bloqueado
            rect rgba(47, 25, 38, 1)
                CS-->>EH: DomainException
                EH-->>U: 400 Bad Request
            end
        else Primera completación
            rect rgba(14, 39, 39, 1)
                CS->>GR: findById(challenge.goalId)
                GR-->>CS: meta con retos y progreso
                CS->>UR: findById(goal.userId)
                UR-->>CS: usuario
                CS->>CS: user.addXp(recompensa)
                CS->>CR: save(challenge)
                CS->>CR: findByGoalId(goal.id)
                CR-->>CS: retos actualizados
                CS->>CS: goal.replaceChallenges(retos)
                Note over CS: Recalcula porcentaje y estado de la meta
                CS->>UR: save(user)
                UR-->>CS: usuario con XP actualizada
                CS->>GR: save(goal)
                Note over GR: Persiste Goal y actualiza GOAL_PROGRESS
                GR-->>CS: meta y progreso guardados
                CS->>XR: save(XpTransaction.forCompletedChallenge(...))
                XR-->>CS: transacción XP guardada
                CS-->>CC: GameProgressResponseDTO
                CC-->>U: progreso, reto y XP ganada
            end
        end
    end
~~~

El manejador global responde 404 si no existe el reto y 400 para `ChallengeAlreadyCompletedException` o `DomainException`. Si la meta o el usuario asociados no existieran, el mismo servicio también lanza `NotFoundException` y la transacción no se confirma.

Guía de color: rojo = solicitud rechazada (404 si el reto no existe; 400 si está bloqueado o ya completado); verde = primera completación y asignación de XP.

Guía de bordes: azul = API; verde = servicios; naranja = persistencia.

## Recorrido del flujo

1. El usuario solicita `PATCH /api/challenges/complete` con el identificador del reto.
2. Si el reto no existe, la respuesta es `404 Not Found`. Si ya estaba completado o sigue bloqueado, la respuesta es `400 Bad Request` y no se asigna XP.
3. En la primera completación válida, el servicio carga la meta y el usuario, suma la recompensa al usuario y guarda el reto completado.
4. Recarga los retos de la meta, recalcula su porcentaje y estado, y persiste la meta junto con `GOAL_PROGRESS`.
5. Guarda una `XpTransaction` asociada al reto y responde con el progreso, el reto y la XP ganada. Si falta la meta o el usuario asociado, la transacción no se confirma.
