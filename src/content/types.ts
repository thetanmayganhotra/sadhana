/** User states offered in intake (Section 7.2). Labels live in i18n under `states.<id>`. */
export const STATE_IDS = [
  'racing_thoughts',
  'stress_before_moments',
  'cant_switch_off',
  'low_energy_mornings',
  'feeling_flat',
  'hard_to_start',
  'scattered_focus',
  'restless_mind',
  'waking_up_tired',
  'want_deeper_practice',
] as const;

export type StateId = (typeof STATE_IDS)[number];
