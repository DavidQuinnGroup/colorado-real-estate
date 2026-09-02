import type { ReactNode } from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';

export const PROJECT_ATLAS_PUBLIC_HOME_PATH = '/';

export function ProjectAtlasPublicHomeAction({ terminal = false }: { terminal?: boolean }) {
  return <Link href={PROJECT_ATLAS_PUBLIC_HOME_PATH} prefetch={false} className={`atlas-action ${terminal ? 'atlas-action-primary' : 'atlas-action-secondary'} atlas-public-home-action`} data-testid={terminal ? 'project-atlas-external-terminal-home-link' : 'project-atlas-external-home-link'}><Home size={16} aria-hidden="true" />Return to David Quinn Group</Link>;
}

export default function ProjectAtlasExternalShell({ children }: { children: ReactNode }) {
  return <section className="atlas-external-shell" data-testid="project-atlas-external-shell" data-project-atlas-navigation-surface="PUBLIC_EXTERNAL"><header className="atlas-external-navigation"><div className="mx-auto flex max-w-2xl items-center justify-between gap-4"><p className="min-w-0 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100/70">David Quinn Group / Project Atlas</p><ProjectAtlasPublicHomeAction /></div></header>{children}</section>;
}
