import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { ReadmeForm } from '@/components/ReadmeForm';
import { ReadmePreview } from '@/components/ReadmePreview';
import { MarkdownOutput } from '@/components/MarkdownOutput';
import { generateMarkdown } from '@/lib/generateMarkdown';
import { DEFAULT_README_DATA } from '@/lib/types';
import type { ReadmeData } from '@/lib/types';
import { toast } from 'sonner';
import './App.css';

const STORAGE_KEY = 'readme-generator-data';
const THEME_KEY = 'readme-generator-theme';

function loadSavedData(): ReadmeData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_README_DATA, ...parsed };
    }
  } catch { /* ignore */ }
  return DEFAULT_README_DATA;
}

function App() {
  const [data, setData] = useState<ReadmeData>(loadSavedData);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return saved !== null ? saved === 'true' : true;
  });
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [isEditingName, setIsEditingName] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [mobilePanel, setMobilePanel] = useState<'editor' | 'preview'>('editor');
  const nameInputRef = useRef<HTMLInputElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const markdown = useMemo(() => generateMarkdown(data), [data]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem(THEME_KEY, String(darkMode));
  }, [darkMode]);

  // Debounced auto-save
  const saveToStorage = useCallback((newData: ReadmeData) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      try {
        // Strip large base64 images to prevent QuotaExceededError
        const dataToSave = { ...newData };
        if (dataToSave.logoUrl?.startsWith('data:image')) dataToSave.logoUrl = '';
        if (dataToSave.bannerUrl?.startsWith('data:image')) dataToSave.bannerUrl = '';
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        setLastSaved(new Date());
      } catch (e) {
        console.error('Save to storage failed:', e);
      }
    }, 500);
  }, []);

  const handleDataChange = useCallback((newData: ReadmeData) => {
    setData(newData);
    saveToStorage(newData);
  }, [saveToStorage]);

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  const handleCopy = useCallback(async () => {
    if (!markdown.trim()) {
      toast.warning('Nothing to copy — fill in the form first');
      return;
    }
    try {
      await navigator.clipboard.writeText(markdown);
      toast.success('Copied to clipboard');
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = markdown;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      toast.success('Copied to clipboard');
    }
  }, [markdown]);

  const handleDownload = useCallback(() => {
    if (!markdown.trim()) {
      toast.warning('Nothing to export — fill in the form first');
      return;
    }
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.projectTitle ? data.projectTitle.replace(/\s+/g, '-').toLowerCase() : 'README'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Exported ${a.download}`);
  }, [markdown, data.projectTitle]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't fire when typing in inputs/textareas
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      const isMod = e.ctrlKey || e.metaKey;
      if (isMod && e.key === 'c') {
        e.preventDefault();
        handleCopy();
      } else if (isMod && e.key === 's') {
        e.preventDefault();
        handleDownload();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleCopy, handleDownload]);

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    toast(`Switched to ${!darkMode ? 'dark' : 'light'} mode`);
  };

  const handleNameSubmit = () => {
    setIsEditingName(false);
  };

  const displayName = data.projectTitle
    ? data.projectTitle.replace(/\s+/g, '-').toLowerCase()
    : 'untitled-project';

  return (
    <div className="h-screen flex flex-col overflow-hidden selection:bg-primary/20 selection:text-primary">
      {/* Header */}
      <header className="flex-none h-12 border-b border-border header-blur px-3 md:px-4 flex items-center justify-between z-50 fixed top-0 w-full">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <div className="flex items-center justify-center w-6 h-6 bg-primary/10 rounded text-primary border border-primary/20 flex-none">
            <span className="material-symbols-outlined text-[16px]">description</span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-medium text-sm text-foreground tracking-tight hidden sm:inline">mdx</span>
            <span className="text-muted-foreground hidden sm:inline">/</span>
            {isEditingName ? (
              <input
                ref={nameInputRef}
                value={data.projectTitle}
                onChange={(e) => handleDataChange({ ...data, projectTitle: e.target.value })}
                onBlur={handleNameSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNameSubmit();
                  if (e.key === 'Escape') setIsEditingName(false);
                }}
                className="text-sm bg-secondary border border-border rounded px-2 py-0.5 font-mono text-foreground focus:outline-none focus:border-ring w-32 sm:w-48"
              />
            ) : (
              <button
                onClick={() => setIsEditingName(true)}
                className="text-muted-foreground text-sm hover:text-foreground transition-colors flex items-center gap-1 group truncate max-w-[120px] sm:max-w-none"
                title="Click to rename"
              >
                <span className="truncate">{displayName}</span>
                <span className="material-symbols-outlined text-[12px] opacity-0 group-hover:opacity-100 transition-opacity flex-none">edit</span>
              </button>
            )}
          </div>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-primary/10 border border-primary/20 text-primary hidden sm:inline">MDX</span>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          <button
            onClick={handleToggleDarkMode}
            className="h-7 w-7 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <div className="h-4 w-px bg-border mx-0.5 hidden sm:block" />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            title="Copy markdown (Ctrl+C)"
          >
            <span className="material-symbols-outlined text-[16px]">content_copy</span>
            <span className="hidden sm:inline">Copy</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1 bg-foreground text-background text-xs font-medium rounded hover:opacity-90 transition-colors shadow-sm"
            title="Export as .md (Ctrl+S)"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </header>

      {/* Mobile panel switcher */}
      <div className="flex-none h-10 border-b border-border bg-background flex items-center px-3 gap-1 mt-12 md:hidden">
        <button
          onClick={() => setMobilePanel('editor')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded text-xs font-medium transition-colors ${
            mobilePanel === 'editor'
              ? 'bg-secondary text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">edit_note</span>
          Editor
        </button>
        <button
          onClick={() => setMobilePanel('preview')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded text-xs font-medium transition-colors ${
            mobilePanel === 'preview'
              ? 'bg-secondary text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">visibility</span>
          Preview
        </button>
      </div>

      {/* Main content */}
      <main className="flex-1 flex overflow-hidden pt-12 md:pt-12">
        {/* Sidebar — hidden on mobile when preview is active */}
        <aside className={`${
          mobilePanel === 'editor' ? 'flex' : 'hidden'
        } md:flex w-full md:w-[420px] flex-none flex-col border-r border-border bg-background overflow-hidden`}>
          <div className="flex-1 overflow-y-scroll">
            <ReadmeForm data={data} onChange={handleDataChange} />
          </div>
          {lastSaved && (
            <div className="flex-none px-4 py-2 border-t border-border text-[10px] font-mono text-muted-foreground flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[12px]">cloud_done</span>
              Saved {lastSaved.toLocaleTimeString()}
            </div>
          )}
        </aside>

        {/* Preview panel — hidden on mobile when editor is active */}
        <section className={`${
          mobilePanel === 'preview' ? 'flex' : 'hidden'
        } md:flex flex-1 flex-col bg-[#0d1117] relative border-l border-border`}>
          {/* Preview header bar */}
          <div className="flex-none h-12 flex items-center justify-between px-4 md:px-6 border-b border-[#30363d] bg-[#0d1117]">
            <div className="flex items-center bg-[#21262d] rounded-md p-0.5 border border-[#30363d]">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === 'preview'
                    ? 'bg-[#30363d] text-white shadow-sm'
                    : 'text-[#8b949e] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">visibility</span>
                Preview
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === 'code'
                    ? 'bg-[#30363d] text-white shadow-sm'
                    : 'text-[#8b949e] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">code</span>
                Code
              </button>
            </div>
            <button
              onClick={handleCopy}
              className="text-[#8b949e] hover:text-white transition-colors p-1.5 rounded hover:bg-[#30363d]"
              title="Copy to Clipboard"
            >
              <span className="material-symbols-outlined text-[18px]">content_copy</span>
            </button>
          </div>

          {/* Preview/Code content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 scroll-smooth">
            {activeTab === 'preview' ? (
              <div className="max-w-[896px] mx-auto">
                <div className="border border-[#30363d] rounded-md bg-[#0d1117] overflow-hidden">
                  {/* File header */}
                  <div className="bg-[#161b22] px-4 py-3 border-b border-[#30363d] flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#8b949e] text-[18px]">list</span>
                      <span className="text-sm font-bold text-[#c9d1d9]">README.md</span>
                    </div>
                  </div>
                  {/* Rendered preview */}
                  <div className="p-4 md:p-8 lg:px-12 gh-preview">
                    <ReadmePreview markdown={markdown} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-[896px] mx-auto">
                <MarkdownOutput markdown={markdown} />
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
