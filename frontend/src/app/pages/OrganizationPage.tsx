import { useState } from 'react';
import { useParams, Link } from 'react-router';
import {
  ExternalLink,
  Share2,
  Bookmark,
  MapPin,
  Globe,
  ChevronRight,
} from 'lucide-react';
import { mockProjects } from '../data/mockData';
import { useApp } from '../context/AppContext';

const tabs = ['Overview', 'Tax Benefits', 'Contact', 'Documents', 'Future Plans'];

function ProgressBar({ raised, goal }: { raised: number; goal: number }) {
  const pct = Math.min(100, Math.round((raised / goal) * 100));
  return (
    <div>
      <div
        style={{
          height: 8,
          borderRadius: 4,
          background: 'rgba(10,61,98,0.1)',
          overflow: 'hidden',
          marginBottom: 6,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: '#0A3D62',
            borderRadius: 4,
            transition: 'width 600ms ease',
          }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span style={{ fontSize: 12, fontFamily: "'Inter', sans-serif", color: '#1A1F2E', fontWeight: 500 }}>
          €{raised.toLocaleString()} raised of €{goal.toLocaleString()} goal
        </span>
        <span style={{ fontSize: 12, fontFamily: "'Inter', sans-serif", color: '#6B7280' }}>
          {pct}%
        </span>
      </div>
    </div>
  );
}

export function OrganizationPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user, savedProjects, toggleSaveProject } = useApp();
  const [activeTab, setActiveTab] = useState('Overview');
  const [saved, setSaved] = useState(false);

  const project = mockProjects.find(p => p.slug === slug);

  if (!project) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          fontFamily: "'Inter', sans-serif",
          color: '#6B7280',
          gap: 16,
        }}
      >
        <p>Organisation not found.</p>
        <Link
          to="/opportunities"
          style={{ color: '#1B7A8A', fontSize: 14, textDecoration: 'none' }}
        >
          ← Back to Opportunities
        </Link>
      </div>
    );
  }

  const isSaved = savedProjects.includes(project.id);

  return (
    <div style={{ background: '#F7F9FC', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div
        style={{
          background: '#fff',
          borderBottom: '1px solid rgba(10,61,98,0.08)',
          padding: '12px 32px',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="flex items-center gap-2">
            {[
              { label: 'Home', path: '/' },
              { label: 'Opportunities', path: '/opportunities' },
              { label: project.name },
            ].map((crumb, i, arr) => (
              <span key={i} className="flex items-center gap-2">
                {crumb.path ? (
                  <Link
                    to={crumb.path}
                    style={{
                      fontSize: 13,
                      fontFamily: "'Inter', sans-serif",
                      color: '#6B7280',
                      textDecoration: 'none',
                    }}
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    style={{
                      fontSize: 13,
                      fontFamily: "'Inter', sans-serif",
                      color: '#1A1F2E',
                      fontWeight: 500,
                    }}
                  >
                    {crumb.label}
                  </span>
                )}
                {i < arr.length - 1 && (
                  <ChevronRight size={12} style={{ color: '#6B7280' }} />
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 32px 64px' }}>
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
          {/* Main content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Status banner */}
            {project.isVerified ? (
              <div
                style={{
                  background: 'rgba(46,125,82,0.08)',
                  border: '1px solid rgba(46,125,82,0.2)',
                  borderRadius: 8,
                  padding: '10px 16px',
                  marginBottom: 24,
                  fontSize: 13,
                  fontFamily: "'Inter', sans-serif",
                  color: '#2E7D52',
                  fontWeight: 500,
                }}
              >
                ✓ Verified Partner — This organisation is actively registered on Lazarev and
                accepts donations through our platform.
              </div>
            ) : (
              <div
                style={{
                  background: 'rgba(180,83,9,0.06)',
                  border: '1px solid rgba(180,83,9,0.2)',
                  borderRadius: 8,
                  padding: '10px 16px',
                  marginBottom: 24,
                  fontSize: 13,
                  fontFamily: "'Inter', sans-serif",
                  color: '#b45309',
                  fontWeight: 500,
                }}
              >
                ◦ Public Data Profile — This profile was generated from public sources. The
                organisation has not yet claimed this page. Data may be incomplete.
              </div>
            )}

            {/* Org identity */}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'rgba(27,122,138,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
                fontSize: 28,
              }}
            >
              {project.categoryIcon}
            </div>

            <h1
              className="font-display"
              style={{ fontSize: 36, fontWeight: 400, color: '#0A3D62', margin: '0 0 12px' }}
            >
              {project.name}
            </h1>

            {/* Category tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
              {[project.category, ...project.zones, ...(project.isVerified ? ['EU Funded'] : [])].map(
                tag => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 12,
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                      padding: '3px 10px',
                      borderRadius: 9999,
                      background: 'rgba(27,122,138,0.08)',
                      color: '#1B7A8A',
                    }}
                  >
                    {tag}
                  </span>
                )
              )}
            </div>

            <p
              style={{
                fontSize: 16,
                fontFamily: "'Inter', sans-serif",
                color: '#1A1F2E',
                lineHeight: 1.6,
                marginBottom: 24,
              }}
            >
              {project.description}
            </p>

            {/* Tabs */}
            <div
              style={{
                borderBottom: '2px solid rgba(10,61,98,0.08)',
                display: 'flex',
                gap: 0,
                marginBottom: 32,
              }}
            >
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '10px 20px',
                    background: 'none',
                    border: 'none',
                    borderBottom: activeTab === tab ? '2px solid #0A3D62' : '2px solid transparent',
                    marginBottom: -2,
                    cursor: 'pointer',
                    fontSize: 14,
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: activeTab === tab ? 600 : 400,
                    color: activeTab === tab ? '#0A3D62' : '#6B7280',
                    transition: 'all 200ms ease',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab: Overview */}
            {activeTab === 'Overview' && (
              <div>
                <h3
                  style={{
                    fontSize: 16,
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    color: '#0A3D62',
                    marginBottom: 12,
                  }}
                >
                  About this organisation
                </h3>
                {(project.longDescription ?? project.description)
                  .split('\n\n')
                  .filter(Boolean)
                  .map((para, i) => (
                    <p
                      key={i}
                      style={{
                        fontSize: 15,
                        fontFamily: "'Inter', sans-serif",
                        color: '#1A1F2E',
                        lineHeight: 1.7,
                        marginBottom: 16,
                      }}
                    >
                      {para}
                    </p>
                  ))}

                {/* KPI cards */}
                {project.impactMetrics && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: 16,
                      margin: '28px 0',
                    }}
                  >
                    {project.impactMetrics.map(metric => (
                      <div
                        key={metric.label}
                        style={{
                          background: '#fff',
                          borderRadius: 10,
                          border: '1px solid rgba(10,61,98,0.08)',
                          padding: '16px 20px',
                          textAlign: 'center',
                        }}
                      >
                        <div
                          className="font-display"
                          style={{ fontSize: 32, color: '#0A3D62', lineHeight: 1.1, marginBottom: 6 }}
                        >
                          {metric.value}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            fontFamily: "'Inter', sans-serif",
                            color: '#6B7280',
                          }}
                        >
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* EU Frameworks */}
                {project.euFrameworks && (
                  <div>
                    <h4
                      style={{
                        fontSize: 13,
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        color: '#0A3D62',
                        marginBottom: 10,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}
                    >
                      EU Framework Alignment
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {project.euFrameworks.map(fw => (
                        <span
                          key={fw}
                          style={{
                            fontSize: 12,
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 500,
                            padding: '4px 12px',
                            borderRadius: 6,
                            background: 'rgba(10,61,98,0.06)',
                            color: '#0A3D62',
                          }}
                        >
                          {fw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Tax Benefits */}
            {activeTab === 'Tax Benefits' && (
              <div>
                {project.taxBenefits.map((benefit, i) => (
                  <details
                    key={i}
                    style={{
                      background: '#fff',
                      borderRadius: 10,
                      border: '1px solid rgba(10,61,98,0.08)',
                      marginBottom: 10,
                      overflow: 'hidden',
                    }}
                  >
                    <summary
                      style={{
                        padding: '14px 20px',
                        cursor: 'pointer',
                        fontSize: 14,
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        color: '#0A3D62',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        listStyle: 'none',
                      }}
                    >
                      {benefit.flag} {benefit.country}
                    </summary>
                    <div
                      style={{
                        padding: '0 20px 16px',
                        borderTop: '1px solid rgba(10,61,98,0.06)',
                      }}
                    >
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            {['Benefit Type', 'Max Deduction', 'Eligible Types', 'Conditions'].map(
                              h => (
                                <th
                                  key={h}
                                  style={{
                                    textAlign: 'left',
                                    padding: '10px 0',
                                    fontSize: 11,
                                    fontFamily: "'Inter', sans-serif",
                                    fontWeight: 600,
                                    color: '#6B7280',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.06em',
                                    borderBottom: '1px solid rgba(10,61,98,0.06)',
                                  }}
                                >
                                  {h}
                                </th>
                              )
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td
                              style={{
                                padding: '10px 0',
                                fontSize: 13,
                                fontFamily: "'Inter', sans-serif",
                                color: '#1A1F2E',
                              }}
                            >
                              Charitable donation
                            </td>
                            <td
                              style={{
                                padding: '10px 0',
                                fontSize: 13,
                                fontFamily: "'Inter', sans-serif",
                                color: '#1A1F2E',
                              }}
                            >
                              {benefit.description}
                            </td>
                            <td
                              style={{
                                padding: '10px 0',
                                fontSize: 13,
                                fontFamily: "'Inter', sans-serif",
                                color: '#1A1F2E',
                              }}
                            >
                              {project.eligibleFor.join(', ')}
                            </td>
                            <td
                              style={{
                                padding: '10px 0',
                                fontSize: 12,
                                fontFamily: "'Inter', sans-serif",
                                color: '#6B7280',
                              }}
                            >
                              Registered entity required
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </details>
                ))}
                <p
                  style={{
                    fontSize: 12,
                    fontFamily: "'Inter', sans-serif",
                    color: '#6B7280',
                    fontStyle: 'italic',
                    marginTop: 16,
                  }}
                >
                  Tax information is indicative. Consult a qualified tax adviser before structuring
                  donations.
                </p>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#1B7A8A',
                    fontSize: 13,
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    padding: 0,
                    marginTop: 8,
                  }}
                >
                  Which benefits apply to your company? →
                </button>
              </div>
            )}

            {/* Tab: Contact */}
            {activeTab === 'Contact' && (
              <div>
                {user ? (
                  <>
                    {project.contactName && (
                      <div style={{ marginBottom: 20 }}>
                        <p
                          style={{
                            fontSize: 16,
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            color: '#1A1F2E',
                            margin: '0 0 4px',
                          }}
                        >
                          {project.contactName}
                        </p>
                        <p style={{ fontSize: 13, fontFamily: "'Inter', sans-serif", color: '#6B7280', margin: 0 }}>
                          {project.contactRole}
                        </p>
                      </div>
                    )}
                    {project.website && (
                      <div className="flex items-center gap-2 mb-3">
                        <Globe size={14} style={{ color: '#6B7280' }} />
                        <a
                          href={project.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: 13,
                            fontFamily: "'Inter', sans-serif",
                            color: '#1B7A8A',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          {project.website} <ExternalLink size={11} />
                        </a>
                      </div>
                    )}
                    {project.address && (
                      <div className="flex items-start gap-2 mb-6">
                        <MapPin size={14} style={{ color: '#6B7280', marginTop: 2 }} />
                        <p style={{ fontSize: 13, fontFamily: "'Inter', sans-serif", color: '#1A1F2E', margin: 0 }}>
                          {project.address}
                        </p>
                      </div>
                    )}

                    {project.isVerified && (
                      <div
                        style={{
                          background: '#fff',
                          borderRadius: 10,
                          border: '1px solid rgba(10,61,98,0.08)',
                          padding: 20,
                          maxWidth: 480,
                        }}
                      >
                        <h4
                          style={{
                            fontSize: 14,
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            color: '#0A3D62',
                            marginBottom: 16,
                          }}
                        >
                          Send Message
                        </h4>
                        <input
                          type="text"
                          placeholder="Subject"
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            border: '1px solid rgba(10,61,98,0.15)',
                            borderRadius: 8,
                            fontSize: 13,
                            fontFamily: "'Inter', sans-serif",
                            marginBottom: 10,
                            outline: 'none',
                            boxSizing: 'border-box',
                          }}
                        />
                        <textarea
                          placeholder="Your message..."
                          rows={4}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            border: '1px solid rgba(10,61,98,0.15)',
                            borderRadius: 8,
                            fontSize: 13,
                            fontFamily: "'Inter', sans-serif",
                            marginBottom: 12,
                            outline: 'none',
                            resize: 'vertical',
                            boxSizing: 'border-box',
                          }}
                        />
                        <button
                          style={{
                            padding: '10px 24px',
                            background: '#0A3D62',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 8,
                            fontSize: 13,
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Send
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <p
                    style={{
                      fontSize: 14,
                      fontFamily: "'Inter', sans-serif",
                      color: '#6B7280',
                    }}
                  >
                    Sign in to view full contact details.
                  </p>
                )}
              </div>
            )}

            {/* Tab: Documents */}
            {activeTab === 'Documents' && (
              <div>
                {project.isVerified ? (
                  [
                    { name: 'Annual Report 2025', date: '15 Mar 2026', icon: '📄' },
                    { name: 'Impact Report 2024–2025', date: '10 Jan 2026', icon: '📊' },
                    { name: 'Tax Receipt Template (EU)', date: '01 Jan 2026', icon: '🧾' },
                    { name: 'EU Grant Documentation', date: '22 Nov 2025', icon: '📋' },
                  ].map(doc => (
                    <div
                      key={doc.name}
                      className="flex items-center justify-between"
                      style={{
                        background: '#fff',
                        borderRadius: 8,
                        border: '1px solid rgba(10,61,98,0.08)',
                        padding: '14px 20px',
                        marginBottom: 8,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span style={{ fontSize: 18 }}>{doc.icon}</span>
                        <div>
                          <p
                            style={{
                              fontSize: 13,
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 600,
                              color: '#1A1F2E',
                              margin: 0,
                            }}
                          >
                            {doc.name}
                          </p>
                          <p
                            style={{
                              fontSize: 11,
                              fontFamily: "'Inter', sans-serif",
                              color: '#6B7280',
                              margin: 0,
                            }}
                          >
                            {doc.date}
                          </p>
                        </div>
                      </div>
                      <button
                        style={{
                          padding: '6px 14px',
                          border: '1px solid rgba(10,61,98,0.2)',
                          borderRadius: 6,
                          background: 'transparent',
                          color: '#0A3D62',
                          fontSize: 12,
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        Download
                      </button>
                    </div>
                  ))
                ) : (
                  <p
                    style={{
                      fontSize: 13,
                      fontFamily: "'Inter', sans-serif",
                      color: '#6B7280',
                      fontStyle: 'italic',
                    }}
                  >
                    No documents available. Documents are uploaded by verified partners.
                  </p>
                )}
              </div>
            )}

            {/* Tab: Future Plans */}
            {activeTab === 'Future Plans' && (
              <div>
                <h3
                  className="font-display"
                  style={{ fontSize: 24, fontWeight: 400, color: '#0A3D62', marginBottom: 20 }}
                >
                  Active Fundraising Campaigns
                </h3>

                {project.campaigns && project.campaigns.length > 0 ? (
                  project.campaigns.map(campaign => (
                    <div
                      key={campaign.id}
                      style={{
                        background: '#fff',
                        borderRadius: 12,
                        border: '1px solid rgba(10,61,98,0.08)',
                        marginBottom: 20,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: 120,
                          background:
                            'linear-gradient(135deg, rgba(10,61,98,0.08) 0%, rgba(27,122,138,0.12) 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 36,
                        }}
                      >
                        {project.categoryIcon}
                      </div>
                      <div style={{ padding: '20px 24px' }}>
                        <h4
                          style={{
                            fontSize: 16,
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 700,
                            color: '#0A3D62',
                            margin: '0 0 8px',
                          }}
                        >
                          {campaign.title}
                        </h4>
                        <p
                          style={{
                            fontSize: 13,
                            fontFamily: "'Inter', sans-serif",
                            color: '#6B7280',
                            lineHeight: 1.6,
                            marginBottom: 16,
                          }}
                        >
                          {campaign.description}
                        </p>
                        <ProgressBar raised={campaign.raised} goal={campaign.goal} />
                        <p
                          style={{
                            fontSize: 12,
                            fontFamily: "'Inter', sans-serif",
                            color: '#6B7280',
                            marginTop: 8,
                          }}
                        >
                          Campaign closes: {campaign.deadline}
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '12px 0 16px' }}>
                          {campaign.tags.map(tag => (
                            <span
                              key={tag}
                              style={{
                                fontSize: 11,
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 500,
                                padding: '3px 8px',
                                borderRadius: 4,
                                background: 'rgba(10,61,98,0.06)',
                                color: '#0A3D62',
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <button
                          style={{
                            padding: '11px 28px',
                            background: project.isVerified ? '#1B7A8A' : '#e5e7eb',
                            color: project.isVerified ? '#fff' : '#9ca3af',
                            border: 'none',
                            borderRadius: 8,
                            fontSize: 14,
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            cursor: project.isVerified ? 'pointer' : 'not-allowed',
                          }}
                          title={project.isVerified ? undefined : 'Coming soon — available for verified partners'}
                        >
                          Donate Now
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p
                    style={{
                      fontSize: 13,
                      fontFamily: "'Inter', sans-serif",
                      color: '#6B7280',
                    }}
                  >
                    No active fundraising campaigns at this time.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside
            style={{
              width: 280,
              flexShrink: 0,
              position: 'sticky',
              top: 88,
            }}
          >
            <div
              style={{
                background: '#fff',
                borderRadius: 16,
                border: '1px solid rgba(10,61,98,0.08)',
                padding: 24,
                boxShadow: '0 4px 16px rgba(10,61,98,0.06)',
                marginBottom: 12,
              }}
            >
              <h3
                style={{
                  fontSize: 13,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  color: '#0A3D62',
                  marginBottom: 16,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Quick Summary
              </h3>

              {[
                {
                  label: 'Status',
                  value: project.isVerified ? (
                    <span
                      style={{
                        fontSize: 11,
                        fontFamily: "'Inter', sans-serif",
                        padding: '2px 8px',
                        borderRadius: 9999,
                        background: 'rgba(46,125,82,0.1)',
                        color: '#2E7D52',
                        fontWeight: 600,
                      }}
                    >
                      ✓ Verified
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: 11,
                        fontFamily: "'Inter', sans-serif",
                        padding: '2px 8px',
                        borderRadius: 9999,
                        border: '1px solid #d1d5db',
                        color: '#6B7280',
                      }}
                    >
                      ◦ Public Data
                    </span>
                  ),
                },
                { label: 'Founded', value: project.founded ?? 'N/A' },
                { label: 'HQ Country', value: project.hqCountry ?? 'N/A' },
                { label: 'Registered NGO', value: project.isVerified ? 'Yes' : 'Unconfirmed' },
                { label: 'EU Registered', value: project.isVerified ? 'Yes' : 'Unconfirmed' },
              ].map(row => (
                <div
                  key={row.label}
                  className="flex items-center justify-between"
                  style={{
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(10,61,98,0.06)',
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontFamily: "'Inter', sans-serif",
                      color: '#6B7280',
                    }}
                  >
                    {row.label}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontFamily: "'Inter', sans-serif",
                      color: '#1A1F2E',
                      fontWeight: 500,
                    }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}

              <div style={{ margin: '16px 0', borderTop: '1px solid rgba(10,61,98,0.08)' }} />

              <p
                style={{
                  fontSize: 11,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  color: '#1B7A8A',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: 8,
                }}
              >
                Tax Eligibility for Your Company
              </p>
              {project.taxBenefits.slice(0, 3).map(b => (
                <p
                  key={b.country}
                  style={{
                    fontSize: 12,
                    fontFamily: "'Inter', sans-serif",
                    color: '#1A1F2E',
                    marginBottom: 4,
                    lineHeight: 1.4,
                  }}
                >
                  {b.flag} {b.country}: {b.description}
                </p>
              ))}

              <div style={{ margin: '16px 0', borderTop: '1px solid rgba(10,61,98,0.08)' }} />

              <button
                style={{
                  width: '100%',
                  padding: '11px 0',
                  background: project.isVerified ? '#0A3D62' : '#e5e7eb',
                  color: project.isVerified ? '#fff' : '#9ca3af',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 13,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  cursor: project.isVerified ? 'pointer' : 'not-allowed',
                  marginBottom: 8,
                }}
                title={
                  project.isVerified ? undefined : 'Available for Verified Partners only'
                }
              >
                Donate via Lazarev
              </button>

              <button
                onClick={() => (user ? toggleSaveProject(project.id) : null)}
                style={{
                  width: '100%',
                  padding: '10px 0',
                  border: '1px solid #1B7A8A',
                  borderRadius: 8,
                  background: isSaved ? '#1B7A8A' : 'transparent',
                  color: isSaved ? '#fff' : '#1B7A8A',
                  fontSize: 13,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginBottom: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  transition: 'all 150ms',
                }}
              >
                <Bookmark size={13} fill={isSaved ? '#fff' : 'none'} />
                {isSaved ? 'Saved' : 'Save Organisation'}
              </button>

              <button
                style={{
                  width: '100%',
                  padding: '10px 0',
                  border: '1px solid rgba(10,61,98,0.15)',
                  borderRadius: 8,
                  background: 'transparent',
                  color: '#6B7280',
                  fontSize: 13,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <Share2 size={13} />
                Share Profile
              </button>
            </div>

            <p
              style={{
                fontSize: 11,
                fontFamily: "'Inter', sans-serif",
                color: '#6B7280',
                textAlign: 'center',
              }}
            >
              Profile last updated: 12 May 2026 · Data source: Verified registration
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
