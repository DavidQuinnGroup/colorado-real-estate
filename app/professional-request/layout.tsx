import type { ReactNode } from 'react';

import ProjectAtlasExternalShell from '@/components/project-atlas/ProjectAtlasExternalShell';

export default function ProfessionalRequestExternalLayout({ children }: { children: ReactNode }) {
  return <ProjectAtlasExternalShell>{children}</ProjectAtlasExternalShell>;
}
