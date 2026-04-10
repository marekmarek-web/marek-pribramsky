"use client";

import ReactMarkdown from "react-markdown";

/** Pouze admin editor — klientský náhled; veřejný blog používá serverový `BlogMarkdown`. */
export function MarkdownPreview({ body }: { body: string }) {
  return (
    <div className="blog-md text-brand-text leading-relaxed">
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="mb-4 text-brand-muted last:mb-0">{children}</p>,
          h2: ({ children }) => (
            <h2 className="text-xl font-bold text-brand-text mt-10 mb-3 first:mt-0">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-bold text-brand-text mt-8 mb-2">{children}</h3>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-5 space-y-2 text-brand-muted mb-4">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 space-y-2 text-brand-muted mb-4">{children}</ol>
          ),
          li: ({ children }) => <li>{children}</li>,
          strong: ({ children }) => <strong className="font-bold text-brand-text">{children}</strong>,
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-brand-navy font-semibold hover:text-brand-cyan underline underline-offset-2"
              rel="noopener noreferrer"
              target={href?.startsWith("http") ? "_blank" : undefined}
            >
              {children}
            </a>
          ),
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}
