import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const SOURCE_EXTENSION = /\.(?:cjs|css|html|js|json|jsx|md|mdx|mjs|sh|svg|ts|tsx|txt|yaml|yml)$/;
const EXCLUDED_PATHS = [
  /\/CHANGELOG\.md$/,
  /^pnpm-lock\.yaml$/,
  /^packages\/components\/custom-elements\.json$/,
  /^scripts\/lint-copy\.mjs$/,
];
const BRITISH_ISE_STEMS = [
  'analys',
  'customis',
  'finalis',
  'initialis',
  'normalis',
  'optimis',
  'organis',
  'prioritis',
  'recognis',
  'serialis',
  'visualis',
];
const BRITISH_NOUNS = ['behaviour', 'centre', 'colour', 'favourite', 'licence', 'neighbour', 'recolour'];
const BRITISH_IRREGULARS = [
  'cancelled',
  'cancelling',
  'centred',
  'centring',
  'coloured',
  'colouring',
  'colourful',
  'grey',
  'labelled',
  'labelling',
  'modelling',
  'neighbouring',
  'recoloured',
  'recolouring',
  'unlabelled',
];

const BRITISH_SPELLING_PATTERN = [
  `(?:${BRITISH_ISE_STEMS.join('|')})(?:e|es|ed|ing|able|ation|ations)`,
  `(?:${BRITISH_NOUNS.join('|')})s?`,
  `(?:${BRITISH_IRREGULARS.join('|')})`,
].join('|');

const FORBIDDEN_COPY = [
  { pattern: /[…—–“”‘’]/u, message: 'typographic punctuation' },
  {
    pattern: new RegExp(`\\b(?:${BRITISH_SPELLING_PATTERN})\\b`, 'i'),
    message: 'British English spelling',
  },
];

function isInWorkingTree(file) {
  return existsSync(file);
}

function trackedSourceFiles() {
  return execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
    .split('\0')
    .filter(Boolean)
    .filter((file) => SOURCE_EXTENSION.test(file))
    .filter((file) => !EXCLUDED_PATHS.some((pattern) => pattern.test(file)))
    .filter(isInWorkingTree);
}

function findViolations(file) {
  const source = readFileSync(file, 'utf8');
  return FORBIDDEN_COPY.filter(({ pattern }) => pattern.test(source)).map(({ message }) => `${file}: ${message}`);
}

const violations = trackedSourceFiles().flatMap(findViolations);

if (violations.length > 0) {
  console.error(violations.join('\n'));
  process.exitCode = 1;
}
