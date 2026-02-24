import { useCallback, useRef, useState } from 'react';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}

export function ImageUploader({ label, value, onChange, hint }: ImageUploaderProps) {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return;
      // Use Object URL instead of Base64 to prevent massive string freezing in Code tab
      const url = URL.createObjectURL(file);
      onChange(url);
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-mono text-muted-foreground mb-1.5">{label}</label>
      {hint && <p className="text-[10px] text-muted-foreground/50">{hint}</p>}

      {/* Mode toggle */}
      <div className="flex gap-1 p-0.5 bg-secondary rounded border border-border w-fit">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`flex items-center gap-1 px-2 py-1 text-[10px] font-mono rounded transition-all ${
            mode === 'upload'
              ? 'bg-card text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <span className="material-symbols-outlined text-[12px]">upload</span>
          Upload
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`flex items-center gap-1 px-2 py-1 text-[10px] font-mono rounded transition-all ${
            mode === 'url'
              ? 'bg-card text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <span className="material-symbols-outlined text-[12px]">link</span>
          URL
        </button>
      </div>

      {value ? (
        <div className="relative group rounded border border-border overflow-hidden">
          <img
            src={value}
            alt={label}
            className="w-full h-28 object-contain bg-secondary"
          />
          <button
            type="button"
            className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center bg-secondary border border-border rounded text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
            onClick={() => onChange('')}
          >
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        </div>
      ) : mode === 'upload' ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex flex-col items-center justify-center gap-1.5 py-6 border border-dashed rounded cursor-pointer transition-all ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-ring hover:bg-secondary/50'
          }`}
        >
          <span className="material-symbols-outlined text-[24px] text-muted-foreground/50">cloud_upload</span>
          <p className="text-[11px] font-mono text-muted-foreground">
            Drop image or <span className="text-primary">browse</span>
          </p>
          <p className="text-[9px] text-muted-foreground/60 w-3/4 text-center mt-1 leading-tight">
            Local uploads are temporary for preview purposes. <br/> Use the URL tab for your final GitHub README.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>
      ) : (
        <input
          type="url"
          placeholder="https://example.com/image.png"
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-secondary border border-border rounded text-xs text-foreground px-3 py-2 font-mono focus:outline-none focus:border-ring transition-colors placeholder:text-muted-foreground/50"
        />
      )}
    </div>
  );
}
