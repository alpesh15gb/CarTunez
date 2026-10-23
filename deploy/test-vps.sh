#!/usr/bin/env bash
# Isolated failure-path tests. Docker/curl/git are mocked; no real apps change.
set -euo pipefail
SOURCE=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
TEST_ROOT=$(mktemp -d /tmp/cartunez-vps-test.XXXXXX)
mkdir -p "$TEST_ROOT/repo/deploy" "$TEST_ROOT/bin" "$TEST_ROOT/mock"
cp "$SOURCE/deploy/vps.sh" "$TEST_ROOT/repo/deploy/"
cp "$SOURCE/compose.vps.yml" "$TEST_ROOT/repo/"
export TEST_REVISION=1111111111111111111111111111111111111111
export TEST_PREVIOUS=2222222222222222222222222222222222222222
export MOCK="$TEST_ROOT/mock" MODEL="$SOURCE/public/models/bmw-m6-gt3.glb"
export REAL_AWK=$(command -v awk)
export CARTUNEZ_NGINX_VHOST="$TEST_ROOT/cartunez.conf"
printf '%s\n' 'server_name cartunez.in www.cartunez.in;' \
  'proxy_pass http://127.0.0.1:3015;' 'proxy_pass http://127.0.0.1:3015;' 'proxy_pass http://127.0.0.1:3015;' >"$CARTUNEZ_NGINX_VHOST"
cat >"$TEST_ROOT/bin/git" <<'MOCK'
#!/usr/bin/env bash
case "$*" in *rev-parse*) echo "$TEST_REVISION";; esac
MOCK
cat >"$TEST_ROOT/bin/awk" <<'MOCK'
#!/usr/bin/env bash
# Make build preflight deterministic regardless of the test host's free RAM.
if [[ ${!#} == /proc/meminfo ]]; then printf '8388608\n'; else exec "$REAL_AWK" "$@"; fi
MOCK
cat >"$TEST_ROOT/bin/docker" <<'MOCK'
#!/usr/bin/env bash
set -eu
old=$(printf 'a%.0s' {1..64}); web=$(printf 'b%.0s' {1..64}); preview=$(printf 'c%.0s' {1..64})
if [[ $1 == compose ]]; then
  shift
  while [[ ${1:-} == --project-name || ${1:-} == --file ]]; do shift 2; done
  command=${1:-}; shift || true; service=${!#}
  case "$command" in
    version|config) exit 0;;
    ps) if [[ $service == web && -f $MOCK/web-exists ]]; then
          if [[ "$*" == *'-a'* || -f $MOCK/web-running ]]; then echo "$web"; fi
        elif [[ $service == preview && -f $MOCK/preview ]]; then echo "$preview"; fi;;
    up) echo "compose-up $service" >>"$MOCK/events"
        if [[ $service == web ]]; then touch "$MOCK/web-exists" "$MOCK/web-running"; echo "$CARTUNEZ_IMAGE" >"$MOCK/image"; else touch "$MOCK/preview"; fi;;
    stop) echo "compose-stop $service" >>"$MOCK/events"
          if [[ $service == web ]]; then rm -f "$MOCK/web-running"; else rm -f "$MOCK/preview"; fi;;
    *) echo "Unexpected compose command: $command" >&2; exit 99;;
  esac
elif [[ $1 == inspect ]]; then
  target=$2; format=$4
  case "$format" in
    *'.Id'*) echo "$old";;
    *'com.docker.compose.project'*) if [[ $target == "$old" || $target == cartunez-app ]]; then echo "${BAD_OWNER:-cartunez}"; else echo cartunez-cinematic; fi;;
    *'com.docker.compose.service'*) echo cartunez;;
    *'in.cartunez.application'*) echo cinematic-frontend;;
    *'.State.Running'*) if [[ -f $MOCK/legacy-running ]]; then echo true; else echo false; fi;;
    *'.HostConfig.RestartPolicy.Name'*) echo unless-stopped;;
    *'.HostConfig.Memory'*) echo "${BUILDER_MEMORY:-2147483648}";;
    *'.HostConfig.CpuQuota'*) echo 150000;;
    *'.Config.Image'*) cat "$MOCK/image";;
    *) echo "Unexpected inspect format: $format" >&2; exit 99;;
  esac
elif [[ $1 == port ]]; then echo 127.0.0.1:3015
elif [[ $1 == image && $2 == inspect ]]; then
  if [[ ${NEEDS_BUILD:-0} == 1 ]]; then exit 1; fi
