# Diagrama de clases de AI LifeQuest

Esta vista reúne las clases participantes en los flujos actuales de registro e inicio de sesión, creación de metas y retos, y completado de retos con XP. Es una vista de clases y responsabilidades.

## Guía de colores

| Color | Elementos | Responsabilidad |
| --- | --- | --- |
| Azul | API y conceptos `User` | Controladores y manejo de respuestas HTTP; también agrupa el usuario y sus identificadores/estado. |
| Verde | Servicios y conceptos `Goal` | Casos de uso y modelo de metas. |
| Cian | DTOs | Datos que entran y salen de la API. |
| Ámbar | Repositorios principales y conceptos `Challenge` | Puertos de persistencia de usuarios, metas, retos y transacciones; también el modelo de retos. |
| Violeta | `UserCredentialsRepository`, `Progress` y `Achievement` | Credenciales y conceptos de progreso/logros. Los logros no tienen flujo de desbloqueo actual. |
| Rosa | `XP` y `XpTransaction` | Recompensa y registro de XP. |
| Rojo | Excepciones | Errores que los servicios pueden producir y la API traducir a respuestas HTTP. |

~~~mermaid
---
config:
  theme: dark
  htmlLabels: false
  layout: elk
  themeCSS: "g.cluster rect { fill: transparent !important; stroke: rgba(148, 163, 184, 0.42) !important; stroke-width: 1.5px !important; } g.cluster-label text { fill: #F8FAFC !important; } #my-svg,#my-svg svg{font-size:18px!important;}#my-svg g.classGroup text{font-size:14px!important;}#my-svg .classLabel .label{font-size:14px!important;}#my-svg .edgeTerminals{font-size:14px!important;}#my-svg .classTitleText{font-size:20px!important;}"
---
classDiagram
direction LR

namespace API {
  class AuthController {
    +register(request: RegisterRequestDTO) AuthResponseDTO
    +login(request: LoginRequestDTO) AuthResponseDTO
  }

  class GoalController {
    +createGoal(request: CreateGoalRequestDTO) GoalResponseDTO
  }

  class ChallengeController {
    +createChallenge(request: CreateChallengeRequestDTO) ChallengeResponseDTO
    +completeChallenge(request: CompleteChallengeRequestDTO) GameProgressResponseDTO
  }

  class GlobalExceptionHandler {
    +handleBadRequest(exception: Exception) ResponseEntity
    +handleConflict(exception: ConflictException) ResponseEntity
    +handleUnauthorized(exception: UnauthorizedException) ResponseEntity
    +handleNotFound(exception: NotFoundException) ResponseEntity
  }
}

namespace Aplicacion {
  class AuthService {
    +register(request: RegisterRequestDTO) AuthResponseDTO
    +login(request: LoginRequestDTO) AuthResponseDTO
  }

  class PasswordHasher {
    +hash(rawPassword: String) String
    +matches(rawPassword: String, passwordHash: String) boolean
  }

  class GoalService {
    +createGoal(request: CreateGoalRequestDTO) GoalResponseDTO
  }

  class ChallengeService {
    +createChallenge(request: CreateChallengeRequestDTO) ChallengeResponseDTO
    +completeChallenge(challengeId: UUID) GameProgressResponseDTO
  }
}

namespace DTOs {
  class RegisterRequestDTO {
    +name: String
    +email: String
    +password: String
  }

  class LoginRequestDTO {
    +email: String
    +password: String
  }

  class CreateGoalRequestDTO {
    +userId: UUID
    +title: String
    +description: String
    +category: String
    +targetDate: LocalDate
  }

  class CreateChallengeRequestDTO {
    +goalId: UUID
    +title: String
    +description: String
    +xpReward: Integer
  }

  class CompleteChallengeRequestDTO {
    +challengeId: UUID
  }

  class AuthResponseDTO {
    +userId: UUID
    +name: String
    +email: String
    +totalXp: int
    +status: String
  }

  class GoalResponseDTO {
    +goalId: UUID
    +userId: UUID
    +title: String
    +description: String
    +category: String
    +targetDate: LocalDate
    +progress: double
    +status: String
  }

  class ChallengeResponseDTO {
    +challengeId: UUID
    +goalId: UUID
    +title: String
    +description: String
    +xpReward: int
    +status: String
    +completedAt: LocalDateTime
  }

