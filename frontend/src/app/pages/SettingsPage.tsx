import { useState } from 'react';
import { Link } from 'react-router';
import { Anchor } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { industries, euCountries, operationalZones } from '../data/mockData';

const settingsTabs = [
  'Company Profile',
  'Notifications',
  'Billing',
  'API Access',
  'Security',
];

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid rgba(10,61,98,0.15)',
  borderRadius: 8,
  fontSize: 14,
  fontFamily: "'Inter', sans-serif",
  color: '#1A1F2E',
  background: '#fff',
  outline: 'none',
  boxSizing: 'border-box',
};

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      style={{
        display: 'block',
        fontSize: 13,
        fontFamily: "'Inter', sans-serif",
        fontWeight: 500,
        color: '#1A1F2E',
        marginBottom: 6,
      }}
    >
      {children}
    </label>
  );
}

function NotificationRow({ label, description }: { label: string; description: string }) {
  const [on, setOn] = useState(true);
  return (
    <div
      className="flex items-center justify-between"
      style={{
        padding: '16px 0',
        borderBottom: '1px solid rgba(10,61,98,0.06)',
      }}
    >
      <div>
        <p style={{ fontSize: 14, fontFamily: "'Inter', sans-serif", fontWeight: 500, color: '#1A1F2E', margin: 0 }}>
          {label}
        </p>
        <p style={{ fontSize: 12, fontFamily: "'Inter', sans-serif", color: '#6B7280', margin: '2px 0 0' }}>
          {description}
        </p>
      </div>
      <button
        onClick={() => setOn(v => !v)}
        style={{
          width: 40,
          height: 22,
          borderRadius: 11,
          background: on ? '#0A3D62' : '#d1d5db',
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          transition: 'background 150ms',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 3,
            left: on ? 21 : 3,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#fff',
            transition: 'left 150ms',
          }}
        />
      </button>
    </div>
  );
}

