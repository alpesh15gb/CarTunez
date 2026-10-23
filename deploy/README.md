# CARTUNEZ VPS deployment

This repository contains the verified Ignition 11 homepage and its complete runtime assets. The runtime BMW is optimized, the GLB source attribution is retained, and Inter is served locally after the build. The production build is a Next.js static export; the container needs no Node.js server, environment secrets, database or Medusa migration.

## Confirmed VPS target

The existing frontend is `cartunez-app`, Compose project `cartunez`, service `cartunez`, restart policy `unless-stopped`, published as `127.0.0.1:3015 -> 3000/tcp`. `/etc/nginx/sites-enabled/cartunez.in` forwards `/`, `/_next/static` and `/models` to `3015`. Its `/app`, `/admin` and `/store` routes go to Medusa on `9000`.

The new frontend uses a separate Compose project, `cartunez-cinematic`. It publishes only loopback ports: preview `3016`, production `3015`. Its internal Nginx listens on `8080`. This container-local Nginx configuration is separate from the VPS's system Nginx. The deployment never edits or reloads the system Nginx, changes TLS certificates, runs the old project's Compose commands, stops Medusa, migrates data or removes Docker volumes/images.

## First deployment

Run as the VPS root user, as in the verified inventory:

```bash
git clone https://github.com/alpesh15gb/CarTunez.git /opt/cartunez-cinematic
cd /opt/cartunez-cinematic
bash deploy/vps.sh stage
```

Wait for `STAGED ...` and the successful asset-check message. The original site is still running at this point.

```bash
cd /opt/cartunez-cinematic
bash deploy/vps.sh promote
curl -fsS https://cartunez.in/release.json
```

The response must identify `cartunez-cinematic`, `ignition-11`, and the same commit printed by `git rev-parse HEAD`. Then open `https://cartunez.in/?experience=full` and test the headlights, camera, Pioneer preview and enquiry.

Promotion briefly stops only the old `cartunez-app` frontend to release port 3015, then starts the new frontend there. A few seconds of frontend downtime are possible. The old container and image are retained. Its verified `unless-stopped` policy keeps it stopped after a host restart. Do not start the old `cartunez` Compose frontend while the new frontend owns port 3015.

## Rollback

```bash
cd /opt/cartunez-cinematic
bash deploy/vps.sh rollback
```

On first deployment, this stops only the new frontend and starts the retained old container by its recorded ID. For later releases, it restores the previous cinematic image. Failed production promotion invokes the same recovery automatically. State is stored in the ignored `.deploy-state/` directory; keep that directory when updating the checkout.

## Later updates

The SEO/local-search update uses the same isolated update procedure below. Its build verifies all ten public pages, structured data, canonical/social URLs and internal links. After promotion, check `/services/`, `/visit/` and `/sitemap.xml`. Search Console and Google Business Profile follow-up steps are documented in `docs/SEO-GEO.md`.

```bash
cd /opt/cartunez-cinematic
git pull --ff-only
bash deploy/vps.sh stage
bash deploy/vps.sh promote
curl -fsS https://cartunez.in/release.json
```

Every image is tagged with its full Git commit, so a build never overwrites the previous release's image. Stage and promote must use the same clean commit. No force pull/reset or whole-stack restart is required.

If an earlier staging attempt failed with `unknown flag: --format` from Buildx, run `git pull --ff-only` and retry `bash deploy/vps.sh stage` in the existing checkout. The script now reads the documented plain `buildx inspect` output, so no Docker upgrade or daemon restart is needed. It reuses the dedicated builder created by the failed attempt. Staging does not stop the current frontend.

## Resource and ownership checks

The script requires Bash, Git, Docker Compose, Buildx, curl, `ss`, `flock` and `sha256sum`. Staging uses a dedicated builder, with 2 GiB RAM, no extra swap and a 1.5 CPU limit; it stops that builder after building. It requires at least 2.5 GiB currently available RAM before a build. If resources or preview port 3016 are unavailable, it exits without stopping the current frontend. Runtime containers are capped at 128 MiB, 0.5 CPU and 100 processes, run without root capabilities and use a read-only filesystem with only a temporary writable directory.

Ownership checks match the known old project/service and the new project's application label. The script validates the three expected frontend proxy routes, but never writes the vhost. The only existing container stopped during first promotion is the verified legacy frontend. Docker Compose commands always name the new project and the individual `preview` or `web` service, with `--no-deps`; no `down`, orphan removal, global prune, daemon restart or database operation is used.

The stage and production checks verify the release commit, homepage marker, enquiry route, exact BMW SHA-256, WASM content type and HTTP 206 range support. The GLB URL has a content-version query to bypass the old domain's 30-day model cache. HTML is revalidated, hashed JS/CSS is cached immutably, and missing pages return 404.

## Optional build on another machine

If the VPS has less available memory, build the image on another Linux-capable Docker machine from the same clean commit:

```bash
revision=$(git rev-parse HEAD)
docker build --build-arg SOURCE_COMMIT="$revision" -t "cartunez-cinematic:$revision" .
docker image save -o cartunez-image.tar "cartunez-cinematic:$revision"
```

Transfer that archive to the VPS, run `docker image load -i cartunez-image.tar`, then `bash deploy/vps.sh stage`. Stage reuses an already loaded image for that commit, so it skips the VPS build. Archive transfer does not require sharing database or application secrets. The image must match the VPS CPU architecture.

## Verification performed

- Actual resource-limited Linux Docker build: Next.js static export and TypeScript pass.
- Runtime tested with the same read-only filesystem, capabilities, memory/CPU caps and temporary directory as the Compose services.
- HTTP checks pass for homepage, enquiry, model, decoder and poster; binary types and range response are correct.
- `deploy/test-vps.sh`: isolated tests mock Docker and curl, covering Buildx compatibility without `--format`, existing/new builders, resource limits and build failure cleanup, staging without production changes, failed assets, wrong ownership, successful promotion/manual rollback, automatic rollback on failed production health and recovery to a previous cinematic image.

Run the failure-path tests in a disposable Bash container:

```bash
docker run --rm -v "$PWD:/workspace:ro" -w /workspace bash:5 bash deploy/test-vps.sh
```

References: [Docker's static Next.js container guide](https://docs.docker.com/guides/nextjs), [Compose service-scoped updates](https://docs.docker.com/reference/cli/docker/compose/up/), [builder resource limits](https://docs.docker.com/build/builders/drivers/docker-container/), [the unless-stopped policy](https://docs.docker.com/engine/containers/start-containers-automatically/).
