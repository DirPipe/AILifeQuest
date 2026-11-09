# Diagrama de componentes del frontend

## Propósito

Esta vista muestra la organización de la aplicación React y las dependencias entre el punto de entrada, las rutas, las funcionalidades y los módulos compartidos.

## Guía de colores

| Color | Elementos | Responsabilidad |
| --- | --- | --- |
| Azul | Punto de entrada y rutas | Inicio de la aplicación y navegación. |
| Verde | Funcionalidades | Páginas y componentes de autenticación, panel, metas, retos y perfil. |
| Cian | Módulos compartidos | Cliente HTTP, tipos e interfaces compartidas, y estilos globales. |
| Ámbar | Utilidades | Cálculos de nivel y XP. |

~~~mermaid
---
config:
  theme: dark
  htmlLabels: false
  layout: elk
  themeCSS: "g.cluster rect { fill: transparent !important; stroke: rgba(148, 163, 184, 0.42) !important; stroke-width: 1.5px !important; } g.cluster-label text { fill: #F8FAFC !important; }"
---
flowchart TD
    subgraph Client ["AI LifeQuest Client (React + Vite)"]
        Main["main.tsx / App.tsx"]
        IndexCSS["index.css (variables CSS globales)"]

        subgraph Routes ["Routes Layer"]
            AppRouter["AppRouter.tsx (protección y enrutamiento)"]
        end

        subgraph Core ["Core / Shared Layer"]
            API["services/api.ts (Axios Client)"]
            Types["types/index.ts (interfaces TS)"]
            Calc["utils/levelCalculator.ts (cálculo de nivel y XP)"]
        end

        subgraph Features ["Features Layer (src/features/)"]
            subgraph AuthFeature ["features/auth"]
                AuthPage["pages/AuthPage.tsx"]
                AuthComp["components (LoginForm, RegisterForm)"]
            end

            subgraph DashboardFeature ["features/dashboard"]
                DashPage["pages/DashboardPage.tsx"]
                DashComp["components (GoalCard, ChallengeCard, ProgressBar, StatsModal)"]
            end

            subgraph GoalsFeature ["features/goals"]
                GoalPage["pages/CreateGoalPage.tsx"]
            end

            subgraph ChallengesFeature ["features/challenges"]
                ChallengePage["pages/CreateChallengePage.tsx"]
            end

            subgraph UserFeature ["features/user"]
                UserPage["pages/UserProfilePage.tsx"]
                UserComp["components/UserXpHeader.tsx"]
            end
        end
    end

    %% Relaciones y dependencias
    Main --> AppRouter
    Main --> IndexCSS
    AppRouter --> AuthPage
    AppRouter --> DashPage
    AppRouter --> GoalPage
    AppRouter --> ChallengePage
    AppRouter --> UserPage

    AuthPage --> AuthComp
    DashPage --> DashComp
    DashPage --> UserComp
    UserPage --> UserComp

    Features --> API
    Features --> Types
    UserComp --> Calc

    classDef shell fill:#172554,stroke:#60A5FA,stroke-width:2px,color:#EFF6FF
    classDef feature fill:#14332B,stroke:#4ADE80,stroke-width:2px,color:#F0FDF4
    classDef shared fill:#103744,stroke:#22D3EE,stroke-width:2px,color:#ECFEFF
    classDef utility fill:#3B2B12,stroke:#FBBF24,stroke-width:2px,color:#FFFBEB

    class Main,AppRouter shell
    class AuthPage,AuthComp,DashPage,DashComp,GoalPage,ChallengePage,UserPage,UserComp feature
    class IndexCSS,API,Types shared
    class Calc utility
    linkStyle default stroke:#94A3B8,stroke-width:1.5px
~~~

Las flechas indican dependencias entre componentes. Las páginas de cada funcionalidad utilizan los módulos compartidos; el panel y el perfil reutilizan los componentes de metas, retos y experiencia.
