#!/usr/bin/env bash

set -euo pipefail

API_BASE_URL="${API_BASE_URL:-http://localhost:8080/api}"
SEED_PASSWORD="${SEED_PASSWORD:-123456}"

fail() {
  echo "Error: $*" >&2
  exit 1
}

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Falta instalar '$1'."
    echo "Instalacion sugerida en Ubuntu/Linux Mint: sudo apt install $1"
    exit 1
  fi
}

validate_json() {
  local json="$1"
  local context="$2"

  if ! jq -e . >/dev/null 2>&1 <<<"$json"; then
    echo "$json" >&2
    fail "La respuesta de $context no es JSON valido."
  fi
}

extract_required_field() {
  local json="$1"
  local field="$2"
  local context="$3"
  local value

  validate_json "$json" "$context"
  value="$(jq -r --arg field "$field" '.[$field] // empty' <<<"$json")"
  if [[ -z "$value" || "$value" == "null" ]]; then
    echo "$json" | jq . >&2
    fail "La respuesta de $context no contiene el campo requerido '$field'."
  fi

  echo "$value"
}

api_request() {
  local method="$1"
  local path="$2"
  local body="${3:-}"
  local response_file
  local status

  response_file="$(mktemp)"

  if [[ -n "$body" ]]; then
    status="$(curl -s -o "$response_file" -w "%{http_code}" \
      -X "$method" "$API_BASE_URL$path" \
      -H "Content-Type: application/json" \
      -d "$body")"
  else
    status="$(curl -s -o "$response_file" -w "%{http_code}" \
      -X "$method" "$API_BASE_URL$path" \
      -H "Content-Type: application/json")"
  fi

  if [[ "$status" -lt 200 || "$status" -ge 300 ]]; then
    cat "$response_file" >&2
    echo
    rm -f "$response_file"
    fail "Llamada fallida: $method $path. HTTP $status"
  fi

  cat "$response_file"
  rm -f "$response_file"
}

check_api_ready() {
  local status

  status="$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE_URL/goals" || true)"
  if [[ "$status" == "000" ]]; then
    fail "No se pudo conectar con $API_BASE_URL. Asegurate de iniciar el backend con 'mvn spring-boot:run'."
  fi
}

slugify() {
  echo "$1" | tr '[:upper:]' '[:lower:]' | tr -cd '[:alnum:]'
}

register_or_login_user() {
  local name="$1"
  local email="$2"
  local payload
  local response

  payload="$(jq -n \
    --arg name "$name" \
    --arg email "$email" \
    --arg password "$SEED_PASSWORD" \
    '{name: $name, email: $email, password: $password}')"

  response="$(curl -s -w "\n%{http_code}" \
    -X POST "$API_BASE_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d "$payload")"

  local body
  local status
  body="$(echo "$response" | sed '$d')"
  status="$(echo "$response" | tail -n 1)"

  if [[ "$status" == "201" || "$status" == "200" ]]; then
    validate_json "$body" "POST /auth/register"
    echo "$body"
    return
  fi

  if [[ "$status" == "400" ]]; then
    payload="$(jq -n \
      --arg email "$email" \
      --arg password "$SEED_PASSWORD" \
      '{email: $email, password: $password}')"
    api_request POST "/auth/login" "$payload"
    return
  fi

  echo "$body"
  echo
  fail "No se pudo crear o iniciar sesion para $email. HTTP $status"
}

find_goal_id_by_title() {
  local user_id="$1"
  local title="$2"
  local encoded_user_id
  local goals

  encoded_user_id="$(jq -rn --arg value "$user_id" '$value|@uri')"
  goals="$(api_request GET "/goals?userId=$encoded_user_id")"
  validate_json "$goals" "GET /goals"
  echo "$goals" | jq -r --arg title "$title" '.[] | select(.title == $title) | .goalId' | head -n 1
}

create_or_get_goal() {
  local user_id="$1"
  local title="$2"
  local description="$3"
  local category="$4"
  local target_date="$5"
  local goal_id
  local payload
  local response

  goal_id="$(find_goal_id_by_title "$user_id" "$title")"
  if [[ -n "$goal_id" ]]; then
    echo "$goal_id"
    return
  fi

  payload="$(jq -n \
    --arg userId "$user_id" \
    --arg title "$title" \
    --arg description "$description" \
    --arg category "$category" \
    --arg targetDate "$target_date" \
    '{userId: $userId, title: $title, description: $description, category: $category, targetDate: $targetDate}')"

  response="$(api_request POST "/goals" "$payload")"
  extract_required_field "$response" "goalId" "POST /goals"
}

find_challenge_id_by_title() {
  local goal_id="$1"
  local title="$2"
  local encoded_goal_id
  local challenges

  encoded_goal_id="$(jq -rn --arg value "$goal_id" '$value|@uri')"
  challenges="$(api_request GET "/challenges?goalId=$encoded_goal_id")"
  validate_json "$challenges" "GET /challenges"
  echo "$challenges" | jq -r --arg title "$title" '.[] | select(.title == $title) | .challengeId' | head -n 1
}

get_challenge_status() {
  local goal_id="$1"
  local challenge_id="$2"
  local encoded_goal_id
  local challenges

  encoded_goal_id="$(jq -rn --arg value "$goal_id" '$value|@uri')"
  challenges="$(api_request GET "/challenges?goalId=$encoded_goal_id")"
  validate_json "$challenges" "GET /challenges"
  echo "$challenges" | jq -r --arg challengeId "$challenge_id" '.[] | select(.challengeId == $challengeId) | .status' | head -n 1
}