elif [[ $1 == buildx ]]; then
  case "$2" in
    version) echo 'github.com/docker/buildx v0.11.2';;
    inspect)
      [[ $3 == cartunez-cinematic-builder ]] || exit 99
      # Older Buildx supports plain inspect output, but not --format.
      for argument in "$@"; do
        if [[ $argument == --format ]]; then echo 'unknown flag: --format' >&2; exit 125; fi
      done
      if [[ "$*" == *--bootstrap* ]]; then
        echo builder-bootstrap >>"$MOCK/events"
      elif [[ ! -f $MOCK/builder-exists ]]; then exit 1; fi
      printf 'Name: cartunez-cinematic-builder\nDriver: %s\n\nNodes:\n' "${BUILDER_DRIVER:-docker-container}";;
    create)
      [[ "$*" == *'--name cartunez-cinematic-builder --driver docker-container'* ]] || exit 99
      [[ "$*" == *'memory=2g,memory-swap=2g,cpu-period=100000,cpu-quota=150000'* ]] || exit 99
      touch "$MOCK/builder-exists"; echo builder-create >>"$MOCK/events";;
    build)
      [[ "$*" == *'--builder cartunez-cinematic-builder --load'* ]] || exit 99
      [[ "$*" == *"SOURCE_COMMIT=$TEST_REVISION"* ]] || exit 99
      [[ "$*" == *"--tag cartunez-cinematic:$TEST_REVISION"* ]] || exit 99
      echo builder-build >>"$MOCK/events"
      if [[ ${FAIL_BUILD:-0} == 1 ]]; then exit 1; fi;;
    stop)
      [[ $3 == cartunez-cinematic-builder ]] || exit 99
      echo builder-stop >>"$MOCK/events";;
    *) echo "Unexpected Buildx command: $*" >&2; exit 99;;
  esac
elif [[ $1 == stop ]]; then echo legacy-stop >>"$MOCK/events"; rm -f "$MOCK/legacy-running"
elif [[ $1 == start ]]; then echo legacy-start >>"$MOCK/events"; touch "$MOCK/legacy-running"
else echo "Unexpected Docker command: $*" >&2; exit 99; fi
MOCK
cat >"$TEST_ROOT/bin/curl" <<'MOCK'
#!/usr/bin/env bash
set -eu
output=/dev/null; headers=; range=0; url=
while (($#)); do case "$1" in
  -o) output=$2;shift 2;; -D) headers=$2;shift 2;; -H) range=1;shift 2;;
  http*) url=$1;shift;; *) shift;; esac; done
