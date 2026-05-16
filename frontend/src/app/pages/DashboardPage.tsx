/**
 * DASHBOARD PAGE
 *
 * User's personal dashboard showing:
 * - Compliance score and ESG metrics
 * - Saved/bookmarked projects
 * - Recent activity feed
 * - Available tax benefits
 * - Quick access navigation
 *
 * AUTHENTICATION:
 * ===============
 * This page requires user to be logged in.
 * If not authenticated, shows message to log in.
 *
 * BACKEND INTEGRATION REQUIREMENTS:
 * ==================================
 *
 * 1. USER DASHBOARD DATA:
 *    GET /api/dashboard/:userId
 *    Response: {
 *      complianceScore: number,      // 0-100 score
 *      esgMetrics: {
 *        biodiversityImpact: string,
 *        carbonOffset: string,
 *        investmentAmount: string
 *      },
 *      savedProjects: Project[],     // User's bookmarked projects
 *      recentActivity: Activity[],    // Recent views, saves, donations
 *      availableTaxBenefits: TaxBenefit[], // Based on user's country/sector
 *      alerts: Alert[]                // Compliance alerts, new opportunities
 *    }
 *
 * 2. RECENT ACTIVITY TRACKING:
 *    - Log when user views a project: POST /api/activity/view
 *    - Log when user saves a project: POST /api/activity/save
 *    - Log when user makes a donation: POST /api/activity/donate
 *    - Retrieve for dashboard: GET /api/activity/:userId?limit=10
 *
 * 3. TAX BENEFIT ELIGIBILITY:
 *    - Calculate based on user's company country and sector
 *    - GET /api/tax-benefits/eligible?country=SI&sector=Maritime
 *    - Include links to legal documents
 *    - Update when regulations change
 *
 * 4. COMPLIANCE SCORE:
 *    - Calculate based on user's ESG activities
 *    - Factors: donations made, regulations followed, reporting completed
 *    - Update periodically (daily/weekly)
 *    - Provide breakdown of score components
 *
 * 5. SIDEBAR NAVIGATION:
 *    - Dashboard: Current view
 *    - My Profile: Link to /organizations/:userCompanySlug
 *    - Saved Projects: Filter to show only bookmarked
 *    - Donations: History of user's donations
 *    - Reports: Generated ESG compliance reports
 *    - Settings: Link to /settings
 */

import { useState } from 'react';
import { Link } from 'react-router';
import {
  LayoutDashboard,
  User,
  Bookmark,
  DollarSign,
  FileText,
  Settings,
  HelpCircle,
  TrendingUp,
  Clock,
  ChevronRight,
  Anchor,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockProjects } from '../data/mockData';

/**
 * SIDEBAR NAVIGATION ITEMS
 * BACKEND TODO: Some of these could link to actual routes/pages
 */
const navItems = [
  { icon: <LayoutDashboard size={16} />, label: 'Dashboard', active: true },
  { icon: <User size={16} />, label: 'My Profile' },
  { icon: <Bookmark size={16} />, label: 'Saved Projects' },
  { icon: <DollarSign size={16} />, label: 'Donations' },
  { icon: <FileText size={16} />, label: 'Reports' },
  { icon: <Settings size={16} />, label: 'Settings', path: '/settings' },
];

/**
 * RECENT ACTIVITY DATA
 * BACKEND TODO: Load from GET /api/activity/:userId
 * Track user actions (views, saves, donations) with timestamps
 */
const recentActivity = [
  { action: 'Viewed', project: 'Posidonia Foundation', time: '2 hours ago' },
  { action: 'Saved', project: 'Adriatic Blue Coalition', time: 'yesterday' },
  { action: 'Viewed', project: 'Nordic Marine Recovery Fund', time: '2 days ago' },
  { action: 'Viewed', project: 'Baltic Fisheries Alliance', time: '3 days ago' },
  { action: 'Saved', project: 'Dalmatian Coast Biodiversity Trust', time: '1 week ago' },
];

/**
 * TAX BENEFITS ELIGIBILITY
 * BACKEND TODO: Calculate based on user's country and sector
 * GET /api/tax-benefits/eligible?userId=:userId
 */
const taxBenefits = [
  { country: '🇸🇮 Slovenia', law: 'Maritime Code §234', max: 'Up to 0.3% of revenue', status: 'Eligible' },
  { country: '🇭🇷 Croatia', law: 'Environmental Protection Act Art. 98', max: 'Full exemption', status: 'Eligible' },
  { country: '🇮🇹 Italy', law: 'TUIR Art. 100', max: 'Up to 30% of income', status: 'Check required' },
];

/**
 * MAIN DASHBOARD COMPONENT
 */
