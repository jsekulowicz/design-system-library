#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const workflowFile = 'visual-snapshots.yml';

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    return;
  }

  const branch = args.branch ?? readGit(['branch', '--show-current']);
  const workflowRef = args.workflowRef ?? branch;

  ensureBranch(branch);

  if (!commandSucceeds('gh', ['--version'])) {
    printManualDispatch(branch, workflowRef, 'GitHub CLI is not installed or not on PATH.');
    process.exit(1);
  }

  if (!commandSucceeds('gh', ['auth', 'status'])) {
    printManualDispatch(branch, workflowRef, 'GitHub CLI is not authenticated.');
    process.exit(1);
  }

  ensureCleanTree();
  ensureBranchIsPushed(branch);

  run('gh', [
    'workflow',
    'run',
    workflowFile,
    '--ref',
    workflowRef,
    '-f',
    `branch=${branch}`,
  ]);

  console.log(`Requested ${workflowFile} for ${branch} using workflow ref ${workflowRef}.`);
  console.log('GitHub Actions will commit updated PNG baselines if screenshots changed.');
}

function parseArgs(args) {
  const result = { branch: undefined, workflowRef: undefined, help: false };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === '--') {
      continue;
    }

    if (arg === '--help' || arg === '-h') {
      result.help = true;
      continue;
    }

    if (arg === '--branch') {
      result.branch = readValue(args, index, arg);
      index += 1;
      continue;
    }

    if (arg === '--workflow-ref') {
      result.workflowRef = readValue(args, index, arg);
      index += 1;
      continue;
    }

    fail(`Unknown argument: ${arg}`);
  }

  return result;
}

function readValue(args, index, name) {
  const value = args[index + 1];

  if (!value) {
    fail(`Missing value for ${name}.`);
  }

  return value;
}

function commandSucceeds(command, args) {
  const result = spawnSync(command, args, { encoding: 'utf8', stdio: 'pipe' });
  return result.status === 0;
}

function ensureBranch(branch) {
  if (!branch) {
    fail('Could not resolve the current Git branch.');
  }
}

function ensureCleanTree() {
  const status = readGit(['status', '--short']);

  if (status) {
    fail('Commit or stash local changes before requesting CI visual baselines.');
  }
}

function ensureBranchIsPushed(branch) {
  const head = readGit(['rev-parse', branch]);
  const upstream = readGit(['rev-parse', `${branch}@{upstream}`]);

  if (head !== upstream) {
    fail(`Push ${branch} before requesting CI visual baselines.`);
  }
}

function readGit(args) {
  return run('git', args).stdout.trim();
}

function run(command, args) {
  const result = spawnSync(command, args, { encoding: 'utf8', stdio: 'pipe' });

  if (result.status !== 0) {
    const detail = result.stderr.trim() || result.stdout.trim();
    fail(detail || `${command} ${args.join(' ')} failed.`);
  }

  return result;
}

function printHelp() {
  console.log(`Request CI-generated visual screenshot baselines.

Usage:
  pnpm test:visual:update:ci
  pnpm test:visual:update:ci -- --branch main
  pnpm test:visual:update:ci -- --branch feature/foo --workflow-ref main

Options:
  --branch        Branch that GitHub Actions should checkout and update.
  --workflow-ref  Branch or tag containing ${workflowFile}. Defaults to --branch.
`);
}

function printManualDispatch(branch, workflowRef, reason) {
  console.error(reason);
  console.error('');
  console.error('Either install GitHub CLI and run `gh auth login`, or dispatch the workflow manually:');
  console.error(`1. Push ${branch}.`);
  console.error(`2. Open ${workflowUrl()}.`);
  console.error(`3. Choose workflow ref: ${workflowRef}.`);
  console.error(`4. Enter branch input: ${branch}.`);
}

function workflowUrl() {
  const remote = spawnSync('git', ['remote', 'get-url', 'origin'], {
    encoding: 'utf8',
    stdio: 'pipe',
  });
  const slug = parseGitHubSlug(remote.stdout.trim());

  if (!slug) {
    return `the ${workflowFile} workflow in GitHub Actions`;
  }

  return `https://github.com/${slug}/actions/workflows/${workflowFile}`;
}

function parseGitHubSlug(remote) {
  const normalized = remote.replace(/\.git$/, '');
  const match = normalized.match(/github\.com[:/]([^/]+\/[^/]+)$/);
  return match?.[1];
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

main();
