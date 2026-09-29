import fs from 'fs';
import path from 'path';

import { findForbiddenTerms, scanForForbiddenTerms } from '../forbiddenTerms';

const ROOT = path.resolve(__dirname, '../../..');

/** Every JSON file that can reach a user: translations + content. */
const SCANNED_DIRS = ['src/i18n', 'src/content'];

function listJsonFiles(dir: string): string[] {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs, { withFileTypes: true }).flatMap((e) => {
    const rel = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === '__tests__' ? [] : listJsonFiles(rel);
    return e.name.endsWith('.json') ? [rel] : [];
  });
}

describe('findForbiddenTerms', () => {
  it('matches whole words case-insensitively', () => {
    expect(findForbiddenTerms('This will Treat stress')).toEqual(['treat']);
    expect(findForbiddenTerms('Helps with INSOMNIA.')).toEqual(['insomnia']);
    expect(findForbiddenTerms('a calming breath for PTSD')).toEqual(['ptsd']);
  });

  it('matches multi-word terms across whitespace', () => {
    expect(findForbiddenTerms('no more anxiety\ndisorder')).toContain('anxiety disorder');
    expect(findForbiddenTerms('Get well soon')).toEqual(['get well']);
  });

  it('matches hyphenated compounds', () => {
    expect(findForbiddenTerms('an anti-depression flow')).toEqual(['depression']);
  });

  it('does not match inside other words', () => {
    expect(findForbiddenTerms('A weekend retreat')).toEqual([]);
    expect(findForbiddenTerms('Health and wellbeing')).toEqual([]);
    expect(findForbiddenTerms('Add to flow')).toEqual([]);
    expect(findForbiddenTerms('Patience with the breath')).toEqual([]);
  });

  it('allows wellness vocabulary', () => {
    const ok = 'Calm, focus, sleep, energy, mood, relaxation, balance, stress, concentration.';
    expect(findForbiddenTerms(ok)).toEqual([]);
  });
});

describe('scanForForbiddenTerms', () => {
  it('reports the path of nested hits', () => {
    const hits = scanForForbiddenTerms({ a: { b: ['fine', 'a cure for it'] } });
    expect(hits).toEqual([{ path: '$.a.b[1]', term: 'cure', value: 'a cure for it' }]);
  });

  it('skips the fromTheTexts field only', () => {
    const card = {
      howTo: 'Sit comfortably.',
      fromTheTexts: { text: 'The text said it would cure all ills.', source: 'X' },
      modernResearch: 'It may heal you.',
    };
    expect(scanForForbiddenTerms(card).map((h) => h.path)).toEqual(['$.modernResearch']);
  });
});

describe('shipped text contains no forbidden terms', () => {
  const files = SCANNED_DIRS.flatMap(listJsonFiles);

  it('finds the English translation file', () => {
    expect(files).toContain(path.join('src/i18n', 'en.json'));
  });

  it.each(files)('%s', (file) => {
    const json: unknown = JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8'));
    const hits = scanForForbiddenTerms(json).map((h) => `${h.path}: "${h.term}" in "${h.value}"`);
    expect(hits).toEqual([]);
  });
});
