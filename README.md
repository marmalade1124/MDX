<p align="center">
  <img src="public/favicon.svg" alt="MDX Logo" width="80" />
</p>

<h1 align="center">MDX — README Generator</h1>

<p align="center">
  <em>A sleek, open-source README generator with live preview, smart templates, and one-click export.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
  <img src="https://img.shields.io/badge/Version-1.0.0-blue" alt="Version" />
  <img src="https://img.shields.io/badge/Build-passing-brightgreen" alt="Build" />
  <img src="https://img.shields.io/badge/TypeScript-strict-blue" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen" alt="PRs Welcome" />
</p>

---

## 📑 Table of Contents

- [🌐 Overview](#-overview)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📦 Installation](#-installation)
- [🚀 Usage](#-usage)
- [📁 Project Structure](#-project-structure)
- [⚙️ Configuration](#️-configuration)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👤 Author](#-author)

---

## 🌐 Overview

**MDX** is a modern, browser-based README generator that helps developers create professional GitHub README files in seconds — no markdown knowledge required.

### The Problem

Writing a good README is tedious. Developers spend time wrestling with markdown syntax, badge URLs, and section structure instead of shipping code.

### The Solution

MDX provides a visual form-based editor with live GitHub-styled preview. Pick a template, fill in your project details, and export a polished `README.md` in one click.

### Target Users

- Developers who want a polished README without writing raw markdown
- Open-source maintainers who need consistent documentation
- Students and teams who want professional project presentations

---

## ✨ Features

- 🎨 **Live GitHub-Styled Preview** — See your README rendered exactly as GitHub displays it
- 📋 **Smart Templates** — 4 pre-built templates (Minimal, Standard, Detailed, Open Source)
- 🪄 **AI Description Generation** — Use NVIDIA NIM (Llama 3.1 405B) to automatically generate descriptions based on your title and tech stack
- 🔐 **Secure API Key Management** — Bring your own NVIDIA API key, securely stored locally in your browser
- 🛠️ **Tech Stack Quick-Pick** — 50+ technologies across 6 categories, one-click toggle
- 🏷️ **Badge Presets** — 8 common badge types with instant add
- 📑 **Auto Table of Contents** — Toggle a clickable TOC that updates dynamically
- 💾 **Auto-Save** — LocalStorage persistence with debounced saving
- 🌗 **Dark / Light Mode** — Full theme toggle with preference persistence
- ⌨️ **Keyboard Shortcuts** — `Ctrl+C` to copy, `Ctrl+S` to export
- 📱 **Responsive Layout** — Tab-based Editor/Preview switcher on mobile
- 📤 **One-Click Export** — Copy to clipboard or download as `.md` file
- ✏️ **Inline Project Rename** — Click the header breadcrumb to rename your project
- 🔄 **Reset & Clear** — One-click form reset with toast confirmation

---

## 🛠️ Tech Stack

| Technology     | Purpose                          |
| -------------- | -------------------------------- |
| React 19       | UI framework                     |
| TypeScript     | Type safety                      |
| Vite 7         | Build tool & dev server          |
| Tailwind CSS 4 | Utility-first styling            |
| react-markdown | Markdown rendering               |
| remark-gfm     | GitHub Flavored Markdown support |
| rehype-raw     | HTML-in-markdown rendering       |
| Sonner         | Toast notifications              |
| shadcn/ui      | Base component primitives        |

---

## 📦 Installation

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9 (or pnpm / yarn)

### Setup

```bash
# Clone the repository
git clone https://github.com/marmalade1124/MDX.git

# Navigate to the project directory
cd MDX

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173/`.

### Production Build

```bash
# Build for production
npm run build

# Preview the production build locally
npm run preview
```

The production output is in the `dist/` directory — ready to deploy to any static hosting provider.

---

## 🚀 Usage

### Quick Start

1. **Pick a template** — Choose from Minimal, Standard, Detailed, or Open Source
2. **Fill in details** — Project title, description, features, tech stack, etc.
3. **Preview live** — See the GitHub-styled rendering in real time
4. **Export** — Copy to clipboard (`Ctrl+C`) or download as `.md` (`Ctrl+S`)

### Keyboard Shortcuts

| Shortcut | Action                     |
| -------- | -------------------------- |
| `Ctrl+C` | Copy markdown to clipboard |
| `Ctrl+S` | Download README.md file    |

### Screenshots

<p align="center">
  <em>Dark mode editor with live preview</em>
</p>

> Screenshots are best viewed on the live deployment.

---

## 📁 Project Structure

```
MDX/
├── public/
│   ├── favicon.svg          # App favicon (SVG)
│   └── manifest.json        # PWA manifest
├── src/
│   ├── components/
│   │   ├── ImageUploader.tsx # Logo/banner upload component
│   │   ├── MarkdownOutput.tsx# Raw markdown code view
│   │   ├── ReadmeForm.tsx    # Main editor form
│   │   ├── ReadmePreview.tsx # GitHub-styled markdown preview
│   │   └── TemplateSelector.tsx # Template pill buttons
│   ├── lib/
│   │   ├── badgePresets.ts   # Badge preset definitions
│   │   ├── generateMarkdown.ts # Markdown generation engine
│   │   ├── techPresets.ts    # Tech stack categories & presets
│   │   ├── templates.ts     # Template definitions
│   │   ├── types.ts         # TypeScript interfaces & defaults
│   │   └── utils.ts         # Utility functions
│   ├── App.tsx              # Root application component
│   ├── App.css              # Custom styles (scrollbar, preview)
│   ├── index.css            # Tailwind base + theme variables
│   └── main.tsx             # Entry point + Toaster provider
├── index.html               # HTML shell with meta tags
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── package.json             # Dependencies & scripts
```

---

## ⚙️ Configuration

### Theme Variables

Theme colors are defined in `src/index.css` using CSS custom properties:

```css
.dark {
  --background: #000000;
  --foreground: #ededed;
  --primary: #10b981; /* Emerald green */
  --secondary: #111111;
  --border: #222222;
}
```

Modify these to customize the editor's color scheme.

### Templates

Templates are defined in `src/lib/templates.ts`. To add a custom template:

```typescript
{
  id: 'my-template',
  name: 'My Template',
  description: 'Description here',
  icon: '🎯',
  activeSections: ['title', 'description', 'features'],
  data: {
    projectTitle: 'My Project',
    description: 'Template description',
    // ... other fields
  },
}
```

### Tech Stack Presets

Add new technologies in `src/lib/techPresets.ts`:

```typescript
{
  id: 'my-category',
  label: 'My Category',
  icon: '🔧',
  items: [
    { name: 'My Tech' },
  ],
}
```

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

### Steps

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Guidelines

- Follow the existing code style (TypeScript strict mode, Tailwind classes)
- Write meaningful commit messages
- Test your changes with `npm run build` before submitting
- Keep PRs focused — one feature per PR

### Branching

| Branch      | Purpose               |
| ----------- | --------------------- |
| `main`      | Production-ready code |
| `feature/*` | New features          |
| `fix/*`     | Bug fixes             |

---

## 📄 License

This project is licensed under the **MIT** License.

```
MIT License

Copyright (c) 2025 Raziel Renz C. Salamat

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 👤 Author

**Raziel Renz C. Salamat**

🎓 4th Year Computer Engineering — UM Tagum College, Philippines

- GitHub: [@marmalade1124](https://github.com/marmalade1124)
- Email: [razielrenz@gmail.com](mailto:razielrenz@gmail.com)

---

<p align="center">
  ⭐ Star this repo if you find it helpful!
</p>
