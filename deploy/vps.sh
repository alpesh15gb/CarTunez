#!/usr/bin/env bash
# Only this new Compose project and the verified legacy frontend are changed.
set -Eeuo pipefail
umask 077
ROOT=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)
STATE="$ROOT/.deploy-state"
PROJECT=cartunez-cinematic
BUILDER=cartunez-cinematic-builder
LEGACY=cartunez-app
VHOST=${CARTUNEZ_NGINX_VHOST:-/etc/nginx/sites-enabled/cartunez.in}
MODE=${1:-help}
ARMED=0
BUILD_ACTIVE=0
die() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }
say() { printf '\n%s\n' "$*"; }
[[ "$MODE" =~ ^(stage|promote|rollback)$ ]] || { printf 'Usage: bash deploy/vps.sh {stage|promote|rollback}\n'; exit 2; }
for tool in docker git curl flock ss sha256sum; do command -v "$tool" >/dev/null || die "Required command missing: $tool"; done
mkdir -p -- "$STATE"
exec 9>"$STATE/lock"
flock -n 9 || die 'Another Cartunez deployment is running.'
docker compose version >/dev/null
REVISION=$(git -C "$ROOT" rev-parse HEAD)
[[ "$REVISION" =~ ^[0-9a-f]{40}$ ]] || die 'A committed Git checkout is required.'
export CARTUNEZ_IMAGE="cartunez-cinematic:$REVISION"
compose() { docker compose --project-name "$PROJECT" --file "$ROOT/compose.vps.yml" "$@"; }
inspect() { docker inspect "$1" --format "$2"; }
owner() {
  [[ $(inspect "$1" '{{index .Config.Labels "com.docker.compose.project"}}') == "$PROJECT" ]] &&
  [[ $(inspect "$1" '{{index .Config.Labels "in.cartunez.application"}}') == cinematic-frontend ]]
}
legacy_owner() {
  [[ $(inspect "$1" '{{index .Config.Labels "com.docker.compose.project"}}') == cartunez ]] &&
  [[ $(inspect "$1" '{{index .Config.Labels "com.docker.compose.service"}}') == cartunez ]]
}
wait_release() {
  local port=$1 revision=$2 attempt
  for attempt in {1..30}; do
    if curl --noproxy '*' -fsS --connect-timeout 2 --max-time 3 "http://127.0.0.1:$port/release.json" -o "$STATE/probe-release.json" 2>/dev/null &&
       grep -Fq '"app":"cartunez-cinematic"' "$STATE/probe-release.json" &&
       grep -Fq "\"revision\":\"$revision\"" "$STATE/probe-release.json"; then return 0; fi
    sleep 1
  done
  return 1
}
verify_assets() {
  local port=$1
  curl --noproxy '*' -fsS --max-time 10 "http://127.0.0.1:$port/" -o "$STATE/probe-index.html" || return 1
  grep -q 'v11-site' "$STATE/probe-index.html" || return 1
  curl --noproxy '*' -fsS --max-time 10 "http://127.0.0.1:$port/enquire/" -o /dev/null || return 1
  curl --noproxy '*' -fsS --max-time 15 "http://127.0.0.1:$port/models/bmw-m6-gt3.glb?v=ec94b6b22388" -o "$STATE/probe.glb" || return 1
  [[ $(sha256sum "$STATE/probe.glb" | cut -d ' ' -f 1) == ec94b6b22388aa558ee183d528e2f2a46a9cff2f1f1eb3c32d64fe5d9f5d265e ]] || return 1
  curl --noproxy '*' -fsS --max-time 10 -D "$STATE/probe-wasm.headers" "http://127.0.0.1:$port/draco/draco_decoder.wasm" -o /dev/null || return 1
  grep -iq '^Content-Type: application/wasm' "$STATE/probe-wasm.headers" || return 1
  [[ $(curl --noproxy '*' -sS --max-time 10 -o /dev/null -w '%{http_code}' -H 'Range: bytes=0-31' "http://127.0.0.1:$port/models/bmw-m6-gt3.glb") == 206 ]]
}
restore_previous() {
  local kind prior web
  kind=$(cat "$STATE/rollback-kind")
  web=$(compose ps -a -q web)
  if [[ -n "$web" ]]; then owner "$web" || return 1; fi
  if [[ "$kind" == legacy ]]; then
    prior=$(cat "$STATE/rollback-container")
    [[ "$prior" =~ ^[0-9a-f]{64}$ ]] && legacy_owner "$prior" || return 1
    compose stop web || return 1
    docker start "$prior" || return 1
    curl --noproxy '*' -fsS --retry 5 --retry-delay 1 --retry-connrefused --max-time 10 http://127.0.0.1:3015/ -o /dev/null || return 1
  elif [[ "$kind" == cinematic ]]; then
    prior=$(cat "$STATE/rollback-image")
    [[ "$prior" =~ ^cartunez-cinematic:[0-9a-f]{40}$ ]] || return 1
    CARTUNEZ_IMAGE="$prior" compose up -d --no-deps --no-build --pull never web || return 1
    wait_release 3015 "${prior#*:}" || return 1
  else return 1; fi
  printf '%s\n' rolled-back >"$STATE/status"
  say 'Previous frontend restored. Nginx, Medusa, databases and other apps were not modified.'
}
on_exit() {
  local code=$?
  if [[ "$BUILD_ACTIVE" == 1 ]]; then docker buildx stop "$BUILDER" >/dev/null 2>&1 || true; fi
  if [[ "$ARMED" == 1 ]]; then
    trap - EXIT INT TERM
    set +e
    say 'Promotion did not complete; restoring the previous frontend.'
    if ! restore_previous; then printf 'Automatic rollback needs attention. Run: bash deploy/vps.sh rollback\n' >&2; fi
    exit 1
  fi
  exit "$code"
}
trap on_exit EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

