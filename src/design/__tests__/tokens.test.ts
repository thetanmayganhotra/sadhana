import { STATE_IDS } from '@/content/types';

import { contrastRatio } from '../contrast';
import { palettes, spacing, stateAccents } from '../tokens';

const MIN = 4.5;

describe('contrast ratio', () => {
  it('matches known WCAG values', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1);
    expect(contrastRatio('#777777', '#FFFFFF')).toBeCloseTo(4.48, 1);
  });
});

describe.each(['light', 'dark'] as const)('%s palette', (scheme) => {
  const p = palettes[scheme];
  const pairs: [string, string, string][] = [
    ['text', p.text, p.background],
    ['text/surface', p.text, p.surface],
    ['textMuted', p.textMuted, p.background],
    ['textMuted/surface', p.textMuted, p.surface],
    ['onPrimary', p.onPrimary, p.primary],
    ['danger', p.danger, p.background],
  ];
  it.each(pairs)('%s meets 4.5:1', (_name, fg, bg) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(MIN);
  });

  it.each(STATE_IDS)('text on the %s soft tint meets 4.5:1', (id) => {
    expect(contrastRatio(p.text, stateAccents[id][scheme].soft)).toBeGreaterThanOrEqual(MIN);
  });
});

it('spacing follows the 4-pt grid (except hairline xxs)', () => {
  for (const [k, v] of Object.entries(spacing)) {
    if (k !== 'xxs') expect(v % 4).toBe(0);
  }
});