if [[ "$url" == *release.json ]]; then
  revision=$TEST_REVISION
  if [[ "$url" == *:3015/* ]]; then
    [[ -f $MOCK/web-running ]] || exit 22
    revision=$(cut -d: -f2 "$MOCK/image")
    if [[ ${FAIL_HEALTH:-0} == 1 && $revision == "$TEST_REVISION" ]]; then exit 22; fi
  fi
  printf '{"app":"cartunez-cinematic","revision":"%s"}' "$revision" >"$output"
elif [[ "$url" == *enquire/* && ${FAIL_ASSET:-0} == 1 ]]; then exit 22
elif [[ $range == 1 ]]; then printf 206
elif [[ "$url" == *bmw-m6-gt3.glb* ]]; then cp "$MODEL" "$output"
elif [[ "$url" == *draco_decoder.wasm ]]; then printf 'Content-Type: application/wasm\r\n' >"$headers"
else printf '<main class="v11-site">CARTUNEZ</main>' >"$output"; fi
MOCK
for command in flock ss sleep; do printf '#!/usr/bin/env bash\nexit 0\n' >"$TEST_ROOT/bin/$command"; done
chmod +x "$TEST_ROOT/bin/"*
export PATH="$TEST_ROOT/bin:$PATH"
reset_case() {
  rm -f "$MOCK/"*
  mkdir -p "$TEST_ROOT/repo/.deploy-state"
  rm -f "$TEST_ROOT/repo/.deploy-state/"*
  touch "$MOCK/legacy-running" "$MOCK/preview" "$MOCK/events"
  echo "$TEST_REVISION" >"$TEST_ROOT/repo/.deploy-state/staged-revision"
  export BAD_OWNER=cartunez FAIL_ASSET=0 FAIL_HEALTH=0 NEEDS_BUILD=0
  export BUILDER_DRIVER=docker-container BUILDER_MEMORY=2147483648 FAIL_BUILD=0
}
run() { bash "$TEST_ROOT/repo/deploy/vps.sh" "$1" >"$MOCK/output" 2>&1; }
fail() { cat "$MOCK/output"; echo "FAIL $*" >&2; exit 1; }
reset_case; run stage || fail stage
[[ -f $MOCK/legacy-running ]] && ! grep -q legacy-stop "$MOCK/events" || fail 'stage touched legacy'
echo 'PASS staging verifies assets without stopping the current frontend'
reset_case; export NEEDS_BUILD=1; touch "$MOCK/builder-exists"
run stage || fail 'stage with existing older Buildx builder'
grep -q builder-build "$MOCK/events" && grep -q builder-stop "$MOCK/events" || fail 'builder did not build and stop'
! grep -q builder-create "$MOCK/events" && ! grep -q legacy-stop "$MOCK/events" || fail 'existing builder not reused safely'
echo 'PASS staging builds with plain Buildx inspect and reuses the existing dedicated builder'
reset_case; export NEEDS_BUILD=1
run stage || fail 'stage with new dedicated builder'
grep -q builder-create "$MOCK/events" && grep -q builder-build "$MOCK/events" || fail 'dedicated builder not created'
! grep -q legacy-stop "$MOCK/events" || fail 'build stopped legacy'
echo 'PASS missing dedicated builder is created with CPU and memory limits'
reset_case; export NEEDS_BUILD=1 BUILDER_DRIVER=docker; touch "$MOCK/builder-exists"
if run stage; then fail 'unexpected builder driver accepted'; fi
! grep -Eq 'builder-bootstrap|builder-build|legacy-stop' "$MOCK/events" || fail 'wrong builder driver changed services'
echo 'PASS unexpected builder driver aborts before bootstrap or frontend changes'
reset_case; export NEEDS_BUILD=1 BUILDER_MEMORY=0; touch "$MOCK/builder-exists"
if run stage; then fail 'unlimited builder accepted'; fi
grep -q builder-stop "$MOCK/events" || fail 'invalid builder was left running'
! grep -Eq 'builder-build|legacy-stop' "$MOCK/events" || fail 'invalid builder changed frontend'
echo 'PASS resource mismatch stops only the dedicated builder and keeps the frontend running'
reset_case; export NEEDS_BUILD=1 FAIL_BUILD=1; touch "$MOCK/builder-exists"
if run stage; then fail 'failed image build accepted'; fi
grep -q builder-stop "$MOCK/events" || fail 'failed build left builder running'
! grep -Eq 'compose-up|legacy-stop' "$MOCK/events" || fail 'failed build changed frontend'
echo 'PASS failed image build stops its builder without changing frontend containers'
reset_case; export FAIL_ASSET=1
if run stage; then fail 'bad enquiry asset accepted'; fi
! grep -q legacy-stop "$MOCK/events" || fail 'asset failure stopped legacy'
echo 'PASS failed asset checks keep the existing frontend running'
reset_case; export BAD_OWNER=another-project
if run promote; then fail 'foreign legacy accepted'; fi
! grep -q legacy-stop "$MOCK/events" || fail 'foreign legacy stopped'
echo 'PASS unexpected container ownership aborts before cutover'
reset_case; run promote || fail promote
[[ -f $MOCK/web-running && ! -f $MOCK/legacy-running ]] || fail 'promotion state'
run rollback || fail rollback
[[ -f $MOCK/legacy-running && ! -f $MOCK/web-running ]] || fail 'rollback state'
echo 'PASS successful cutover and manual rollback affect only frontend targets'
reset_case; export FAIL_HEALTH=1
if run promote; then fail 'failed production accepted'; fi
[[ -f $MOCK/legacy-running && ! -f $MOCK/web-running ]] || fail 'automatic rollback'
grep -q legacy-start "$MOCK/events" || fail 'legacy was not restored'
echo 'PASS production health failure automatically restores the legacy container'
reset_case; rm "$MOCK/legacy-running"; touch "$MOCK/web-exists" "$MOCK/web-running"
echo "cartunez-cinematic:$TEST_PREVIOUS" >"$MOCK/image"; export FAIL_HEALTH=1
if run promote; then fail 'failed upgrade accepted'; fi
[[ $(cat "$MOCK/image") == "cartunez-cinematic:$TEST_PREVIOUS" && -f $MOCK/web-running ]] || fail 'prior cinematic image not restored'
! grep -q legacy-stop "$MOCK/events" || fail 'upgrade touched legacy'
echo 'PASS subsequent upgrade failure restores the previous cinematic image'
