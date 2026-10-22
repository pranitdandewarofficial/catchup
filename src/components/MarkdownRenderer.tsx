import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const renderLatex = (text: string): string => {
  if (!text) return '';
  
  let result = text;
  
  // Handle display math $$...$$
  result = result.replace(/\$\$([\s\S]+?)\$\$/g, (match, formula) => {
    try {
      if (!formula || formula.trim().length === 0) return match;
      const html = katex.renderToString(formula.trim(), {
        throwOnError: false,
        displayMode: true,
        errorColor: '#cc0000',
        strict: false,
        trust: false
      });
      return `<div class="katex-display">${html}</div>`;
    } catch (e) {
      return `<span style="color: #cc0000;">[Math Error]</span>`;
    }
  });
  
  // Handle inline math $...$
  result = result.replace(/\$([^$\n]+?)\$/g, (match, formula) => {
    try {
      if (!formula || formula.trim().length === 0) return match;
      return katex.renderToString(formula.trim(), {
        throwOnError: false,
        displayMode: false,
        errorColor: '#cc0000',
        strict: false,
        trust: false
      });
    } catch (e) {
      return `<span style="color: #cc0000;">[Math Error]</span>`;
    }
  });
  
  return result;
};

const KaTeXRenderer: React.FC<{ html: string }> = ({ html }) => {
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const renderContent = () => {
    if (!content) return null;

    const displayParts = content.split(/(\$\$[\s\S]+?\$\$)/g);
    
    return displayParts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const formula = part.slice(2, -2).trim();
        try {
          const html = katex.renderToString(formula, {
            throwOnError: false,
            displayMode: true,
            errorColor: '#cc0000',
            strict: false
          });
          return (
            <div key={index} className="katex-display my-4 overflow-x-auto">
              <KaTeXRenderer html={html} />
            </div>
          );
        } catch (e) {
          return <span key={index} style={{ color: '#cc0000' }}>[Math Error]</span>;
        }
      }

      const inlineParts = part.split(/(\$[^$\n]+?\$)/g);
      
      return (
        <React.Fragment key={index}>
          {inlineParts.map((inlinePart, inlineIndex) => {
            if (inlinePart.startsWith('$') && inlinePart.endsWith('$')) {
              const formula = inlinePart.slice(1, -1).trim();
              try {
                const html = katex.renderToString(formula, {
                  throwOnError: false,
                  displayMode: false,
                  errorColor: '#cc0000',
                  strict: false
                });
                return <KaTeXRenderer key={inlineIndex} html={html} />;
              } catch (e) {
                return <span key={inlineIndex} style={{ color: '#cc0000' }}>[Math Error]</span>;
              }
            }

            return (
              <ReactMarkdown
                key={inlineIndex}
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => <span>{children}</span>,
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-4 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
                      <table className="min-w-full border-collapse">{children}</table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="px-4 py-2 font-semibold text-left" style={{
                      background: 'var(--bg2)',
                      borderBottom: '2px solid var(--border)'
                    }}>
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="px-4 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                      {children}
                    </td>
                  ),
                  code: ({ node, inline, ...props }: any) => {
                    if (inline) {
                      return (
                        <code className="px-1.5 py-0.5 rounded text-sm font-mono" style={{
                          background: 'rgba(37, 99, 235, 0.1)',
                          color: '#2563eb'
                        }} {...props} />
                      );
                    }
                    return (
                      <pre className="p-4 rounded-lg overflow-x-auto my-4" style={{
                        background: 'var(--bg2)',
                        border: '1px solid var(--border)'
                      }}>
                        <code className="font-mono text-sm" {...props} />
                      </pre>
                    );
                  },
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 pl-4 my-4 italic" style={{
                      borderColor: 'var(--accent)',
                      color: 'var(--text-secondary)',
                      background: 'rgba(37, 99, 235, 0.03)',
                      padding: '1rem',
                      borderRadius: '0 8px 8px 0'
                    }}>
                      {children}
                    </blockquote>
                  ),
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold mt-6 mb-3" style={{ color: 'var(--text)' }}>{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-bold mt-5 mb-2" style={{ color: 'var(--text)' }}>{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-bold mt-4 mb-2" style={{ color: 'var(--text)' }}>{children}</h3>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside my-3 space-y-1.5">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside my-3 space-y-1.5">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="ml-2">{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold" style={{ color: 'var(--text)' }}>{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic">{children}</em>
                  ),
                  a: ({ href, children }) => (
                    <a href={href} className="underline transition-opacity hover:opacity-80" style={{ color: 'var(--accent)' }} target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                  hr: () => (
                    <hr className="my-6" style={{ borderColor: 'var(--border)' }} />
                  ),
                }}
              >
                {inlinePart}
              </ReactMarkdown>
            );
          })}
        </React.Fragment>
      );
    });
  };

  return (
    <div className={`relative group ${className}`}>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
        style={{
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          color: 'var(--text-secondary)'
        }}
        title={copied ? 'Copied!' : 'Copy response'}
      >
        {copied ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>

      <div className="markdown-content overflow-x-hidden">
        {renderContent()}
      </div>
    </div>
  );
};