if [[ "$MODE" == stage ]]; then
  [[ -z $(git -C "$ROOT" status --porcelain) ]] || die 'Checkout has local changes. Commit/review them before building.'
  compose config --quiet
  preview=$(compose ps -a -q preview)
  if [[ -n "$preview" ]]; then owner "$preview" || die 'Preview container ownership mismatch.'
  elif [[ -n $(ss -H -ltn 'sport = :3016') ]]; then die 'Port 3016 is occupied; no service has been changed.'; fi
  if ! docker image inspect "$CARTUNEZ_IMAGE" >/dev/null 2>&1; then
    available=$(awk '/^MemAvailable:/ {print $2}' /proc/meminfo)
    [[ "$available" =~ ^[0-9]+$ && "$available" -ge 2621440 ]] || die 'Build needs 2.5 GiB available RAM. Load a prebuilt image instead; the current site is untouched.'
    docker buildx version >/dev/null
    if ! docker buildx inspect "$BUILDER" >/dev/null 2>&1; then
      docker buildx create --name "$BUILDER" --driver docker-container --driver-opt memory=2g,memory-swap=2g,cpu-period=100000,cpu-quota=150000 >/dev/null
    fi
    [[ $(docker buildx inspect "$BUILDER" --format '{{.Driver}}') == docker-container ]] || die 'Unexpected builder driver.'
    docker buildx inspect "$BUILDER" --bootstrap >/dev/null
    [[ $(inspect "buildx_buildkit_${BUILDER}0" '{{.HostConfig.Memory}}') == 2147483648 ]] || die 'Builder memory limit mismatch.'
    [[ $(inspect "buildx_buildkit_${BUILDER}0" '{{.HostConfig.CpuQuota}}') == 150000 ]] || die 'Builder CPU limit mismatch.'
    BUILD_ACTIVE=1
    docker buildx build --builder "$BUILDER" --load --build-arg "SOURCE_COMMIT=$REVISION" --tag "$CARTUNEZ_IMAGE" "$ROOT"
    docker buildx stop "$BUILDER"
    BUILD_ACTIVE=0
  fi
  compose up -d --no-deps --no-build --pull never preview
  wait_release 3016 "$REVISION" || die 'Preview release check failed; the current site is untouched.'
  verify_assets 3016 || die 'Preview asset checks failed; the current site is untouched.'
  printf '%s\n' "$REVISION" >"$STATE/staged-revision"
  say "STAGED $REVISION on 127.0.0.1:3016. Homepage, enquiry, BMW checksum, WASM MIME and range requests passed."
  say 'Next: bash deploy/vps.sh promote'
