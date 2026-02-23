import { useState } from 'react';
import { toast } from 'sonner';

interface MarkdownOutputProps {
  markdown: string;
}

export function MarkdownOutput({ markdown }: MarkdownOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!markdown.trim()) {
      toast.warning('Nothing to copy');
      return;
    }
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      toast.success('Markdown copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = markdown;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      toast.success('Markdown copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!markdown.trim()) {
      toast.warning('Nothing to download');
      return;
    }
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Downloaded README.md');
  };

  if (!markdown.trim()) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-[#8b949e]/50">
        <span className="material-symbols-outlined text-6xl mb-4">code</span>
        <p className="text-lg font-medium">Raw markdown will appear here</p>
        <p className="text-sm mt-1">Fill in the form to generate markdown</p>
      </div>
    );
  }

  return (
    <div className="border border-[#30363d] rounded-md bg-[#0d1117] overflow-hidden">
      {/* File header */}
      <div className="bg-[#161b22] px-4 py-3 border-b border-[#30363d] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#8b949e] text-[18px]">code</span>
          <span className="text-sm font-bold text-[#c9d1d9]">README.md</span>
          <span className="text-xs text-[#8b949e] ml-2">{markdown.length} chars</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded text-[#8b949e] hover:text-white hover:bg-[#30363d] transition-colors"
            title="Copy"
          >
            <span className="material-symbols-outlined text-[16px]">
              {copied ? 'check' : 'content_copy'}
            </span>
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 rounded text-[#8b949e] hover:text-white hover:bg-[#30363d] transition-colors"
            title="Download"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
          </button>
        </div>
      </div>

      {/* Raw content */}
      <div className="p-6 overflow-auto max-h-[calc(100vh-16rem)]">
        <pre className="text-xs font-mono text-[#c9d1d9] leading-relaxed whitespace-pre-wrap break-words">
          {markdown}
        </pre>
      </div>
    </div>
  );
}