  class UserResponseDTO {
    +userId: UUID
    +name: String
    +email: String
    +totalXp: int
    +status: String
  }

  class GameProgressResponseDTO {
    +user: UserResponseDTO
    +goal: GoalResponseDTO
    +challenge: ChallengeResponseDTO
    +xpEarned: int
  }
}

namespace PuertosRepositorio {
  class UserRepository {
    <<interface>>
    +save(user: User) User
    +findById(id: UserId) Optional~User~
    +findByEmail(email: String) Optional~User~
    +existsByEmail(email: String) boolean
  }

  class GoalRepository {
    <<interface>>
    +save(goal: Goal) Goal
    +findById(id: GoalId) Optional~Goal~
    +existsActiveTitle(userId: UserId, normalizedTitle: String, excludingGoalId: GoalId) boolean
  }

  class ChallengeRepository {
    <<interface>>
    +save(challenge: Challenge) Challenge
    +findById(id: ChallengeId) Optional~Challenge~
    +findByGoalId(goalId: GoalId) List~Challenge~
    +existsPendingTitle(goalId: GoalId, normalizedTitle: String, excludingChallengeId: ChallengeId) boolean
  }

  class XpTransactionRepository {
    <<interface>>
    +save(transaction: XpTransaction) XpTransaction
  }
}

namespace PersistenciaAutenticacion {
  class UserCredentialsRepository {
    +saveNewUser(user: User, passwordHash: String) User
    +findPasswordHashByEmail(email: String) Optional~String~
  }
}

namespace ErroresAplicacion {
  class ConflictException {
    <<exception>>
    +ConflictException(message: String)
  }

  class NotFoundException {
    <<exception>>
    +NotFoundException(message: String)
  }

  class UnauthorizedException {
    <<exception>>
    +UnauthorizedException(message: String)
  }
}

namespace Modelo {
  class User {
    -id: UserId
    -name: String
    -email: String
    -totalXp: XP
    -status: UserStatus
    +addXp(reward: XP) void
    +updateProfile(name: String, email: String) void
    +deactivate() void
  }

  class Goal {
    -id: GoalId
    -userId: UserId
    -title: String
    -description: String
    -category: String
    -targetDate: LocalDate
    -progress: Progress
    -status: GoalStatus
    -challenges: List~Challenge~
    +addChallenge(challenge: Challenge) void
    +replaceChallenges(challenges: List~Challenge~) void
    +recalculateProgress() void
  }

  class Challenge {
    -id: ChallengeId
    -goalId: GoalId
    -title: String
    -description: String
    -xpReward: XP
    -status: ChallengeStatus
    -completedAt: LocalDateTime
    +complete() XP
    +isCompleted() boolean
  }

  class XpTransaction {
    -id: UUID
    -userId: UserId
    -challengeId: ChallengeId
    -amount: XP
    -reason: String
    -createdAt: LocalDateTime
    +forCompletedChallenge(userId: UserId, challengeId: ChallengeId, amount: XP) XpTransaction$
  }

  class Achievement {
    <<estructura actual>>
    -code: String
    -name: String
    -description: String
    -active: boolean
    +isActive() boolean
  }

  class UserId {
    <<value object>>
    -value: UUID
  }

  class GoalId {
    <<value object>>
    -value: UUID
  }

  class ChallengeId {
    <<value object>>
    -value: UUID
  }

  class XP {
    <<value object>>
    -value: int
    +add(other: XP) XP
  }

  class Progress {
    <<value object>>
    -percentage: double
    +calculate(completedChallenges: long, totalChallenges: long) Progress$
  }

  class TitleNormalizer {
    <<utility>>
    +normalize(title: String) String$
  }

  class UserStatus {
    <<enumeration>>
    ACTIVE
    INACTIVE
  }

  class GoalStatus {
    <<enumeration>>
    ACTIVE
    COMPLETED
    CANCELLED
  }

  class ChallengeStatus {
    <<enumeration>>
    LOCKED
    AVAILABLE
    IN_PROGRESS
    COMPLETED
  }

  class DomainException {
    <<exception>>
    +DomainException(message: String)
  }

