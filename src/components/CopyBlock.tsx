import { useState, type ReactNode } from 'react';

interface CopyBlockProps {
  text: string;
  children: ReactNode;
}

export function CopyBlock({ text, children }: CopyBlockProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="copy-block">
      <div className="copy-toolbar">
        <button type="button" className="copy-btn" onClick={copy}>
          {copied ? 'Kopyalandı' : 'Kopyala'}
        </button>
      </div>
      {children}
    </div>
  );
}
