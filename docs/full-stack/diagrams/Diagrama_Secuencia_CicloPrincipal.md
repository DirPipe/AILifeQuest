# Diagrama de secuencia: ciclo principal

## Propósito

Este flujo muestra cómo el usuario crea una meta y sus retos, y cómo la aplicación actualiza el progreso y la XP al completar un reto.

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
    autonumber
    actor Jugador as Usuario / Jugador
    box transparent Frontend
        participant GoalUI as CreateGoalPage (src/features/goals)
        participant ChallengeUI as CreateChallengePage (src/features/challenges)
        participant CardUI as ChallengeCard / GoalCard (src/features/dashboard)
    end
    box transparent Cliente HTTP
        participant API as apiService (src/core/services/api.ts)
    end
    box transparent API REST
        participant Back as Backend (Spring Boot HTTP API)
    end

    %% 1. Creación de meta
    Jugador->>GoalUI: Llena formulario y presiona "Guardar Meta"
    GoalUI->>API: createGoal({ userId, title, description, category, targetDate })
    API->>Back: POST /api/goals (CreateGoalRequestDTO)
    Back-->>API: Respuesta 201 Created (GoalResponseDTO)
    API-->>GoalUI: Devuelve objeto Goal
    GoalUI->>CardUI: Redirige a "/dashboard" y actualiza lista de metas

    %% 2. Creación de reto
    Jugador->>ChallengeUI: Llena formulario y presiona "+ Añadir Reto"
    ChallengeUI->>API: createChallenge({ goalId, title, description, xpReward })
    API->>Back: POST /api/challenges (CreateChallengeRequestDTO)
    Back-->>API: Respuesta 201 Created (ChallengeResponseDTO)
    API-->>ChallengeUI: Devuelve objeto Challenge
    ChallengeUI->>CardUI: Redirige a "/dashboard" y asocia reto a GoalCard

    %% 3. Completar reto y actualizar experiencia y progreso
    Jugador->>CardUI: Presiona "Completar Reto" (ChallengeCard)
    CardUI->>CardUI: Deshabilita botón / muestra "Guardando..."
    CardUI->>API: completeChallenge(challengeId)
    API->>Back: PATCH /api/challenges/complete { challengeId }
    Note over Back: Backend incrementa XP del usuario y recalcula el % de la meta
    Back-->>API: Respuesta 200 OK (GameProgressResponseDTO)
    API-->>CardUI: Devuelve { updatedXp, goalProgress }
    CardUI->>CardUI: Recalcula estado React (ProgressBar eleva % y UserXpHeader suma XP)
    CardUI-->>Jugador: Muestra badge "Completado" e incremento visual de Nivel/XP
~~~

## Guía de color

| Color | Grupo | Elementos |
| --- | --- | --- |
| Azul | Frontend | Páginas y componentes React. |
| Verde | Cliente HTTP | `apiService` y comunicación con la API. |
| Naranja | API REST | Backend Spring Boot. |

Los bordes de cada grupo identifican la capa que participa en el flujo.

## Recorrido del flujo

1. **Crear una meta:** `CreateGoalPage` envía los datos de la meta mediante `apiService`; el backend responde con `GoalResponseDTO`.
2. **Añadir un reto:** `CreateChallengePage` envía los datos asociados a la meta y recibe `ChallengeResponseDTO`.
3. **Completar un reto:** `ChallengeCard` solicita completar el reto. El backend devuelve el progreso y la XP actualizados; el dashboard refresca la tarjeta y el encabezado de experiencia.