  class ChallengeAlreadyCompletedException {
    <<exception>>
    +ChallengeAlreadyCompletedException()
  }
}

AuthController ..> AuthService : delegates
GoalController ..> GoalService : delegates
ChallengeController ..> ChallengeService : delegates
AuthController ..> RegisterRequestDTO : receives
AuthController ..> LoginRequestDTO : receives
AuthController ..> AuthResponseDTO : returns
GoalController ..> CreateGoalRequestDTO : receives
GoalController ..> GoalResponseDTO : returns
ChallengeController ..> CreateChallengeRequestDTO : receives
ChallengeController ..> CompleteChallengeRequestDTO : receives
ChallengeController ..> ChallengeResponseDTO : returns
ChallengeController ..> GameProgressResponseDTO : returns

GlobalExceptionHandler ..> ConflictException : maps to 409
GlobalExceptionHandler ..> UnauthorizedException : maps to 401
GlobalExceptionHandler ..> NotFoundException : maps to 404
GlobalExceptionHandler ..> DomainException : maps to 400

AuthService ..> UserRepository : looks up account
AuthService ..> UserCredentialsRepository : stores password hash
AuthService ..> PasswordHasher : hashes and checks password
AuthService ..> User : creates and authenticates
AuthService ..> ConflictException : rejects duplicate email
AuthService ..> UnauthorizedException : rejects invalid credentials

GoalService ..> UserRepository : validates owner
GoalService ..> GoalRepository : checks title and saves
GoalService ..> User : checks active status
GoalService ..> Goal : creates
GoalService ..> TitleNormalizer : normalizes title
GoalService ..> NotFoundException : reports missing user
GoalService ..> DomainException : rejects inactive user
GoalService ..> ConflictException : rejects duplicate title

ChallengeService ..> ChallengeRepository : reads and saves
ChallengeService ..> GoalRepository : reads and updates goal
ChallengeService ..> UserRepository : reads and saves user
ChallengeService ..> XpTransactionRepository : saves XP history
ChallengeService ..> Challenge : creates and completes
ChallengeService ..> Goal : recalculates progress
ChallengeService ..> User : awards XP
ChallengeService ..> XpTransaction : records completion XP
ChallengeService ..> TitleNormalizer : normalizes title
ChallengeService ..> NotFoundException : reports missing records
ChallengeService ..> ConflictException : rejects duplicate title
ChallengeService ..> DomainException : rejects invalid transition
ChallengeService ..> ChallengeAlreadyCompletedException : rejects repeated completion

UserCredentialsRepository ..> User : stores account credentials
UserRepository ..> User : saves and queries
GoalRepository ..> Goal : saves and queries
ChallengeRepository ..> Challenge : saves and queries
XpTransactionRepository ..> XpTransaction : saves
GoalRepository ..> UserId : queries by owner
ChallengeRepository ..> GoalId : queries by goal

GameProgressResponseDTO --> UserResponseDTO : includes
GameProgressResponseDTO --> GoalResponseDTO : includes
GameProgressResponseDTO --> ChallengeResponseDTO : includes

User --> Goal : owns
Goal --> Challenge : contains
Goal --> Progress : tracks
User --> XP : gains XP
Challenge --> XP : rewards
User --> UserId : identity
User ..> UserStatus : status
Goal --> GoalId : identity
Goal --> UserId : owner id
Goal ..> GoalStatus : status
Challenge --> ChallengeId : identity
Challenge --> GoalId : goal id
Challenge ..> ChallengeStatus : status
XpTransaction --> UserId : user id
XpTransaction --> ChallengeId : nullable challenge id
XpTransaction --> XP : amount
ChallengeAlreadyCompletedException --|> DomainException

