# Diagramas del MER - AI LifeQuest

Este documento reúne las dos vistas gráficas del mismo modelo: el MER con notación pata de gallo y la vista que escribe las multiplicidades junto a sus símbolos. El esquema es objetivo; las relaciones y campos marcados como futuros todavía no representan flujos implementados.

## Guía de colores

| Color | Tablas o entidades | |
| --- | --- | --- |
| Azul | `USERS` | Usuarios y su XP acumulada. |
| Verde | `GOALS` | Metas del usuario. |
| Ámbar | `CHALLENGES` | Retos que pertenecen a una meta. |
| Violeta | `GOAL_PROGRESS` | Progreso de la meta. |
| Rosa | `XP_TRANSACTIONS` | Historial de XP. |
| Lila | `ACHIEVEMENTS` | Catálogo de logros. |
| Cian | `USER_ACHIEVEMENTS` | Desbloqueo de un logro por un usuario y a la transacción que lo recompensa. |

## Diagrama Entidad-Relacion

~~~mermaid
---
config:
  theme: dark
  htmlLabels: false
  er:
    fontSize: 20
    entityPadding: 12
  layout: dagre
  themeCSS: "#my-svg,#my-svg svg{font-size:18px!important;}#my-svg .edgeLabel .label{font-size:18px!important;}"
---
erDiagram
    USERS ||--o{ GOALS : "1 to 0..N - owns"
    GOALS ||--o{ CHALLENGES : "1 to 0..N - contains"
    GOALS ||--|| GOAL_PROGRESS : "1 to 1 - tracks"
    USERS ||--o{ XP_TRANSACTIONS : "1 to 0..N - XP history"
    CHALLENGES o|--o{ XP_TRANSACTIONS : "1 to 0..N - challenge XP"
    USER_ACHIEVEMENTS o|--|| XP_TRANSACTIONS : "1 to 1 - awards 
    achievement XP 
    future"
    USERS ||--o{ USER_ACHIEVEMENTS : "1 to 0..N - unlocks 
    future"
    ACHIEVEMENTS ||--o{ USER_ACHIEVEMENTS : "1 to 0..N - unlocked 
    future"
    USERS {
        uuid id PK
        varchar(120) name
        varchar(180) email UK
        varchar(255) password_hash
        varchar(20) status
        int total_xp
        timestamp created_at
        timestamp updated_at
        timestamp deactivated_at
    }

    GOALS {
        uuid id PK
        uuid user_id FK
        varchar(100) title
        varchar(300) active_title_key
        varchar(200) description
        varchar(80) category
        date target_date
        varchar(20) status
        timestamp created_at
        timestamp updated_at
    }

    CHALLENGES {
        uuid id PK
        uuid goal_id FK
        varchar(100) title
        varchar(300) active_title_key
        varchar(200) description
        varchar(20) status
        int xp_reward
        int sort_order
        timestamp completed_at
        timestamp created_at
        timestamp updated_at
    }

    GOAL_PROGRESS {
        uuid id PK
        uuid goal_id FK, UK
        int total_challenges
        int completed_challenges
        double progress_percentage
        timestamp updated_at
    }

    XP_TRANSACTIONS {
        uuid id PK
        uuid user_id FK
        uuid challenge_id FK 
        int amount
        varchar(80) reason
        timestamp created_at
    }

    ACHIEVEMENTS {
        uuid id PK
        varchar(60) code UK
        varchar(120) name
        varchar(60) condition_type
        int condition_value
        int xp_reward 
        boolean active
        timestamp created_at
    }

    USER_ACHIEVEMENTS {
        uuid id PK
        uuid user_id FK
        uuid achievement_id FK
        uuid xp_transaction_id FK, UK
        timestamp unlocked_at
    }

    style USERS fill:#172554,stroke:#60A5FA,stroke-width:2px,color:#EFF6FF
    style GOALS fill:#14332B,stroke:#4ADE80,stroke-width:2px,color:#F0FDF4
    style CHALLENGES fill:#3B2B12,stroke:#FBBF24,stroke-width:2px,color:#FFFBEB
    style GOAL_PROGRESS fill:#2E1A47,stroke:#C084FC,stroke-width:2px,color:#FAF5FF
    style XP_TRANSACTIONS fill:#401C35,stroke:#F472B6,stroke-width:2px,color:#FFF1F2
    style ACHIEVEMENTS fill:#382449,stroke:#D8B4FE,stroke-width:2px,color:#FAF5FF
    style USER_ACHIEVEMENTS fill:#103744,stroke:#22D3EE,stroke-width:2px,color:#ECFEFF
~~~
