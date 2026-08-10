import { readdirSync, readFileSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const SOURCE_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TEST_FILE = /\.(?:spec|test)\.ts$/;
const NUMERIC_LINE_HEIGHT = /line-height:\s*[0-9]/;

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      return sourceFiles(path);
    }
    const ext = extname(path);
    return (ext === '.ts' || ext === '.css') && !TEST_FILE.test(path) ? [path] : [];
  });
}

describe('line-height tokens', () => {
  it('leaves no raw line-height in component styles', () => {
    const offenders = sourceFiles(SOURCE_ROOT)
      .filter((path) => NUMERIC_LINE_HEIGHT.test(readFileSync(path, 'utf8')))
      .map((path) => path.slice(SOURCE_ROOT.length + 1));

    expect(offenders).toEqual([]);
  });
});
