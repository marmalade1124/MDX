import { useState } from 'react';
import { ImageUploader } from './ImageUploader';
import { TemplateSelector } from './TemplateSelector';
import type { ReadmeData, Badge as BadgeType } from '@/lib/types';
import { DEFAULT_README_DATA } from '@/lib/types';
import { TECH_CATEGORIES } from '@/lib/techPresets';
import { BADGE_PRESETS } from '@/lib/badgePresets';
import { generateDescription } from '@/lib/ai';
import { toast } from 'sonner';

interface ReadmeFormProps {
  data: ReadmeData;
  onChange: (data: ReadmeData) => void;
}

function Section({
  title,
  children,
  defaultOpen = false,
  trailing,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  trailing?: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="space-y-4">
      <div
        className="flex items-center justify-between group cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <h2 className="text-sm font-medium text-foreground">{title}</h2>
        <div className="flex items-center gap-2">
          {trailing && <div onClick={(e) => e.stopPropagation()}>{trailing}</div>}
          <span className="material-symbols-outlined text-muted-foreground text-[16px] group-hover:text-foreground transition-colors">
            {open ? 'expand_less' : 'expand_more'}
          </span>
        </div>
      </div>
      {open && <div className="space-y-3 pl-1">{children}</div>}
    </section>
  );
}

const LICENSE_OPTIONS = [
  'MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-2-Clause', 'BSD-3-Clause',
  'ISC', 'MPL-2.0', 'LGPL-3.0', 'Unlicense', 'CC0-1.0',
];

const BADGE_COLORS: { name: string; hex: string }[] = [
  { name: 'green', hex: '#4ade80' },
  { name: 'blue', hex: '#3b82f6' },
  { name: 'red', hex: '#ef4444' },
  { name: 'orange', hex: '#f97316' },
  { name: 'yellow', hex: '#eab308' },
  { name: 'brightgreen', hex: '#22c55e' },
  { name: 'purple', hex: '#a855f7' },
  { name: 'pink', hex: '#ec4899' },
  { name: 'grey', hex: '#9ca3af' },
];