elif [[ "$MODE" == promote ]]; then
  [[ -f "$STATE/staged-revision" && $(cat "$STATE/staged-revision") == "$REVISION" ]] || die 'Stage this exact commit first.'
  wait_release 3016 "$REVISION" || die 'Staged preview is unavailable.'
  verify_assets 3016 || die 'Staged assets failed verification.'
  [[ -f "$VHOST" ]] || die 'Expected Cartunez Nginx vhost is missing.'
  grep -Fq 'server_name cartunez.in www.cartunez.in;' "$VHOST" || die 'Cartunez domain vhost mismatch.'
  [[ $(grep -Ec '^[[:space:]]*proxy_pass http://127\.0\.0\.1:3015;' "$VHOST") == 3 ]] || die 'Expected three frontend proxy routes on port 3015.'
  current=$(compose ps -q web)
  if [[ -n "$current" ]]; then
    owner "$current" || die 'Production container ownership mismatch.'
    [[ $(docker port "$current" 8080/tcp) == 127.0.0.1:3015 ]] || die 'Production port mismatch.'
    prior=$(inspect "$current" '{{.Config.Image}}')
    [[ "$prior" =~ ^cartunez-cinematic:[0-9a-f]{40}$ ]] || die 'Unexpected previous image.'
    printf '%s\n' "$prior" >"$STATE/rollback-image"
    printf '%s\n' cinematic >"$STATE/rollback-kind"
  else
    old=$(inspect "$LEGACY" '{{.Id}}')
    legacy_owner "$old" || die 'Legacy container ownership mismatch.'
    [[ $(inspect "$old" '{{.State.Running}}') == true ]] || die 'Legacy frontend is not running.'
    [[ $(inspect "$old" '{{.HostConfig.RestartPolicy.Name}}') == unless-stopped ]] || die 'Unexpected legacy restart policy.'
    [[ $(docker port "$old" 3000/tcp) == 127.0.0.1:3015 ]] || die 'Legacy port mismatch.'
    printf '%s\n' "$old" >"$STATE/rollback-container"
    printf '%s\n' legacy >"$STATE/rollback-kind"
  fi
  # This is the only point where the existing frontend is stopped.
  ARMED=1
  if [[ $(cat "$STATE/rollback-kind") == legacy ]]; then docker stop --time 20 "$old"; fi
  compose up -d --no-deps --no-build --pull never web
  wait_release 3015 "$REVISION" || die 'Production release check failed.'
  verify_assets 3015 || die 'Production asset checks failed.'
  printf '%s\n' "$REVISION" >"$STATE/live-revision"
  printf '%s\n' live >"$STATE/status"
  ARMED=0
  compose stop preview
  say "LIVE $REVISION on 127.0.0.1:3015. Existing system Nginx/TLS and Medusa routes are unchanged."
  say 'Verify: curl -fsS https://cartunez.in/release.json'
  say 'Rollback: bash deploy/vps.sh rollback'
else
  [[ -f "$STATE/rollback-kind" ]] || die 'No recorded previous frontend exists.'
  restore_previous || die 'Rollback failed; inspect only the Cartunez frontend containers.'
fi
