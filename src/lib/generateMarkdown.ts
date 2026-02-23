import type { ReadmeData } from './types';

export function generateMarkdown(data: ReadmeData): string {
  const sections: string[] = [];

  // Banner
  if (data.bannerUrl) {
    sections.push(`<p align="center">\n  <img src="${data.bannerUrl}" alt="${data.projectTitle} Banner" width="100%" />\n</p>\n`);
  }

  // Logo + Title
  if (data.logoUrl) {
    sections.push(`<p align="center">\n  <img src="${data.logoUrl}" alt="${data.projectTitle} Logo" width="120" />\n</p>\n`);
  }

  if (data.projectTitle) {
    sections.push(`<h1 align="center">${data.projectTitle}</h1>\n`);
  }

  // Description
  if (data.description) {
    sections.push(`<p align="center">\n  <em>${data.description}</em>\n</p>\n`);
  }

  // Badges
  if (data.badges.length > 0) {
    const badgeMarkdown = data.badges
      .map((b) => {
        const url = `https://img.shields.io/badge/${encodeURIComponent(b.label)}-${encodeURIComponent(b.value)}-${b.color}`;
        return `<img src="${url}" alt="${b.label}" />`;
      })
      .join('\n  ');
    sections.push(`<p align="center">\n  ${badgeMarkdown}\n</p>\n`);
  }

  // Divider after header
  if (sections.length > 0) {
    sections.push(`---\n`);
  }

  // Table of Contents
  if (data.showToc) {
    const tocItems: string[] = [];
    if (data.demoUrl) tocItems.push('- [🌐 Demo](#-demo)');
    if (data.features.length > 0) tocItems.push('- [✨ Features](#-features)');
    if (data.techStack.length > 0) tocItems.push('- [🛠️ Tech Stack](#️-tech-stack)');
    if (data.installation) tocItems.push('- [📦 Installation](#-installation)');
    if (data.usage) tocItems.push('- [🚀 Usage](#-usage)');
    if (data.contributing) tocItems.push('- [🤝 Contributing](#-contributing)');
    if (data.license) tocItems.push('- [📄 License](#-license)');
    const hasAuthor = data.authorName || data.authorGithub || data.authorEmail;
    if (hasAuthor) tocItems.push('- [👤 Author](#-author)');

    if (tocItems.length > 0) {
      sections.push(`## 📑 Table of Contents\n\n${tocItems.join('\n')}\n`);
    }
  }

  // Demo link
  if (data.demoUrl) {
    sections.push(`## 🌐 Demo\n\n🔗 **[Live Demo](${data.demoUrl})**\n`);
  }

  // Features
  if (data.features.length > 0) {
    const featuresList = data.features.map((f) => `- ${f}`).join('\n');
    sections.push(`## ✨ Features\n\n${featuresList}\n`);
  }

  // Tech Stack
  if (data.techStack.length > 0) {
    const techList = data.techStack.map((t) => `| ${t.name} |`).join('\n');
    sections.push(`## 🛠️ Tech Stack\n\n| Technology |\n|---|\n${techList}\n`);
  }

  // Installation
  if (data.installation) {
    sections.push(`## 📦 Installation\n\n${data.installation}\n`);
  }

  // Usage
  if (data.usage) {
    sections.push(`## 🚀 Usage\n\n${data.usage}\n`);
  }

  // Contributing
  if (data.contributing) {
    sections.push(`## 🤝 Contributing\n\n${data.contributing}\n`);
  }

  // License
  if (data.license) {
    sections.push(`## 📄 License\n\nThis project is licensed under the **${data.license}** License.\n`);
  }

  // Author section
  const hasAuthor = data.authorName || data.authorGithub || data.authorEmail;
  if (hasAuthor) {
    let authorSection = `## 👤 Author\n\n`;
    if (data.authorName) authorSection += `**${data.authorName}**\n\n`;
    if (data.authorGithub) authorSection += `- GitHub: [@${data.authorGithub}](https://github.com/${data.authorGithub})\n`;
    if (data.authorEmail) authorSection += `- Email: [${data.authorEmail}](mailto:${data.authorEmail})\n`;
    sections.push(authorSection);
  }

  // Footer
  if (data.repoUrl) {
    sections.push(`---\n\n<p align="center">\n  ⭐ Star this repo if you find it helpful!\n</p>\n`);
  }

  return sections.join('\n');
}