export function ReadmeForm({ data, onChange }: ReadmeFormProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [activeTechCategory, setActiveTechCategory] = useState(TECH_CATEGORIES[0].id);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');

  // Load API key on mount if available
  useState(() => {
    const savedKey = localStorage.getItem('nvidia_api_key');
    if (savedKey) setApiKeyInput(savedKey);
  });

  const update = <K extends keyof ReadmeData>(key: K, value: ReadmeData[K]) => {
    onChange({ ...data, [key]: value });
  };

  const handleTemplateSelect = (templateData: Partial<ReadmeData>) => {
    onChange({ ...DEFAULT_README_DATA, ...templateData });
    toast.success('Template applied');
  };

  // Badge helpers
  const addBadge = () => update('badges', [...data.badges, { type: 'custom', label: '', value: '', color: 'blue' }]);
  const addPresetBadge = (preset: typeof BADGE_PRESETS[0]) => {
    const alreadyExists = data.badges.some(b => b.type === preset.badge.type);
    if (alreadyExists) {
      toast.error(`${preset.label} badge already added`);
      return;
    }
    update('badges', [...data.badges, { ...preset.badge }]);
    toast.success(`Added ${preset.label} badge`);
  };
  const updateBadge = (i: number, field: keyof BadgeType, value: string) => {
    const b = [...data.badges]; b[i] = { ...b[i], [field]: value }; update('badges', b);
  };
  const removeBadge = (i: number) => update('badges', data.badges.filter((_, idx) => idx !== i));

  // Feature helpers
  const addFeature = () => update('features', [...data.features, '']);
  const updateFeature = (i: number, v: string) => {
    const f = [...data.features]; f[i] = v; update('features', f);
  };
  const removeFeature = (i: number) => update('features', data.features.filter((_, idx) => idx !== i));

  // Tech helpers
  const addTech = () => update('techStack', [...data.techStack, { name: '' }]);
  const toggleTech = (name: string) => {
    const exists = data.techStack.some(t => t.name === name);
    if (exists) {
      update('techStack', data.techStack.filter(t => t.name !== name));
    } else {
      update('techStack', [...data.techStack, { name }]);
    }
  };
  const removeTech = (i: number) => update('techStack', data.techStack.filter((_, idx) => idx !== i));

  const handleGenerateDesc = async () => {
    let apiKey = localStorage.getItem('nvidia_api_key');
    if (!apiKey) {
      toast.error('Please configure your NVIDIA API Key in Settings first.');
      setShowSettings(true);
      return;
    }

    setIsGeneratingDesc(true);
    const toastId = toast.loading('Generating description with Llama 3.1...');
    try {
      const techNames = data.techStack.map(t => t.name);
      const desc = await generateDescription(data.projectTitle, techNames, apiKey);
      if (desc) {
        update('description', desc);
        toast.success('Description generated!', { id: toastId });
      } else {
        throw new Error('Empty response');
      }
    } catch (error) {
      toast.error('Failed to generate description. Check your API key.', { id: toastId });
      localStorage.removeItem('nvidia_api_key');
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  const handleReset = () => {
    onChange(DEFAULT_README_DATA);
    setSelectedTemplate(null);
    toast('Form cleared');
  };

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      localStorage.setItem('nvidia_api_key', apiKeyInput.trim());
      toast.success('API Key saved successfully');
    } else {
      localStorage.removeItem('nvidia_api_key');
      toast.success('API Key removed');
    }
    setShowSettings(false);
  };

  const isTechSelected = (name: string) => data.techStack.some(t => t.name === name);
  const activeCategory = TECH_CATEGORIES.find(c => c.id === activeTechCategory) || TECH_CATEGORIES[0];

  const inputClass = "w-full bg-secondary border border-border rounded text-xs text-foreground px-3 py-2 font-mono focus:outline-none focus:border-ring transition-colors placeholder:text-muted-foreground/50";
  const compactInputClass = "bg-secondary text-xs text-foreground px-3 py-1.5 font-mono focus:outline-none focus:bg-card placeholder:text-muted-foreground/50";
  const addBtnClass = "w-full py-1.5 border border-dashed border-border rounded text-[11px] font-mono text-muted-foreground hover:text-foreground hover:border-ring hover:bg-secondary transition-all flex items-center justify-center gap-1.5";

  return (
    <>
      {/* Templates bar (pinned top) */}
      <div className="flex-none border-b border-border px-4 py-3 bg-background z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Templates</span>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`text-muted-foreground hover:text-foreground transition-colors ${showSettings ? 'text-primary' : ''}`}
              title="Settings (API Key)"
            >
              <span className="material-symbols-outlined text-[14px]">settings</span>
            </button>
            <button
              onClick={handleReset}
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Reset form"
            >
              <span className="material-symbols-outlined text-[14px]">refresh</span>
            </button>
          </div>
        </div>
        
        {showSettings ? (
          <div className="mb-4 p-3 bg-secondary/50 rounded border border-border">
            <label className="block text-[11px] font-mono text-muted-foreground mb-1.5 flex justify-between">
              <span>NVIDIA API KEY (FOR AI GENERATION)</span>
              <a href="https://build.nvidia.com" target="_blank" rel="noreferrer" className="text-primary hover:underline">Get Key ↗</a>
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                className={inputClass}
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="nvapi-..."
              />
              <button 
                onClick={handleSaveApiKey}
                className="px-3 bg-primary text-primary-foreground font-mono text-xs rounded hover:bg-primary/90 transition-colors"
              >
                Save
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
              Your key is stored locally in your browser and never sent to our servers. Leaving this blank removes the saved key.
            </p>
          </div>
        ) : (
          <TemplateSelector
            onSelect={handleTemplateSelect}
            selectedId={selectedTemplate}
            onSelectId={setSelectedTemplate}
          />
        )}
      </div>

      {/* Scrollable form sections */}
      <div className="p-4 space-y-6">
        {/* Project Info */}
        <Section title="Project Information" defaultOpen={true}
          trailing={
            <label className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={data.showToc}
                onChange={(e) => update('showToc', e.target.checked)}
                className="accent-primary w-3 h-3"
              />
              TOC
            </label>
          }
        >
          <div className="input-group">
            <label className="block text-[11px] font-mono text-muted-foreground mb-1.5">PROJECT TITLE</label>
            <input
              className={inputClass}
              type="text"
              value={data.projectTitle}
              onChange={(e) => update('projectTitle', e.target.value)}
              placeholder="My Awesome Project"
            />
          </div>
          <div className="input-group">
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[11px] font-mono text-muted-foreground">DESCRIPTION</label>
              <button
                type="button"
                onClick={handleGenerateDesc}
                disabled={isGeneratingDesc}
                className="text-[10px] font-mono text-primary hover:text-primary/80 transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[12px]">
                  {isGeneratingDesc ? 'hourglass_empty' : 'auto_awesome'}
                </span>
                {isGeneratingDesc ? 'GENERATING...' : 'AI GENERATE'}
              </button>
            </div>
            <textarea
              className={`${inputClass} min-h-[80px] resize-none leading-relaxed`}
              value={data.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="A brief description of what your project does..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="input-group">
              <label className="block text-[11px] font-mono text-muted-foreground mb-1.5">DEMO URL</label>
              <input
                className={inputClass}
                type="text"
                value={data.demoUrl}
                onChange={(e) => update('demoUrl', e.target.value)}
                placeholder="https://"
              />
            </div>
            <div className="input-group">
              <label className="block text-[11px] font-mono text-muted-foreground mb-1.5">REPO URL</label>
              <input
                className={inputClass}
                type="text"
                value={data.repoUrl}
                onChange={(e) => update('repoUrl', e.target.value)}
                placeholder="github.com/"
              />
            </div>
          </div>
        </Section>

        <div className="h-px bg-border w-full" />

        {/* Branding / Images */}
        <Section title="Branding">
          <div className="space-y-4">
            <ImageUploader
              label="PROJECT LOGO"
              value={data.logoUrl}
              onChange={(v) => update('logoUrl', v)}
              hint="Square image, 120×120px recommended"
            />
            <ImageUploader
              label="BANNER IMAGE"
              value={data.bannerUrl}
              onChange={(v) => update('bannerUrl', v)}
              hint="Wide image, 1280×640px recommended"
            />
          </div>
        </Section>

        <div className="h-px bg-border w-full" />

        {/* Badges */}
        <Section title="Badges" defaultOpen={true}>
          <div className="space-y-3">
            {/* Quick-add presets */}
            <div>
              <label className="block text-[10px] font-mono text-muted-foreground mb-2">QUICK ADD</label>
              <div className="flex flex-wrap gap-1.5">
                {BADGE_PRESETS.map((preset) => {
                  const isAdded = data.badges.some(b => b.type === preset.badge.type);
                  return (
                    <button
                      key={preset.id}
                      onClick={() => addPresetBadge(preset)}
                      disabled={isAdded}
                      className={`px-2 py-1 rounded text-[10px] font-mono border transition-all ${
                        isAdded
                          ? 'border-primary/20 bg-primary/5 text-primary/50 cursor-default'
                          : 'border-border bg-secondary text-muted-foreground hover:text-foreground hover:border-ring'
                      }`}
                    >
                      {isAdded ? `✓ ${preset.label}` : `+ ${preset.label}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Badge list */}
            <div className="space-y-2">
              {data.badges.map((badge, i) => (
                <div key={i} className="group flex items-center gap-2">
                  <div className="flex-1 grid grid-cols-2 gap-px bg-border rounded overflow-hidden border border-border">
                    <input
                      className={compactInputClass}
                      placeholder="Label"
                      value={badge.label}
                      onChange={(e) => updateBadge(i, 'label', e.target.value)}
                    />
                    <input
                      className={compactInputClass}
                      placeholder="Value"
                      value={badge.value}
                      onChange={(e) => updateBadge(i, 'value', e.target.value)}
                    />
                  </div>
                  <div
                    className="w-6 h-6 rounded flex-none border border-transparent hover:border-foreground/50 cursor-pointer"
                    style={{ backgroundColor: BADGE_COLORS.find(c => c.name === badge.color)?.hex || '#3b82f6' }}
                    onClick={() => {
                      const currentIdx = BADGE_COLORS.findIndex(c => c.name === badge.color);
                      const nextIdx = (currentIdx + 1) % BADGE_COLORS.length;
                      updateBadge(i, 'color', BADGE_COLORS[nextIdx].name);
                    }}
                    title="Click to cycle color"
                  />
                  <button
                    className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    onClick={() => removeBadge(i)}
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </div>
              ))}
              <button onClick={addBadge} className={addBtnClass}>
                <span className="material-symbols-outlined text-[14px]">add</span>
                Add Custom Badge
              </button>
            </div>
          </div>
        </Section>

        <div className="h-px bg-border w-full" />

        {/* Features */}
        <Section title="Features">
          <div className="space-y-2">
            {data.features.map((feature, i) => (
              <div key={i} className="group flex items-center gap-2">
                <input
                  className={`flex-1 ${inputClass} !py-1.5`}
                  value={feature}
                  onChange={(e) => updateFeature(i, e.target.value)}
                  placeholder="Describe a feature..."
                />
                <button
                  className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  onClick={() => removeFeature(i)}
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </div>
            ))}
            <button onClick={addFeature} className={addBtnClass}>
              <span className="material-symbols-outlined text-[14px]">add</span>
              Add Feature
            </button>
          </div>
        </Section>

        <div className="h-px bg-border w-full" />

        {/* Tech Stack */}
        <Section title="Tech Stack">
          <div className="space-y-3">
            {/* Category tabs */}
            <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
              {TECH_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTechCategory(cat.id)}
                  className={`flex-none px-2.5 py-1 rounded text-[10px] font-mono whitespace-nowrap transition-colors ${
                    activeTechCategory === cat.id
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'bg-secondary text-muted-foreground hover:text-foreground border border-border hover:border-ring'
                  }`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>

            {/* Tech chips for active category */}
            <div className="flex flex-wrap gap-1.5">
              {activeCategory.items.map((tech) => {
                const selected = isTechSelected(tech.name);
                return (
                  <button
                    key={tech.name}
                    onClick={() => toggleTech(tech.name)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono border transition-all ${
                      selected
                        ? 'border-primary/30 bg-primary/10 text-primary'
                        : 'border-border bg-secondary text-muted-foreground hover:text-foreground hover:border-ring'
                    }`}
                  >
                    {selected ? `✓ ${tech.name}` : tech.name}
                  </button>
                );
              })}
            </div>

            {/* Selected technologies */}
            {data.techStack.length > 0 && (
              <div>
                <label className="block text-[10px] font-mono text-muted-foreground mb-2">
                  SELECTED ({data.techStack.length})
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {data.techStack.map((tech, i) => (
                    <div key={i} className="group flex items-center gap-1 bg-card border border-border rounded px-2 py-1">
                      <span className="text-[11px] font-mono text-foreground">{tech.name}</span>
                      <button
                        className="text-muted-foreground hover:text-red-500 transition-colors"
                        onClick={() => removeTech(i)}
                      >
                        <span className="material-symbols-outlined text-[12px]">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Manual add */}
            <button onClick={addTech} className={addBtnClass}>
              <span className="material-symbols-outlined text-[14px]">add</span>
              Add Custom Technology
            </button>
          </div>
        </Section>

        <div className="h-px bg-border w-full" />

        {/* Installation */}
        <Section title="Installation">
          <div className="input-group">
            <textarea
              className={`${inputClass} min-h-[120px] resize-none leading-relaxed`}
              value={data.installation}
              onChange={(e) => update('installation', e.target.value)}
              placeholder={"```bash\nnpm install my-project\n```"}
            />
          </div>
        </Section>

        <div className="h-px bg-border w-full" />

        {/* Usage */}
        <Section title="Usage">
          <div className="input-group">
            <textarea
              className={`${inputClass} min-h-[120px] resize-none leading-relaxed`}
              value={data.usage}
              onChange={(e) => update('usage', e.target.value)}
              placeholder={"```javascript\nimport { MyProject } from 'my-project';\n```"}
            />
          </div>
        </Section>

        <div className="h-px bg-border w-full" />

        {/* Contributing */}
        <Section title="Contributing">
          <div className="input-group">
            <textarea
              className={`${inputClass} min-h-[80px] resize-none leading-relaxed`}
              value={data.contributing}
              onChange={(e) => update('contributing', e.target.value)}
              placeholder="Contributions are welcome! Please feel free to submit a Pull Request."
            />
          </div>
        </Section>

        <div className="h-px bg-border w-full" />

        {/* License & Author */}
        <Section title="License & Author">
          <div className="input-group">
            <label className="block text-[11px] font-mono text-muted-foreground mb-1.5">LICENSE</label>
            <select
              value={data.license}
              onChange={(e) => update('license', e.target.value)}
              className={inputClass}
            >
              <option value="">Select a license...</option>
              {LICENSE_OPTIONS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <div className="h-px bg-border w-full my-1" />
          <div className="input-group">
            <label className="block text-[11px] font-mono text-muted-foreground mb-1.5">AUTHOR NAME</label>
            <input
              className={inputClass}
              value={data.authorName}
              onChange={(e) => update('authorName', e.target.value)}
              placeholder="Jane Doe"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="input-group">
              <label className="block text-[11px] font-mono text-muted-foreground mb-1.5">GITHUB</label>
              <input
                className={inputClass}
                value={data.authorGithub}
                onChange={(e) => update('authorGithub', e.target.value)}
                placeholder="janedoe"
              />
            </div>
            <div className="input-group">
              <label className="block text-[11px] font-mono text-muted-foreground mb-1.5">EMAIL</label>
              <input
                className={inputClass}
                value={data.authorEmail}
                onChange={(e) => update('authorEmail', e.target.value)}
                placeholder="jane@example.com"
              />
            </div>
          </div>
        </Section>

        {/* Bottom spacer */}
        <div className="h-8" />
      </div>
    </>
  );
}
