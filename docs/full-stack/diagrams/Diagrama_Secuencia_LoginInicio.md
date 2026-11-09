# Diagrama de secuencia: inicio de sesión

## Propósito

Este flujo muestra cómo el usuario inicia sesión desde la interfaz y cómo el frontend carga las metas antes de mostrar el panel.

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
        participant AuthUI as LoginForm / RegisterForm (AuthPage)
        participant Router as AppRouter (React Router)
    end
    box transparent Cliente HTTP
        participant API as apiService (src/core/services/api.ts)
    end
    box transparent API REST
        participant Back as Backend (Spring Boot HTTP API)
    end

    Jugador->>AuthUI: Ingresa credenciales y presiona "Iniciar Sesión"
    AuthUI->>API: login(email, password)
    API->>Back: POST /api/auth/login { email, password }
    Back-->>API: Respuesta 200 OK (AuthApiResponse)
    API-->>AuthUI: Devuelve objeto User mapeado
    AuthUI->>Router: Almacena currentUser y navega a "/dashboard"
    Router->>API: getGoalsByUser(userId)
    API->>Back: GET /api/goals?userId=...
    Back-->>API: Respuesta 200 OK (GoalApiResponse[])
    API-->>Router: Devuelve lista de Goal[]
    Router-->>Jugador: Renderiza DashboardPage con metas, retos y UserXpHeader
~~~

## Guía de color

| Color | Grupo | Elementos |
| --- | --- | --- |
| Azul | Frontend | Formularios de acceso y enrutamiento. |
| Verde | Cliente HTTP | `apiService` y comunicación con la API. |
| Naranja | API REST | Backend Spring Boot. |

Los bordes de cada grupo identifican la capa que participa en el flujo.

## Recorrido del flujo

1. El usuario introduce sus credenciales en `LoginForm` y solicita iniciar sesión.
2. `apiService` envía `POST /api/auth/login` y devuelve el usuario autenticado.
3. `AppRouter` navega al panel y solicita las metas del usuario.
4. Al recibir la respuesta de la API, el frontend muestra `DashboardPage` con las metas, los retos y `UserXpHeader`.