create_or_get_challenge() {
  local goal_id="$1"
  local title="$2"
  local description="$3"
  local xp_reward="$4"
  local challenge_id
  local payload
  local response

  challenge_id="$(find_challenge_id_by_title "$goal_id" "$title")"
  if [[ -n "$challenge_id" ]]; then
    echo "$challenge_id"
    return
  fi

  payload="$(jq -n \
    --arg goalId "$goal_id" \
    --arg title "$title" \
    --arg description "$description" \
    --argjson xpReward "$xp_reward" \
    '{goalId: $goalId, title: $title, description: $description, xpReward: $xpReward}')"

  response="$(api_request POST "/challenges" "$payload")"
  extract_required_field "$response" "challengeId" "POST /challenges"
}

complete_challenge_if_needed() {
  local goal_id="$1"
  local challenge_id="$2"
  local status
  local payload

  status="$(get_challenge_status "$goal_id" "$challenge_id")"
  if [[ -z "$status" ]]; then
    fail "No se encontro el reto $challenge_id al consultar la meta $goal_id."
  fi
  if [[ "$status" == "COMPLETED" ]]; then
    return
  fi

  payload="$(jq -n --arg challengeId "$challenge_id" '{challengeId: $challengeId}')"
  api_request PATCH "/challenges/complete" "$payload" >/dev/null
}

seed_goal_with_challenges() {
  local user_id="$1"
  local title="$2"
  local description="$3"
  local category="$4"
  local target_date="$5"
  local complete_count="$6"
  shift 6

  local goal_id
  local index
  local challenge_id
  local challenge_ids=()

  goal_id="$(create_or_get_goal "$user_id" "$title" "$description" "$category" "$target_date")"
  index=0

  while [[ "$#" -gt 0 ]]; do
    local challenge_title="$1"
    local challenge_description="$2"
    local xp_reward="$3"
    shift 3

    challenge_id="$(create_or_get_challenge "$goal_id" "$challenge_title" "$challenge_description" "$xp_reward")"
    challenge_ids+=("$challenge_id")
  done

  index=0
  for challenge_id in "${challenge_ids[@]}"; do
    if [[ "$index" -lt "$complete_count" ]]; then
      complete_challenge_if_needed "$goal_id" "$challenge_id"
    fi

    index=$((index + 1))
  done
}

seed_user() {
  local name="$1"
  local email="$2"
  local slug
  local user
  local user_id

  slug="$(slugify "$name")"
  echo "Preparando datos para $name <$email>"
  user="$(register_or_login_user "$name" "$email")"
  user_id="$(extract_required_field "$user" "userId" "auth para $email")"

  seed_goal_with_challenges \
    "$user_id" \
    "Demo - Dominar Arquitectura de Software" \
    "Practicar patrones, capas y buenas decisiones de diseño para proyectos empresariales." \
    "Tecnologia" \
    "2026-11-30" \
    2 \
    "Repasar arquitectura por capas" "Identificar responsabilidades de presentacion, aplicacion, dominio e infraestructura." 50 \
    "Crear diagrama del sistema" "Dibujar un flujo claro entre frontend, API y base de datos." 100 \
    "Documentar decisiones tecnicas" "Escribir notas cortas sobre decisiones importantes del proyecto." 50

  seed_goal_with_challenges \
    "$user_id" \
    "Demo - Mejorar rutina personal de estudio" \
    "Organizar sesiones de aprendizaje constantes durante la semana." \
    "Estudios" \
    "2026-12-15" \
    1 \
    "Planear semana de estudio" "Separar bloques de trabajo y descanso." 25 \
    "Completar sesion profunda" "Estudiar sin distracciones durante al menos una hora." 50 \
    "Hacer resumen semanal" "Registrar avances y puntos pendientes." 25

  seed_goal_with_challenges \
    "$user_id" \
    "Demo - Fortalecer habitos saludables de $slug" \
    "Mantener energia y constancia con pequenas acciones diarias." \
    "Salud/Deporte" \
    "2026-10-31" \
    0 \
    "Caminar 30 minutos" "Realizar una caminata continua durante el dia." 25 \
    "Tomar agua suficiente" "Cumplir una meta simple de hidratacion." 25 \
    "Pausa activa" "Estirar espalda, cuello y manos despues de estudiar o programar." 25
}

main() {
  require_command curl
  require_command jq
  check_api_ready

  echo "Poblando datos demo en $API_BASE_URL"
  echo "Contrasena demo para todos los usuarios: $SEED_PASSWORD"
  echo "Modo: solo API. Las tablas achievements y user_achievements quedan sin seed hasta tener endpoint."
  echo

  seed_user "Alex Cyber" "alex@lifequest.ai"
  seed_user "Elena Rostova" "elena@lifequest.ai"
  seed_user "Carlos Dev" "carlos@lifequest.ai"
  seed_user "Maria Quest" "maria@lifequest.ai"

  echo
  echo "Seed terminado."
  echo "Se poblaron usuarios, metas, retos, progreso y transacciones XP mediante la API."
  echo "Puedes iniciar sesion con cualquiera de estos correos usando la contrasena: $SEED_PASSWORD"
}

main "$@"
