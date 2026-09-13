'use client';

import Link from 'next/link';
import { Globe2, LogOut, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

import { agentWorkspaceHref, agentWorkspaceNavigation } from '@/lib/agentWorkspaceNavigation';

import styles from './AgentWorkspaceShell.module.css';

type AgentWorkspaceNavigationProps = {
  clientCaseId?: string | null;
};

function NavigationLinks({ clientCaseId, onNavigate }: AgentWorkspaceNavigationProps & { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {agentWorkspaceNavigation.map((item) => {
        const active = item.active(pathname);
        return (
          <Link
            aria-current={active ? 'page' : undefined}
            className={`${styles.navigationLink} ${active ? styles.navigationLinkActive : ''} ${item.type === 'UTILITY' ? styles.navigationUtility : ''}`}
            data-agent-nav-key={item.key}
            href={agentWorkspaceHref(item, clientCaseId)}
            key={item.key}
            onClick={onNavigate}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export default function AgentWorkspaceNavigation({ clientCaseId }: AgentWorkspaceNavigationProps) {
  const pathname = usePathname();
  const [openPathname, setOpenPathname] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuOpen = openPathname === pathname;

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setOpenPathname(null);
      triggerRef.current?.focus();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setOpenPathname(null);

  return (
    <header className={styles.header} data-testid="agent-workspace-navigation">
      <div className={styles.headerInner}>
        <Link aria-label="Agent Workspace home" className={styles.brand} data-testid="agent-workspace-home-link" href="/agent">
          <span className={styles.brandProduct}>Project Atlas</span>
          <span className={styles.brandWorkspace}>Agent Workspace</span>
        </Link>

        <nav aria-label="Agent workspace navigation" className={styles.desktopNavigation}>
          <NavigationLinks clientCaseId={clientCaseId} />
          <span aria-hidden="true" className={styles.utilityDivider} />
          <Link className={styles.publicSiteLink} data-testid="agent-workspace-public-site-link" href="/" prefetch={false}>
            <Globe2 aria-hidden="true" size={15} />
            Public Site
          </Link>
          <a className={styles.signOutLink} data-testid="agent-workspace-sign-out" href="/agent/logout?next=/agent">
            <LogOut aria-hidden="true" size={15} />
            Sign out
          </a>
        </nav>

        <button
          aria-controls="agent-workspace-mobile-navigation"
          aria-expanded={menuOpen}
          className={styles.menuTrigger}
          onClick={() => setOpenPathname(menuOpen ? null : pathname)}
          ref={triggerRef}
          type="button"
        >
          {menuOpen ? <X aria-hidden="true" size={18} /> : <Menu aria-hidden="true" size={18} />}
          <span>{menuOpen ? 'Close navigation' : 'Navigation'}</span>
        </button>
      </div>

      <nav
        aria-label="Agent workspace navigation"
        className={`${styles.mobileNavigation} ${menuOpen ? styles.mobileNavigationOpen : ''}`}
        hidden={!menuOpen}
        id="agent-workspace-mobile-navigation"
      >
        <div className={styles.mobileNavigationInner}>
          <NavigationLinks clientCaseId={clientCaseId} onNavigate={closeMenu} />
          <div className={styles.mobileUtilities}>
            <Link className={styles.publicSiteLink} data-testid="agent-workspace-mobile-public-site-link" href="/" onClick={closeMenu} prefetch={false}>
              <Globe2 aria-hidden="true" size={16} />
              Public Site
            </Link>
            <a className={styles.signOutLink} data-testid="agent-workspace-mobile-sign-out" href="/agent/logout?next=/agent">
              <LogOut aria-hidden="true" size={16} />
              Sign out
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
