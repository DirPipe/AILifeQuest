
graph TD
    subgraph Client ["AI LifeQuest Client (React + Vite)"]
        Main["main.tsx / App.tsx"]
        IndexCSS["index.css (Variables CSS Globals)"]

        subgraph Routes ["Routes Layer"]
            AppRouter["AppRouter.tsx (Protección y Enrutamiento)"]
        end

        subgraph Core ["Core / Shared Layer"]
            API["services/api.ts (Axios Client)"]
            Types["types/index.ts (Interfaces TS)"]
            Calc["utils/levelCalculator.ts (Cálculo Nivel/XP)"]
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

    %% Relaciones y flujo de dependencias
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