export function SettingsPage() {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState('Company Profile');
  const [saved, setSaved] = useState(false);
  const [selectedZones, setSelectedZones] = useState<string[]>(user?.zones ?? []);

  const toggleZone = (z: string) =>
    setSelectedZones(p => (p.includes(z) ? p.filter(x => x !== z) : [...p, z]));

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
        <p style={{ fontSize: 16 }}>Please log in to access settings.</p>
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

  return (
    <div style={{ background: '#F7F9FC', minHeight: '100vh' }}>
      <div
        style={{
          background: '#fff',
          borderBottom: '1px solid rgba(10,61,98,0.08)',
          padding: '32px 32px 0',
        }}
      >
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h1
            className="font-display"
            style={{ fontSize: 30, fontWeight: 400, color: '#0A3D62', marginBottom: 24 }}
          >
            Settings
          </h1>
          <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid rgba(10,61,98,0.08)' }}>
            {settingsTabs.map(tab => (
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
                  transition: 'all 200ms',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 32px 64px' }}>
        {activeTab === 'Company Profile' && (
          <div style={{ maxWidth: 640 }}>
            <h2
              style={{
                fontSize: 18,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                color: '#0A3D62',
                marginBottom: 24,
              }}
            >
              Company Profile
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <FieldLabel htmlFor="s-name">Official Company Name</FieldLabel>
                <input id="s-name" type="text" defaultValue={user.company} style={inputStyle} onFocus={e => ((e.currentTarget as HTMLElement).style.borderColor = '#0A3D62')} onBlur={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(10,61,98,0.15)')} />
              </div>
              <div>
                <FieldLabel htmlFor="s-email">Business Email</FieldLabel>
                <input id="s-email" type="email" defaultValue={user.email} style={inputStyle} onFocus={e => ((e.currentTarget as HTMLElement).style.borderColor = '#0A3D62')} onBlur={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(10,61,98,0.15)')} />
              </div>
              <div>
                <FieldLabel htmlFor="s-country">Country of Registration</FieldLabel>
                <select id="s-country" defaultValue={user.country} style={{ ...inputStyle, cursor: 'pointer' }}>
                  {euCountries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <FieldLabel htmlFor="s-industry">Industry</FieldLabel>
                <select id="s-industry" defaultValue={user.sector} style={{ ...inputStyle, cursor: 'pointer' }}>
                  {industries.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <FieldLabel htmlFor="s-zones">Operational Zones</FieldLabel>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {operationalZones.map(z => {
                  const active = selectedZones.includes(z);
                  return (
                    <button
                      key={z}
                      type="button"
                      onClick={() => toggleZone(z)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: 9999,
                        border: `1px solid ${active ? '#0A3D62' : 'rgba(10,61,98,0.2)'}`,
                        background: active ? '#0A3D62' : '#fff',
                        color: active ? '#fff' : '#0A3D62',
                        fontSize: 12,
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 150ms',
                      }}
                    >
                      {z}
                    </button>
                  );
                })}
              </div>
            </div>

            {saved && (
              <div
                style={{
                  padding: '10px 16px',
                  background: 'rgba(46,125,82,0.08)',
                  border: '1px solid rgba(46,125,82,0.2)',
                  borderRadius: 8,
                  fontSize: 13,
                  fontFamily: "'Inter', sans-serif",
                  color: '#2E7D52',
                  marginBottom: 16,
                }}
              >
                ✓ Changes saved successfully.
              </div>
            )}

            <button
              onClick={() => {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
              }}
              style={{
                padding: '11px 28px',
                background: '#0A3D62',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 150ms',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#1B7A8A')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#0A3D62')}
            >
              Save Changes
            </button>

            {/* Verification status */}
            <div
              style={{
                marginTop: 40,
                padding: 20,
                background: '#fff',
                borderRadius: 12,
                border: '1px solid rgba(10,61,98,0.08)',
              }}
            >
              <h3
                style={{
                  fontSize: 14,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  color: '#0A3D62',
                  marginBottom: 8,
                }}
              >
                Verification Status
              </h3>
              <p style={{ fontSize: 13, fontFamily: "'Inter', sans-serif", color: '#6B7280', marginBottom: 12 }}>
                Upload your company registration document to become a verified partner and unlock
                full platform features.
              </p>
              <button
                style={{
                  padding: '9px 20px',
                  border: '1px solid #1B7A8A',
                  borderRadius: 8,
                  background: 'transparent',
                  color: '#1B7A8A',
                  fontSize: 13,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Upload Document
              </button>
            </div>
          </div>
        )}

        {activeTab === 'Notifications' && (
          <div style={{ maxWidth: 560 }}>
            <h2 style={{ fontSize: 18, fontFamily: "'Inter', sans-serif", fontWeight: 600, color: '#0A3D62', marginBottom: 24 }}>
              Notification Preferences
            </h2>
            <NotificationRow label="New project matches" description="When new organisations match your operational profile" />
            <NotificationRow label="Campaign updates" description="Progress updates on saved fundraising campaigns" />
            <NotificationRow label="Legal &amp; regulatory alerts" description="New EU directives and national regulations relevant to your sector" />
            <NotificationRow label="Tax benefit changes" description="When tax deduction rules are updated in your registered jurisdictions" />
            <NotificationRow label="Weekly digest" description="Summary of your saved organisations and platform activity" />
          </div>
        )}

        {activeTab === 'Billing' && (
          <div style={{ maxWidth: 560 }}>
            <h2 style={{ fontSize: 18, fontFamily: "'Inter', sans-serif", fontWeight: 600, color: '#0A3D62', marginBottom: 8 }}>
              Billing
            </h2>
            <p style={{ fontSize: 14, fontFamily: "'Inter', sans-serif", color: '#6B7280', marginBottom: 24 }}>
              You are currently on the <strong style={{ color: '#0A3D62' }}>Free plan</strong>.
            </p>
            <div
              style={{
                background: 'linear-gradient(135deg, #0A3D62 0%, #1B7A8A 100%)',
                borderRadius: 12,
                padding: 24,
                color: '#fff',
                marginBottom: 20,
              }}
            >
              <p style={{ fontSize: 12, fontFamily: "'Inter', sans-serif", opacity: 0.7, marginBottom: 4 }}>
                PRO PLAN
              </p>
              <p style={{ fontSize: 24, fontFamily: "'Instrument Serif', Georgia, serif", marginBottom: 8 }}>
                €149 / month
              </p>
              <p style={{ fontSize: 13, fontFamily: "'Inter', sans-serif", opacity: 0.8, marginBottom: 16, lineHeight: 1.5 }}>
                Unlimited saved projects · Full contact access · API access ·
                Tax benefit reports · Priority support
              </p>
              <button
                style={{
                  padding: '10px 24px',
                  background: '#fff',
                  color: '#0A3D62',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 13,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        )}

        {activeTab === 'API Access' && (
          <div style={{ maxWidth: 560 }}>
            <h2 style={{ fontSize: 18, fontFamily: "'Inter', sans-serif", fontWeight: 600, color: '#0A3D62', marginBottom: 8 }}>
              API Access
            </h2>
            <p style={{ fontSize: 14, fontFamily: "'Inter', sans-serif", color: '#6B7280', marginBottom: 20 }}>
              API access is available on the Pro plan. Integrate Lazarev data directly into your
              ESG reporting workflows.
            </p>
            <div
              style={{
                background: '#fff',
                borderRadius: 10,
                border: '1px solid rgba(10,61,98,0.08)',
                padding: '16px 20px',
              }}
            >
              <p style={{ fontSize: 13, fontFamily: "'Inter', sans-serif", color: '#6B7280', margin: 0 }}>
                API key: <span style={{ fontFamily: 'monospace', color: '#9ca3af', letterSpacing: '0.05em' }}>
                  Upgrade to Pro to generate your API key
                </span>
              </p>
            </div>
          </div>
        )}

        {activeTab === 'Security' && (
          <div style={{ maxWidth: 480 }}>
            <h2 style={{ fontSize: 18, fontFamily: "'Inter', sans-serif", fontWeight: 600, color: '#0A3D62', marginBottom: 24 }}>
              Security
            </h2>
            <div style={{ marginBottom: 20 }}>
              <FieldLabel htmlFor="s-curr-pwd">Current Password</FieldLabel>
              <input id="s-curr-pwd" type="password" placeholder="••••••••" style={inputStyle} onFocus={e => ((e.currentTarget as HTMLElement).style.borderColor = '#0A3D62')} onBlur={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(10,61,98,0.15)')} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <FieldLabel htmlFor="s-new-pwd">New Password</FieldLabel>
              <input id="s-new-pwd" type="password" placeholder="••••••••" style={inputStyle} onFocus={e => ((e.currentTarget as HTMLElement).style.borderColor = '#0A3D62')} onBlur={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(10,61,98,0.15)')} />
            </div>
            <button
              style={{
                padding: '11px 28px',
                background: '#0A3D62',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Update Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
