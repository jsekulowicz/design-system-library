import { spawnSync } from 'node:child_process';

const packages = ['packages/tokens', 'packages/core', 'packages/components', 'packages/react'];

// Every package is ESM-only by design, so a require() resolving to ESM is intended.
const ignoredRules = ['cjs-resolves-to-esm'];

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit', shell: false });
  return result.status === 0;
}

let failed = false;

for (const dir of packages) {
  console.log(`\n=== ${dir} ===`);
  if (!run('npx', ['publint', dir])) {
    failed = true;
  }
  if (!run('npx', ['attw', '--pack', dir, '--profile', 'node16', '--ignore-rules', ...ignoredRules])) {
    failed = true;
  }
}

process.exit(failed ? 1 : 0);