style AuthController fill:#172554,stroke:#60A5FA,stroke-width:2px,color:#EFF6FF
style GoalController fill:#172554,stroke:#60A5FA,stroke-width:2px,color:#EFF6FF
style ChallengeController fill:#172554,stroke:#60A5FA,stroke-width:2px,color:#EFF6FF
style GlobalExceptionHandler fill:#172554,stroke:#60A5FA,stroke-width:2px,color:#EFF6FF
style AuthService fill:#14332B,stroke:#4ADE80,stroke-width:2px,color:#F0FDF4
style PasswordHasher fill:#14332B,stroke:#4ADE80,stroke-width:2px,color:#F0FDF4
style GoalService fill:#14332B,stroke:#4ADE80,stroke-width:2px,color:#F0FDF4
style ChallengeService fill:#14332B,stroke:#4ADE80,stroke-width:2px,color:#F0FDF4
style RegisterRequestDTO fill:#123742,stroke:#22D3EE,stroke-width:2px,color:#ECFEFF
style LoginRequestDTO fill:#123742,stroke:#22D3EE,stroke-width:2px,color:#ECFEFF
style CreateGoalRequestDTO fill:#123742,stroke:#22D3EE,stroke-width:2px,color:#ECFEFF
style CreateChallengeRequestDTO fill:#123742,stroke:#22D3EE,stroke-width:2px,color:#ECFEFF
style CompleteChallengeRequestDTO fill:#123742,stroke:#22D3EE,stroke-width:2px,color:#ECFEFF
style AuthResponseDTO fill:#123742,stroke:#22D3EE,stroke-width:2px,color:#ECFEFF
style GoalResponseDTO fill:#123742,stroke:#22D3EE,stroke-width:2px,color:#ECFEFF
style ChallengeResponseDTO fill:#123742,stroke:#22D3EE,stroke-width:2px,color:#ECFEFF
style UserResponseDTO fill:#123742,stroke:#22D3EE,stroke-width:2px,color:#ECFEFF
style GameProgressResponseDTO fill:#123742,stroke:#22D3EE,stroke-width:2px,color:#ECFEFF
style UserRepository fill:#3B2B12,stroke:#FBBF24,stroke-width:2px,color:#FFFBEB
style GoalRepository fill:#3B2B12,stroke:#FBBF24,stroke-width:2px,color:#FFFBEB
style ChallengeRepository fill:#3B2B12,stroke:#FBBF24,stroke-width:2px,color:#FFFBEB
style XpTransactionRepository fill:#3B2B12,stroke:#FBBF24,stroke-width:2px,color:#FFFBEB
style UserCredentialsRepository fill:#382449,stroke:#C084FC,stroke-width:2px,color:#FAF5FF
style ConflictException fill:#47242B,stroke:#FB7185,stroke-width:2px,color:#FFF1F2
style NotFoundException fill:#47242B,stroke:#FB7185,stroke-width:2px,color:#FFF1F2
style UnauthorizedException fill:#47242B,stroke:#FB7185,stroke-width:2px,color:#FFF1F2
style DomainException fill:#47242B,stroke:#FB7185,stroke-width:2px,color:#FFF1F2
style ChallengeAlreadyCompletedException fill:#47242B,stroke:#FB7185,stroke-width:2px,color:#FFF1F2
style User fill:#172554,stroke:#60A5FA,stroke-width:2px,color:#EFF6FF
style UserId fill:#172554,stroke:#60A5FA,stroke-width:2px,color:#EFF6FF
style UserStatus fill:#172554,stroke:#60A5FA,stroke-width:2px,color:#EFF6FF
style Goal fill:#14332B,stroke:#4ADE80,stroke-width:2px,color:#F0FDF4
style GoalId fill:#14332B,stroke:#4ADE80,stroke-width:2px,color:#F0FDF4
style GoalStatus fill:#14332B,stroke:#4ADE80,stroke-width:2px,color:#F0FDF4
style Challenge fill:#3B2B12,stroke:#FBBF24,stroke-width:2px,color:#FFFBEB
style ChallengeId fill:#3B2B12,stroke:#FBBF24,stroke-width:2px,color:#FFFBEB
style ChallengeStatus fill:#3B2B12,stroke:#FBBF24,stroke-width:2px,color:#FFFBEB
style XpTransaction fill:#401C35,stroke:#F472B6,stroke-width:2px,color:#FFF1F2
style XP fill:#401C35,stroke:#F472B6,stroke-width:2px,color:#FFF1F2
style Progress fill:#2E1A47,stroke:#C084FC,stroke-width:2px,color:#FAF5FF
style Achievement fill:#382449,stroke:#D8B4FE,stroke-width:2px,color:#FAF5FF
style TitleNormalizer fill:#263244,stroke:#94A3B8,stroke-width:2px,color:#F8FAFC
~~~
