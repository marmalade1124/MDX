export interface ReadmeData {
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
}

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
