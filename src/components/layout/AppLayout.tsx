import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Megaphone, 
  Settings, 
  Menu, 
  X,
  Bitcoin,
  Zap
} from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';

interface AppLayoutProps {
  children: ReactNode;
}

interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/',
    icon: <LayoutDashboard style={{ width: '20px', height: '20px' }} />,
  },
  {
    label: 'Campaigns',
    path: '/campaigns',
    icon: <Megaphone style={{ width: '20px', height: '20px' }} />,
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: <Settings style={{ width: '20px', height: '20px' }} />,
  },
];

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: 'var(--bg-primary)',
  },
  sidebar: (collapsed: boolean) => ({
    position: 'fixed' as const,
    left: 0,
    top: 0,
    height: '100%',
    backgroundColor: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border-secondary)',
    transition: 'all 0.3s',
    zIndex: 50,
    width: collapsed ? '64px' : '256px',
  }),
  logoSection: {
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    borderBottom: '1px solid var(--border-secondary)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoText: {
    fontWeight: 'bold',
    fontSize: '18px',
  },
  toggleButton: {
    padding: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'background-color 0.2s',
  },
  toggleButtonHover: {
    backgroundColor: 'var(--bg-hover)',
  },
  nav: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  navItem: (active: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    borderRadius: '8px',
    transition: 'all 0.2s',
    textDecoration: 'none' as const,
    backgroundColor: active ? 'var(--bitcoin-orange)' : 'transparent',
    color: active ? 'white' : 'var(--text-secondary)',
  }),
  navItemHover: {
    backgroundColor: 'var(--bg-hover)',
    color: 'var(--text-primary)',
  },
  navItemText: {
    fontWeight: '500',
  },
  userInfo: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    padding: '16px',
    borderTop: '1px solid var(--border-secondary)',
  },
  userEmail: {
    fontSize: '14px',
  },
  userEmailPrimary: {
    fontWeight: '500',
    color: 'var(--text-primary)',
  },
  userRole: {
    color: 'var(--text-tertiary)',
    textTransform: 'capitalize' as const,
  },
  logoutButton: {
    width: '100%',
    backgroundColor: 'transparent',
    border: '1px solid var(--border-primary)',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  logoutButtonHover: {
    backgroundColor: 'var(--bg-hover)',
    borderColor: 'var(--bitcoin-orange)',
  },
  main: (collapsed: boolean) => ({
    transition: 'all 0.3s',
    marginLeft: collapsed ? '64px' : '256px',
  }),
  header: {
    height: '64px',
    backgroundColor: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border-secondary)',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: '20px',
    fontWeight: '600',
  },
  headerUser: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  headerUserText: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
  },
  headerUserEmail: {
    color: 'var(--text-primary)',
    fontWeight: '500',
  },
  content: {
    padding: '24px',
  },
  bitcoin: {
    color: 'var(--bitcoin-orange)',
  },
};

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { user, logout } = useAuthStore();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar(sidebarCollapsed)}>
        {/* Logo */}
        <div style={styles.logoSection}>
          {!sidebarCollapsed && (
            <div style={styles.logo}>
              <Bitcoin style={{...styles.bitcoin, width: '24px', height: '24px'}} />
              <span style={styles.logoText}>Nostr Marketing</span>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            style={styles.toggleButton}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {sidebarCollapsed ? (
              <Menu style={{ width: '20px', height: '20px' }} />
            ) : (
              <X style={{ width: '20px', height: '20px' }} />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav style={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={styles.navItem(isActive(item.path))}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              {item.icon}
              {!sidebarCollapsed && <span style={styles.navItemText}>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User Info */}
        {user && (
          <div style={styles.userInfo}>
            {!sidebarCollapsed ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={styles.userEmail}>
                  <div style={styles.userEmailPrimary}>{user.email}</div>
                  <div style={styles.userRole}>{user.role}</div>
                </div>
                <button
                  onClick={logout}
                  style={styles.logoutButton}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                    e.currentTarget.style.borderColor = 'var(--bitcoin-orange)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'var(--border-primary)';
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={logout}
                style={{...styles.toggleButton, width: '100%'}}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                title="Logout"
              >
                <Zap style={{ width: '20px', height: '20px', margin: '0 auto' }} />
              </button>
            )}
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main style={styles.main(sidebarCollapsed)}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.headerTitle}>
            {navItems.find((item) => isActive(item.path))?.label || 'Nostr Marketing'}
          </h1>
          
          <div style={styles.headerUser}>
            {user && (
              <div style={styles.headerUserText}>
                Welcome, <span style={styles.headerUserEmail}>{user.email}</span>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div style={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}

// Made with Bob
