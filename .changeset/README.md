# Changesets

This folder is managed by the [changesets](https://github.com/changesets/changesets) tool.

Every PR that changes code under `packages/**/src` must include a changeset describing the change and selecting a semver bump (major / minor / patch). Run `pnpm changeset` to create one.

Semver policy for this repo is defined in the implementation plan under "Versioning & release".
