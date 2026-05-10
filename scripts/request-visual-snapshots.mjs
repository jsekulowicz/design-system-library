#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const workflowFile = 'visual-snapshots.yml';

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    return;
  }

  ensureCommand('gh', ['--version'], 'Install GitHub CLI to request CI visual baselines.');
  ensureCommand('gh', ['auth', 'status'], 'Authenticate GitHub CLI with `gh auth login`.');

  const branch = args.branch ?? readGit(['branch', '--show-current']);
  const workflowRef = args.workflowRef ?? branch;

  ensureBranch(branch);
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

function ensureCommand(command, args, message) {
  const result = spawnSync(command, args, { encoding: 'utf8', stdio: 'pipe' });

  if (result.status !== 0) {
    fail(message);
  }
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

function fail(message) {
  console.error(message);
  process.exit(1);
}

main();
