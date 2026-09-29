/**
 * Terms that must never appear in UI text, notifications, onboarding, store listings or
 * content JSON (BUILD_PROMPT Section 3 — keeps the app in the FDA "general wellness" category).
 *
 * The only exception is the `fromTheTexts` field of a Learn card, which is always rendered with
 * attribution and past-tense framing. Scanners skip that field via EXEMPT_KEYS.
 *
 * Matching is case-insensitive on whole words, so "treat" matches "Treat" and "treats" but not
 * "retreat". Add inflections explicitly rather than using stems.
 */
export const FORBIDDEN_TERMS: readonly string[] = [
  // Disorders / diagnoses
  'anxiety disorder',
  'anxiety disorders',
  'generalized anxiety',
  'depression',
  'depressive',
  'depressed',
  'adhd',
  'insomnia',
  'ptsd',
  'bipolar',
  'panic disorder',
  'ocd',
  'disorder',
  'disorders',
  // Treatment language
  'treat',
  'treats',
  'treated',
  'treating',
  'treatment',
  'treatments',
  'cure',
  'cures',
  'cured',
  'curing',
  'heal',
  'heals',
  'healed',
  'healing',
  'therapy',
  'therapies',
  'therapeutic',
  'diagnose',
  'diagnosed',
  'diagnosis',
  'prescription',
  'prescribe',
  'prescribed',
  'symptom',
  'symptoms',
  'patient',
  'patients',
  // Promises of recovery
  'get well',
  'recover',
  'recovery',
  'fix your anxiety',
];

/** Keys whose values are exempt from scanning (traditional-text history only). */
export const EXEMPT_KEYS: ReadonlySet<string> = new Set(['fromTheTexts']);

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const patterns = FORBIDDEN_TERMS.map((term) => ({
  term,
  // Word boundaries that also treat apostrophes/hyphens as non-word so "anti-depression" matches.
  re: new RegExp(
    `(^|[^\\p{L}\\p{N}])${escapeRegExp(term).replace(/ /g, '\\s+')}(?=$|[^\\p{L}\\p{N}])`,
    'iu',
  ),
}));

/** Returns every forbidden term found in `text` (deduplicated, in list order). */
export function findForbiddenTerms(text: string): string[] {
  return patterns.filter((p) => p.re.test(text)).map((p) => p.term);
}

export type ForbiddenHit = { path: string; term: string; value: string };

/**
 * Recursively scans any JSON-like value. `path` is a dotted location for error messages.
 * Values under EXEMPT_KEYS are skipped.
 */
export function scanForForbiddenTerms(value: unknown, path = '$'): ForbiddenHit[] {
  if (typeof value === 'string') {
    return findForbiddenTerms(value).map((term) => ({ path, term, value }));
  }
  if (Array.isArray(value)) {
    return value.flatMap((v, i) => scanForForbiddenTerms(v, `${path}[${i}]`));
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) =>
      EXEMPT_KEYS.has(k) ? [] : scanForForbiddenTerms(v, `${path}.${k}`),
    );
  }
  return [];
}
