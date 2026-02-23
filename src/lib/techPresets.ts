export interface TechPreset {
  name: string;
  icon?: string;
}

export interface TechCategory {
  id: string;
  label: string;
  icon: string;
  items: TechPreset[];
}

export const TECH_CATEGORIES: TechCategory[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    icon: '🖥️',
    items: [
      { name: 'React' },
      { name: 'Vue.js' },
      { name: 'Angular' },
      { name: 'Svelte' },
      { name: 'Next.js' },
      { name: 'Nuxt' },
      { name: 'Astro' },
      { name: 'HTML/CSS' },
      { name: 'Tailwind CSS' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    icon: '⚙️',
    items: [
      { name: 'Node.js' },
      { name: 'Express' },
      { name: 'Fastify' },
      { name: 'Django' },
      { name: 'Flask' },
      { name: 'Spring Boot' },
      { name: 'Laravel' },
      { name: 'Go' },
      { name: 'Rust' },
    ],
  },
  {
    id: 'database',
    label: 'Database',
    icon: '🗄️',
    items: [
      { name: 'PostgreSQL' },
      { name: 'MySQL' },
      { name: 'MongoDB' },
      { name: 'Redis' },
      { name: 'SQLite' },
      { name: 'Supabase' },
      { name: 'Firebase' },
      { name: 'Prisma' },
    ],
  },
  {
    id: 'devops',
    label: 'DevOps',
    icon: '🚀',
    items: [
      { name: 'Docker' },
      { name: 'Kubernetes' },
      { name: 'GitHub Actions' },
      { name: 'Vercel' },
      { name: 'AWS' },
      { name: 'Nginx' },
      { name: 'Terraform' },
    ],
  },
  {
    id: 'languages',
    label: 'Languages',
    icon: '📝',
    items: [
      { name: 'TypeScript' },
      { name: 'JavaScript' },
      { name: 'Python' },
      { name: 'Java' },
      { name: 'Go' },
      { name: 'Rust' },
      { name: 'C++' },
      { name: 'C#' },
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    icon: '🔧',
    items: [
      { name: 'Git' },
      { name: 'ESLint' },
      { name: 'Prettier' },
      { name: 'Jest' },
      { name: 'Vitest' },
      { name: 'Webpack' },
      { name: 'Vite' },
      { name: 'pnpm' },
    ],
  },
];
