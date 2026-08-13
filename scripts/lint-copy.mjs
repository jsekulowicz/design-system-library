import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const SOURCE_EXTENSION = /\.(?:cjs|css|html|js|json|jsx|md|mdx|mjs|sh|svg|ts|tsx|txt|yaml|yml)$/;
const EXCLUDED_PATHS = [
  /\/CHANGELOG\.md$/,
  /^pnpm-lock\.yaml$/,
  /^packages\/components\/custom-elements\.json$/,
  /^scripts\/lint-copy\.mjs$/,
];
const BRITISH_SPELLINGS = [
  'analyse',
  'analysed',
  'analyses',
  'analysing',
  'behaviour',
  'behaviours',
  'cancelled',
  'cancelling',
  'centre',
  'centred',
  'centres',
  'centring',
  'colour',
  'coloured',
  'colours',
  'customise',
  'customised',
  'customising',
  'finalise',
  'finalised',
  'finalising',
  'favourite',
  'favourites',
  'grey',
  'initialise',
  'initialised',
  'initialising',
  'labelled',
  'labelling',
  'licence',
  'modelling',
  'neighbour',
  'neighbouring',
  'neighbours',
  'normalise',
  'normalised',
  'normalising',
  'optimise',
  'optimised',
  'optimising',
  'organisation',
  'organisations',
  'organise',
  'organised',
  'organising',
  'prioritise',
  'prioritised',
  'prioritising',
  'recognise',
  'recognised',
  'recognising',
  'recolour',
  'recoloured',
  'recolouring',
  'serialisable',
  'serialise',
  'serialised',
  'serialising',
  'unlabelled',
  'visualise',
  'visualised',
  'visualising',
];
const FORBIDDEN_COPY = [
  { pattern: /[…—–“”‘’]/u, message: 'typographic punctuation' },
  {
    pattern: new RegExp(`\\b(?:${BRITISH_SPELLINGS.join('|')})\\b`, 'i'),
    message: 'British English spelling',
  },
];

function trackedSourceFiles() {
  return execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
    .split('\0')
    .filter(Boolean)
    .filter((file) => SOURCE_EXTENSION.test(file))
    .filter((file) => !EXCLUDED_PATHS.some((pattern) => pattern.test(file)));
}

function violationsFor(file) {
  const source = readFileSync(file, 'utf8');
  return FORBIDDEN_COPY.filter(({ pattern }) => pattern.test(source)).map(({ message }) => `${file}: ${message}`);
}

const violations = trackedSourceFiles().flatMap(violationsFor);

if (violations.length > 0) {
  console.error(violations.join('\n'));
  process.exitCode = 1;
}
