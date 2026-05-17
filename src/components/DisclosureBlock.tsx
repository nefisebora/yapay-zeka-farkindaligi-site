import type { ReactNode } from 'react';

interface DisclosureBlockProps {
  title: string;
  children: ReactNode;
}

export function DisclosureBlock({ title, children }: DisclosureBlockProps) {
  return (
    <details className="disclosure">
      <summary>{title}</summary>
      <div className="disclosure-body">{children}</div>
    </details>
  );
}
