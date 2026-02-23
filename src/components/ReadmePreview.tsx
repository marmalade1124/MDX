import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface ReadmePreviewProps {
  markdown: string;
}

export function ReadmePreview({ markdown }: ReadmePreviewProps) {
  if (!markdown.trim()) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-[#8b949e]/50">
        <span className="material-symbols-outlined text-6xl mb-4">description</span>
        <p className="text-lg font-medium">Your README preview will appear here</p>
        <p className="text-sm mt-1">Start filling in the form or pick a template</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');
            if (match) {
              return (
                <div className="bg-[#161b22] border border-[#30363d] rounded-md p-4 overflow-x-auto relative group my-3">
                  <pre className="text-sm font-mono text-[#c9d1d9]">
                    <code>{codeString}</code>
                  </pre>
                </div>
              );
            }
            return (
              <code className={`${className} bg-[rgba(110,118,129,0.2)] px-1.5 py-0.5 rounded text-xs font-mono`} {...props}>
                {children}
              </code>
            );
          },
          h1({ children }) {
            return <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight pb-2 border-b border-[#21262d] mb-4">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-2xl font-semibold text-white border-b border-[#21262d] pb-2 flex items-center gap-3 mt-8 mb-4">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-lg font-semibold text-white mt-4 mb-2">{children}</h3>;
          },
          p({ children }) {
            return <p className="text-[#c9d1d9] leading-7">{children}</p>;
          },
          a({ href, children }) {
            return (
              <a href={href} className="text-[#58a6ff] hover:underline" target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            );
          },
          img({ src, alt }) {
            return (
              <img
                src={src}
                alt={alt || ''}
                className="max-w-full h-auto rounded-lg"
                style={{ maxHeight: '300px' }}
              />
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-3">
                <table className="border-collapse w-auto">{children}</table>
              </div>
            );
          },
          th({ children }) {
            return <th className="border border-[#30363d] px-4 py-2 bg-[#161b22] text-left font-semibold text-sm text-[#c9d1d9]">{children}</th>;
          },
          td({ children }) {
            return <td className="border border-[#30363d] px-4 py-2 text-sm text-[#c9d1d9]">{children}</td>;
          },
          ul({ children }) {
            return <ul className="list-disc list-inside space-y-1 text-[#c9d1d9]">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal list-inside space-y-1 text-[#c9d1d9]">{children}</ol>;
          },
          li({ children }) {
            return <li className="text-[#c9d1d9]">{children}</li>;
          },
          hr() {
            return <hr className="border-[#21262d] my-8" />;
          },
          strong({ children }) {
            return <strong className="font-semibold text-white">{children}</strong>;
          },
          em({ children }) {
            return <em className="text-[#8b949e]">{children}</em>;
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
