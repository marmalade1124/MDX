import type { Badge } from './types';

export interface BadgePreset {
  id: string;
  label: string;
  badge: Badge;
}

export const BADGE_PRESETS: BadgePreset[] = [
  {
    id: 'license-mit',
    label: 'License',
    badge: { type: 'license', label: 'License', value: 'MIT', color: 'green' },
  },
  {
    id: 'version',
    label: 'Version',
    badge: { type: 'version', label: 'Version', value: '1.0.0', color: 'blue' },
  },
  {
    id: 'build',
    label: 'Build',
    badge: { type: 'build', label: 'Build', value: 'passing', color: 'brightgreen' },
  },
  {
    id: 'prs',
    label: 'PRs Welcome',
    badge: { type: 'prs', label: 'PRs', value: 'Welcome', color: 'brightgreen' },
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    badge: { type: 'lang', label: 'TypeScript', value: 'strict', color: 'blue' },
  },
  {
    id: 'node',
    label: 'Node.js',
    badge: { type: 'runtime', label: 'Node', value: '≥18', color: 'green' },
  },
  {
    id: 'coverage',
    label: 'Coverage',
    badge: { type: 'coverage', label: 'Coverage', value: '95%', color: 'green' },
  },
  {
    id: 'stars',
    label: '⭐ Stars',
    badge: { type: 'stars', label: 'Stars', value: '⭐', color: 'yellow' },
  },
];
