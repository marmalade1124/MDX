export interface ReadmeData {
  githubContext?: any;
  projectTitle: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  badges: Badge[];
  features: string[];
  installation: string;
  usage: string;
  techStack: TechItem[];
  contributing: string;
  license: string;
  authorName: string;
  authorGithub: string;
  authorEmail: string;
  demoUrl: string;
  repoUrl: string;
  showToc: boolean;
  aiModel?: string;
}

export const AVAILABLE_MODELS = [
  { id: 'meta/llama-3.1-405b-instruct', name: 'Llama 3.1 405B (Default)' },
  { id: 'meta/llama-3.1-70b-instruct', name: 'Llama 3.1 70B (Faster)' },
  { id: 'meta/llama-3.1-8b-instruct', name: 'Llama 3.1 8B (Fastest)' },
  { id: 'mistralai/mistral-large-3-675b-instruct-2512', name: 'Mistral Large 3' },
  { id: 'nvidia/nemotron-4-340b-instruct', name: 'Nemotron-4 340B' }
];

export interface Badge {
  type: string;
  label: string;
  value: string;
  color: string;
}

export interface TechItem {
  name: string;
  icon?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  data: Partial<ReadmeData>;
  activeSections: string[];
}

export const DEFAULT_README_DATA: ReadmeData = {
  githubContext: undefined,
  projectTitle: '',
  description: '',
  logoUrl: '',
  bannerUrl: '',
  badges: [],
  features: [],
  installation: '',
  usage: '',
  techStack: [],
  contributing: '',
  license: '',
  authorName: '',
  authorGithub: '',
  authorEmail: '',
  demoUrl: '',
  repoUrl: '',
  showToc: false,
};
