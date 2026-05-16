/**
 * LAZAREV HEADER COMPONENT
 *
 * Main navigation header displayed on all pages.
 *
 * FEATURES:
 * - Logo and branding
 * - Main navigation links
 * - User authentication state (logged in/out)
 * - User dropdown menu (when logged in)
 * - Login button (when logged out)
 *
 * BACKEND NOTES:
 * - User state comes from AppContext (global state)
 * - Logout button calls logout() from AppContext
 * - Login button opens modal (handled by AppContext)
 * - Navigation items are static but could be dynamic
 *   based on user permissions
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Anchor, ChevronDown, LayoutDashboard, Bookmark, Settings, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';

/**
 * MAIN NAVIGATION ITEMS
 * BACKEND TODO: Could be dynamic based on user role/permissions
 * For example, admin users might see additional menu items
 */
const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Legal Search', path: '/legal-search' },
  { label: 'Opportunities', path: '/opportunities' },
];

export function LazarevHeader() {
  const location = useLocation();
  const { user, openLoginModal, logout } = useApp(); // Global auth state
  const [dropdownOpen, setDropdownOpen] = useState(false); // User menu dropdown

  /**
   * Check if a navigation link is active
   * Used to highlight the current page in the navigation
   */
  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <header
      className="sticky top-0 z-50 bg-white"
      style={{ height: 64, borderBottom: '1px solid rgba(0,0,0,0.08)' }}
    >
      <div
        className="mx-auto flex items-center justify-between h-full"
        style={{ maxWidth: 1200, padding: '0 32px' }}
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 no-underline"
          style={{ textDecoration: 'none' }}
        >
          <Anchor size={20} style={{ color: '#0A3D62', strokeWidth: 2 }} />
          <span
            className="font-display"
            style={{
              color: '#0A3D62',
              fontSize: 20,
              letterSpacing: '0.12em',
              fontWeight: 400,
              userSelect: 'none',
            }}
          >
            LAZAREV
          </span>
        </Link>

        {/* Nav tabs */}
        <nav className="flex items-center gap-6">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className="relative py-1 no-underline transition-colors"
              style={{
                color: isActive(item.path) ? '#0A3D62' : '#1A1F2E',
                fontSize: 14,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                textDecoration: 'none',
              }}
              onMouseEnter={e => {
                if (!isActive(item.path))
                  (e.currentTarget as HTMLElement).style.color = '#1B7A8A';
              }}
              onMouseLeave={e => {
                if (!isActive(item.path))
                  (e.currentTarget as HTMLElement).style.color = '#1A1F2E';
              }}
            >
              {item.label}
              {isActive(item.path) && (
                <span
                  className="absolute bottom-0 left-0 right-0"
                  style={{
                    height: 2,
                    background: '#0A3D62',
                    borderRadius: 1,
                    transition: 'width 200ms ease',
                  }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Right: Auth */}
        <div className="flex items-center">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(o => !o)}
                className="flex items-center gap-2 rounded-full py-1 px-2 transition-colors"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: 36,
                    height: 36,
                    background: '#1B7A8A',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {user.initials}
                </div>
                <ChevronDown size={14} style={{ color: '#6B7280' }} />
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div
                    className="absolute right-0 z-50 bg-white rounded-xl py-1"
                    style={{
                      top: 44,
                      minWidth: 200,
                      boxShadow: '0 8px 32px rgba(10,61,98,0.12)',
                      border: '1px solid rgba(10,61,98,0.08)',
                    }}
                  >
                    <div className="px-4 py-2" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1F2E' }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: 12, color: '#6B7280' }}>{user.company}</div>
                    </div>
                    {[
                      { icon: <LayoutDashboard size={14} />, label: 'My Dashboard', path: '/dashboard' },
                      { icon: <Bookmark size={14} />, label: 'Saved Projects', path: '/dashboard' },
                      { icon: <Settings size={14} />, label: 'Settings', path: '/settings' },
                    ].map(item => (
                      <Link
                        key={item.label}
                        to={item.path}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 no-underline transition-colors"
                        style={{
                          color: '#1A1F2E',
                          fontSize: 13,
                          fontFamily: "'Inter', sans-serif",
                          textDecoration: 'none',
                        }}
                        onMouseEnter={e =>
                          ((e.currentTarget as HTMLElement).style.background = '#F7F9FC')
                        }
                        onMouseLeave={e =>
                          ((e.currentTarget as HTMLElement).style.background = 'transparent')
                        }
                      >
                        <span style={{ color: '#6B7280' }}>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                    <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', marginTop: 4 }}>
                      <button
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2 transition-colors"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#d4183d',
                          fontSize: 13,
                          fontFamily: "'Inter', sans-serif",
                        }}
                        onMouseEnter={e =>
                          ((e.currentTarget as HTMLElement).style.background = '#fff5f7')
                        }
                        onMouseLeave={e =>
                          ((e.currentTarget as HTMLElement).style.background = 'transparent')
                        }
                      >
                        <LogOut size={14} />
                        Log Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={openLoginModal}
              style={{
                padding: '8px 20px',
                border: '1px solid #0A3D62',
                borderRadius: 8,
                background: 'transparent',
                color: '#0A3D62',
                fontSize: 14,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = '#0A3D62';
                (e.currentTarget as HTMLElement).style.color = '#fff';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.color = '#0A3D62';
              }}
            >
              Log In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
