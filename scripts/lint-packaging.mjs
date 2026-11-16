import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const packages = ['packages/tokens', 'packages/core', 'packages/components', 'packages/react'];

const esmOnlyIgnoredRules = ['cjs-resolves-to-esm'];

function run(command, args) {
  return spawnSync(command, args, { stdio: 'inherit', shell: false }).status === 0;
}

function findCssEntrypoints(dir) {
  const { exports: map = {} } = JSON.parse(readFileSync(`${dir}/package.json`, 'utf8'));
  return Object.keys(map)
    .filter((key) => key.endsWith('.css'))
    .map((key) => key.replace(/^\.\/?/, ''));
}

let failed = false;

for (const dir of packages) {
  console.log(`\n=== ${dir} ===`);
  if (!run('npx', ['publint', dir])) {
    failed = true;
  }

  const args = ['attw', '--pack', dir, '--profile', 'node16', '--ignore-rules', ...esmOnlyIgnoredRules];
  const styles = findCssEntrypoints(dir);
  if (styles.length > 0) {
    args.push('--exclude-entrypoints', ...styles);
  }
  if (!run('npx', args)) {
    failed = true;
  }
}

process.exit(failed ? 1 : 0);
