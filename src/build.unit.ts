import { expect, test, beforeAll } from 'vitest'
import fs from 'fs';

let rootFolderContents: string[];

beforeAll(() => {
  rootFolderContents = fs.readdirSync('./', 'utf-8');
});

/**
 * Ensure no JavaScript bundler lock files exist in root dir
 * This enforces using yarn as the package manager
 */
test('Ensure no npm lock file exists', () => {
  const fileThatShouldNotExist = 'package-lock.json';
  expect(rootFolderContents.indexOf(fileThatShouldNotExist)).toBe(-1);
});

test('Ensure no pnpm lock file exists', () => {
  const fileThatShouldNotExist = 'pnpm-lock.yaml';
  expect(rootFolderContents.indexOf(fileThatShouldNotExist)).toBe(-1);
});

test('Ensure no bun lock file exists', () => {
  const fileThatShouldNotExist = 'bun.lockb';
  expect(rootFolderContents.indexOf(fileThatShouldNotExist)).toBe(-1);
});