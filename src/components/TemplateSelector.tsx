import { TEMPLATES } from '@/lib/templates';
import type { ReadmeData } from '@/lib/types';

interface TemplateSelectorProps {
  onSelect: (data: Partial<ReadmeData>) => void;
  selectedId: string | null;
  onSelectId: (id: string) => void;
}

export function TemplateSelector({ onSelect, selectedId, onSelectId }: TemplateSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      {TEMPLATES.map((template) => {
        const isActive = selectedId === template.id;
        return (
          <button
            key={template.id}
            type="button"
            onClick={() => {
              onSelectId(template.id);
              onSelect(template.data);
            }}
            className={`flex-none px-3 py-1.5 rounded border text-xs font-medium whitespace-nowrap transition-colors ${
              isActive
                ? 'border-primary/30 bg-primary/5 text-primary'
                : 'border-border hover:border-ring bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {isActive ? `✓ ${template.name}` : template.name}
          </button>
        );
      })}
    </div>
  );
}
