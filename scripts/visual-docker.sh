#!/usr/bin/env bash
# Run the visual regression suite inside the pinned Playwright container so local
# rendering is byte-identical to CI. Pass a tests-package script as the first arg.
#
#   scripts/visual-docker.sh                 # check against committed baselines
#   scripts/visual-docker.sh test:visual:update   # regenerate baselines
set -euo pipefail

readonly IMAGE="mcr.microsoft.com/playwright:v1.60.0-noble"
readonly TARGET="${1:-test:visual}"
readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# A named volume persists the pnpm store (download cache) so installs stay fast.
# Every node_modules is an anonymous volume, recreated per run: this shadows host
# (macOS) binaries AND keeps all install state internally consistent. Persisting only
# some node_modules dirs would let `--frozen-lockfile` skip relinking the rest.
# Pin amd64 so Apple Silicon hosts render identically to the amd64 CI runner
# (emulated via Rosetta/QEMU). Without this, arm64 baselines would diff against CI.
docker run --rm --init --ipc=host \
  --platform=linux/amd64 \
  -v "${REPO_ROOT}:/work" \
  -v ds-visual-pnpm-store:/pnpm-store \
  -v /work/node_modules \
  -v /work/tests/node_modules \
  -v /work/packages/components/node_modules \
  -v /work/packages/core/node_modules \
  -v /work/packages/react/node_modules \
  -v /work/packages/storybook/node_modules \
  -v /work/packages/tokens/node_modules \
  -w /work \
  "${IMAGE}" \
  bash -euo pipefail -c "
    corepack enable
    pnpm config set store-dir /pnpm-store
    pnpm install --frozen-lockfile
    pnpm build
    pnpm --filter @ds/storybook build
    pnpm --filter @ds/tests ${TARGET}
  "