export function DashboardPage() {
  const { user, savedProjects } = useApp(); // Get user and their saved projects
  const [activeNav, setActiveNav] = useState('Dashboard');

  /**
   * AUTHENTICATION CHECK
   * Redirect or show message if user is not logged in
   * BACKEND: Could also check this server-side and return 401
   */
  if (!user) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          fontFamily: "'Inter', sans-serif",
          color: '#6B7280',
          gap: 16,
        }}
      >
        <Anchor size={40} style={{ color: '#0A3D62', opacity: 0.3 }} />
        <p style={{ fontSize: 16 }}>Please log in to access your dashboard.</p>
        <Link
          to="/"
          style={{
            padding: '10px 24px',
            background: '#0A3D62',
            color: '#fff',
            borderRadius: 8,
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          Return to Homepage
        </Link>
      </div>
    );
  }

  const savedProjectData = mockProjects.filter(p => savedProjects.includes(p.id));

  const kpis = [
    {
      label: 'Saved Organisations',
      value: savedProjects.length.toString(),
      trend: '+2 this week',
      up: true,
    },
    {
      label: 'Active Campaigns',
      value: '3',
      trend: '+1 new',
      up: true,
    },
    {
      label: 'Countries Covered',
      value: '7',
      trend: 'Across Adriatic',
      up: null,
    },
    {
      label: 'Potential Tax Saving',
      value: '€48K',
      trend: 'Est. annual',
      up: true,
    },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F7F9FC' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          background: '#fff',
          borderRight: '1px solid rgba(10,61,98,0.08)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ padding: '20px 20px 8px' }}>
          <div className="flex items-center gap-2">
            <Anchor size={16} style={{ color: '#0A3D62' }} />
            <span
              className="font-display"
              style={{ fontSize: 15, letterSpacing: '0.1em', color: '#0A3D62' }}
            >
              LAZAREV
            </span>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '8px 12px' }}>
          {navItems.map(item => {
            const active = activeNav === item.label;
            return (
              <button
                key={item.label}
                onClick={() => setActiveNav(item.label)}
                className="flex items-center gap-3 w-full"
                style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: 'none',
                  background: active ? '#0A3D62' : 'transparent',
                  color: active ? '#fff' : '#6B7280',
                  fontSize: 13,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: active ? 600 : 400,
                  cursor: 'pointer',
                  textAlign: 'left',
                  marginBottom: 2,
                  borderLeft: active ? '3px solid #1B7A8A' : '3px solid transparent',
                  transition: 'all 150ms',
                }}
                onMouseEnter={e => {
                  if (!active)
                    (e.currentTarget as HTMLElement).style.background = '#F7F9FC';
                }}
                onMouseLeave={e => {
                  if (!active)
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid rgba(10,61,98,0.08)',
          }}
        >
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#6B7280',
              fontSize: 12,
              fontFamily: "'Inter', sans-serif",
              marginBottom: 12,
            }}
          >
            <HelpCircle size={12} />
            Need help? Contact support
          </button>
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#1B7A8A',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                flexShrink: 0,
              }}
            >
              {user.initials}
            </div>
            <div>
              <div style={{ fontSize: 12, fontFamily: "'Inter', sans-serif", fontWeight: 600, color: '#1A1F2E' }}>
                {user.company}
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  padding: '1px 6px',
                  borderRadius: 4,
                  background: 'rgba(10,61,98,0.08)',
                  color: '#0A3D62',
                }}
              >
                Free
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
        {/* Welcome strip */}
        <div style={{ marginBottom: 32 }}>
          <h1
            className="font-display"
            style={{ fontSize: 22, fontWeight: 400, color: '#0A3D62', margin: '0 0 6px' }}
          >
            Good morning, {user.firstName}. Your {user.zones[0]} operational profile has 5 new
            matches this week.
          </h1>
          <p
            style={{
              fontSize: 13,
              fontFamily: "'Inter', sans-serif",
              color: '#6B7280',
              margin: 0,
            }}
          >
            Last updated: today at 08:14 UTC
          </p>
        </div>

        {/* KPI Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
            marginBottom: 40,
          }}
        >
          {kpis.map(kpi => (
            <div
              key={kpi.label}
              style={{
                background: '#fff',
                borderRadius: 12,
                border: '1px solid rgba(10,61,98,0.08)',
                padding: '20px 20px 16px',
                boxShadow: '0 2px 8px rgba(10,61,98,0.04)',
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  fontFamily: "'Inter', sans-serif",
                  color: '#6B7280',
                  marginBottom: 8,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: 500,
                }}
              >
                {kpi.label}
              </p>
              <div className="flex items-end justify-between">
                <span
                  className="font-display"
                  style={{ fontSize: 32, color: '#0A3D62', lineHeight: 1 }}
                >
                  {kpi.value}
                </span>
                {kpi.up !== null && (
                  <TrendingUp
                    size={14}
                    style={{ color: kpi.up ? '#2E7D52' : '#d4183d', marginBottom: 4 }}
                  />
                )}
              </div>
              <p
                style={{
                  fontSize: 11,
                  fontFamily: "'Inter', sans-serif",
                  color: '#6B7280',
                  marginTop: 6,
                }}
              >
                {kpi.trend}
              </p>
            </div>
          ))}
        </div>

        {/* Saved Projects */}
        <section style={{ marginBottom: 40 }}>
          <div className="flex items-center justify-between mb-4">
            <h2
              className="font-display"
              style={{ fontSize: 20, fontWeight: 400, color: '#0A3D62', margin: 0 }}
            >
              My Saved Projects
            </h2>
            <button
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#1B7A8A',
                fontSize: 13,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              See all <ChevronRight size={12} />
            </button>
          </div>
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
            {savedProjectData.length === 0 ? (
              <p
                style={{
                  fontSize: 13,
                  fontFamily: "'Inter', sans-serif",
                  color: '#6B7280',
                }}
              >
                No saved projects yet. Browse opportunities to save organisations.
              </p>
            ) : (
              savedProjectData.map(project => (
                <div
                  key={project.id}
                  style={{
                    background: '#fff',
                    borderRadius: 12,
                    border: '1px solid rgba(10,61,98,0.08)',
                    padding: 16,
                    minWidth: 280,
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(10,61,98,0.04)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      style={{
                        fontSize: 18,
                      }}
                    >
                      {project.categoryIcon}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        color: '#0A3D62',
                      }}
                    >
                      {project.name}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 12,
                      fontFamily: "'Inter', sans-serif",
                      color: '#6B7280',
                      lineHeight: 1.5,
                      margin: '0 0 10px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {project.description}
                  </p>
                  <Link
                    to={`/organizations/${project.slug}`}
                    style={{
                      fontSize: 12,
                      color: '#1B7A8A',
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                      textDecoration: 'none',
                    }}
                  >
                    View Profile →
                  </Link>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Tax Benefit Summary */}
        <section style={{ marginBottom: 40 }}>
          <h2
            className="font-display"
            style={{ fontSize: 20, fontWeight: 400, color: '#0A3D62', margin: '0 0 16px' }}
          >
            Tax Benefit Summary
          </h2>
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              border: '1px solid rgba(10,61,98,0.08)',
              overflow: 'hidden',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(10,61,98,0.08)' }}>
                  {['Country', 'Applicable Law', 'Max Deduction', 'Status'].map(h => (
                    <th
                      key={h}
                      style={{
                        padding: '12px 20px',
                        textAlign: 'left',
                        fontSize: 11,
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        color: '#6B7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {taxBenefits.map((row, i) => (
                  <tr
                    key={i}
                    style={{
                      borderBottom:
                        i < taxBenefits.length - 1 ? '1px solid rgba(10,61,98,0.06)' : 'none',
                    }}
                  >
                    <td
                      style={{
                        padding: '14px 20px',
                        fontSize: 13,
                        fontFamily: "'Inter', sans-serif",
                        color: '#1A1F2E',
                        fontWeight: 500,
                      }}
                    >
                      {row.country}
                    </td>
                    <td
                      style={{
                        padding: '14px 20px',
                        fontSize: 12,
                        fontFamily: "'Inter', sans-serif",
                        color: '#6B7280',
                      }}
                    >
                      {row.law}
                    </td>
                    <td
                      style={{
                        padding: '14px 20px',
                        fontSize: 13,
                        fontFamily: "'Inter', sans-serif",
                        color: '#1A1F2E',
                      }}
                    >
                      {row.max}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 600,
                          padding: '3px 10px',
                          borderRadius: 9999,
                          background:
                            row.status === 'Eligible'
                              ? 'rgba(46,125,82,0.1)'
                              : 'rgba(180,83,9,0.1)',
                          color: row.status === 'Eligible' ? '#2E7D52' : '#b45309',
                        }}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <h2
            className="font-display"
            style={{ fontSize: 20, fontWeight: 400, color: '#0A3D62', margin: '0 0 16px' }}
          >
            Recent Activity
          </h2>
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              border: '1px solid rgba(10,61,98,0.08)',
              padding: '8px 0',
            }}
          >
            {recentActivity.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3"
                style={{
                  padding: '12px 20px',
                  borderBottom:
                    i < recentActivity.length - 1 ? '1px solid rgba(10,61,98,0.06)' : 'none',
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background:
                      item.action === 'Saved'
                        ? 'rgba(27,122,138,0.1)'
                        : 'rgba(10,61,98,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {item.action === 'Saved' ? (
                    <Bookmark size={13} style={{ color: '#1B7A8A' }} />
                  ) : (
                    <Clock size={13} style={{ color: '#0A3D62' }} />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <span
                    style={{
                      fontSize: 13,
                      fontFamily: "'Inter', sans-serif",
                      color: '#1A1F2E',
                    }}
                  >
                    {item.action}{' '}
                    <span style={{ fontWeight: 600, color: '#0A3D62' }}>{item.project}</span>
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: "'Inter', sans-serif",
                    color: '#6B7280',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
