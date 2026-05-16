/**
 * HOMEPAGE COMPONENT
 *
 * Main landing page with:
 * 1. Company search form (for finding relevant ESG projects)
 * 2. Project recommendations based on company profile
 *
 * BACKEND INTEGRATION REQUIREMENTS:
 * ==================================
 *
 * 1. COMPANY PROFILE FORM:
 *    - When user fills out the form and clicks "Analyse My Company"
 *    - POST to /api/companies/analyze with form data
 *    - Return list of matching projects based on:
 *      * Company country
 *      * Industry sector
 *      * Operational zones
 *      * Fleet size
 *      * Budget range
 *
 * 2. AUTHENTICATED USER EXPERIENCE:
 *    - If user is logged in, pre-fill form with their saved company data
 *    - GET /api/users/:userId/company-profile
 *
 * 3. PROJECT RECOMMENDATIONS:
 *    - After analysis, show filtered project list
 *    - GET /api/projects?country=SI&sector=Maritime&zone=Adriatic
 *    - Support pagination if many results
 *
 * 4. PROJECT FILTERING:
 *    - Allow filtering by category (Seagrass, Reef Restoration, etc.)
 *    - Filter should work client-side on already-loaded projects
 *    - Or make new API call: GET /api/projects?category=Seagrass
 *
 * FLOW:
 * 1. User lands on page → sees search form
 * 2. User fills company details → clicks "Analyse"
 * 3. Backend returns matching projects
 * 4. Display project cards with filtering option
 */

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProjectCard } from '../components/lazarev/ProjectCard';
import { mockProjects, filterCategories, operationalZones, industries, euCountries } from '../data/mockData';
import { Search } from 'lucide-react';

// BACKEND TODO: Load these from API instead of hardcoding
const budgetRanges = ['<10K', '10K–50K', '50K–200K', '200K+', 'Not defined'];
const fleetSizes = ['1–10 employees', '11–50', '51–200', '200+', 'N/A'];

/**
 * CHIP SELECT COMPONENT
 *
 * Reusable multi-select component for tags/categories.
 * Used for selecting operational zones, industries, etc.
 */
function ChipSelect({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {options.map(opt => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
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
            {opt}
          </button>
        );
      })}
    </div>
  );
}

/**
 * INPUT FIELD COMPONENT
 *
 * Reusable form field with label. Used throughout the company search form.
 */
function InputField({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        style={{
          display: 'block',
          fontSize: 13,
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
          color: '#1A1F2E',
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

// Shared input styling for consistency
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
  appearance: 'none',
  boxSizing: 'border-box',
};

/**
 * MAIN HOMEPAGE COMPONENT
 */
export function HomePage() {
  const { user } = useApp(); // Get current user from global context

  // Filter state for project category filtering
  const [activeFilter, setActiveFilter] = useState('All');

  // Selected operational zones (from search form)
  const [zones, setZones] = useState<string[]>([]);

  // Whether analysis has been performed
  // BACKEND TODO: Set to false initially, set to true after receiving API response
  const [analysed, setAnalysed] = useState(true);

  /**
   * Toggle operational zone selection
   * BACKEND NOTE: This data will be sent to the backend when user clicks "Analyse My Company"
   */
  const toggleZone = (z: string) =>
    setZones(prev => (prev.includes(z) ? prev.filter(x => x !== z) : [...prev, z]));

  /**
   * FILTER PROJECTS BY CATEGORY
   *
   * BACKEND TODO: Replace with API call when filter changes
   * GET /api/projects?category=${activeFilter}
   *
   * Or keep client-side filtering if all projects are already loaded
   */
  const filteredProjects =
    activeFilter === 'All'
      ? mockProjects
      : mockProjects.filter(p => p.category === activeFilter);

  return (
    <div style={{ background: '#F7F9FC', minHeight: '100vh' }}>
      {/* Hero */}
      <section
        style={{
          position: 'relative',
          minHeight: 520,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '80px 32px 64px',
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(10,61,98,0.07) 0%, transparent 70%), #F7F9FC',
          overflow: 'hidden',
        }}
      >
        {/* Subtle topographic texture */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.03,
            pointerEvents: 'none',
          }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 800 520"
          preserveAspectRatio="xMidYMid slice"
        >
          {[40, 80, 120, 160, 200, 240, 280, 320].map((r, i) => (
            <ellipse
              key={i}
              cx="400"
              cy="260"
              rx={r * 3}
              ry={r * 1.3}
              fill="none"
              stroke="#0A3D62"
              strokeWidth="1"
            />
          ))}
        </svg>

        {user ? (
          <>
            <h1
              className="font-display"
              style={{
                fontSize: 40,
                fontWeight: 400,
                color: '#0A3D62',
                textAlign: 'center',
                maxWidth: 680,
                margin: '0 auto 16px',
                lineHeight: 1.2,
              }}
            >
              Welcome back, {user.company}
            </h1>
            <p
              style={{
                fontSize: 18,
                fontFamily: "'Inter', sans-serif",
                color: '#6B7280',
                textAlign: 'center',
                maxWidth: 560,
                margin: '0 auto 48px',
                lineHeight: 1.6,
              }}
            >
              3 new projects match your {user.zones[0]} operational zone this week.
            </p>
          </>
        ) : (
          <>
            <h1
              className="font-display"
              style={{
                fontSize: 52,
                fontWeight: 400,
                color: '#0A3D62',
                textAlign: 'center',
                maxWidth: 680,
                margin: '0 auto 16px',
                lineHeight: 1.15,
              }}
            >
              Find maritime tax incentives. Fund ocean ecosystems.
            </h1>
            <p
              style={{
                fontSize: 18,
                fontFamily: "'Inter', sans-serif",
                color: '#6B7280',
                textAlign: 'center',
                maxWidth: 560,
                margin: '0 auto 48px',
                lineHeight: 1.6,
              }}
            >
              Lazarev matches your company's maritime operations with EU-compliant marine
              projects and surfaces available tax benefits across jurisdictions.
            </p>
          </>
        )}

        {/* Search panel */}
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 4px 24px rgba(10,61,98,0.1)',
            padding: 32,
            maxWidth: 780,
            width: '100%',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {user ? (
            <div className="flex items-center justify-between mb-4">
              <p
                style={{
                  fontSize: 16,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  color: '#0A3D62',
                  margin: 0,
                }}
              >
                {user.company} — Company Profile
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
                }}
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <p
              style={{
                fontSize: 16,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                color: '#0A3D62',
                marginBottom: 20,
              }}
            >
              Tell us about your company
            </p>
          )}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              marginBottom: 16,
            }}
          >
            <InputField label="Company Name" id="company-name">
              <input
                id="company-name"
                type="text"
                placeholder="e.g. Adria Shipping d.o.o."
                defaultValue={user?.company}
                style={inputStyle}
                onFocus={e =>
                  ((e.currentTarget as HTMLElement).style.borderColor = '#0A3D62')
                }
                onBlur={e =>
                  ((e.currentTarget as HTMLElement).style.borderColor =
                    'rgba(10,61,98,0.15)')
                }
              />
            </InputField>

            <InputField label="Country of Registration" id="country">
              <select
                id="country"
                defaultValue={user?.country ?? ''}
                style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={e =>
                  ((e.currentTarget as HTMLElement).style.borderColor = '#0A3D62')
                }
                onBlur={e =>
                  ((e.currentTarget as HTMLElement).style.borderColor =
                    'rgba(10,61,98,0.15)')
                }
              >
                <option value="" disabled>
                  Select country
                </option>
                {euCountries.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </InputField>

            <InputField label="Industry / Sector" id="industry">
              <select
                id="industry"
                defaultValue={user?.sector ?? ''}
                style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={e =>
                  ((e.currentTarget as HTMLElement).style.borderColor = '#0A3D62')
                }
                onBlur={e =>
                  ((e.currentTarget as HTMLElement).style.borderColor =
                    'rgba(10,61,98,0.15)')
                }
              >
                <option value="" disabled>
                  Select industry
                </option>
                {industries.map(i => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </InputField>

            <InputField label="Annual CSR / ESG Budget (EUR)" id="budget">
              <select
                id="budget"
                defaultValue=""
                style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={e =>
                  ((e.currentTarget as HTMLElement).style.borderColor = '#0A3D62')
                }
                onBlur={e =>
                  ((e.currentTarget as HTMLElement).style.borderColor =
                    'rgba(10,61,98,0.15)')
                }
              >
                <option value="" disabled>
                  Select range
                </option>
                {budgetRanges.map(r => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </InputField>

            <InputField label="Fleet Size / Company Scale" id="fleet">
              <select
                id="fleet"
                defaultValue=""
                style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={e =>
                  ((e.currentTarget as HTMLElement).style.borderColor = '#0A3D62')
                }
                onBlur={e =>
                  ((e.currentTarget as HTMLElement).style.borderColor =
                    'rgba(10,61,98,0.15)')
                }
              >
                <option value="" disabled>
                  Select scale
                </option>
                {fleetSizes.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </InputField>

            <InputField label="Operational Zone" id="zones">
              <div style={{ marginTop: 2 }}>
                <ChipSelect
                  options={operationalZones}
                  selected={zones.length ? zones : user?.zones ?? []}
                  onToggle={toggleZone}
                />
              </div>
            </InputField>
          </div>

          <button
            onClick={() => setAnalysed(true)}
            style={{
              width: '100%',
              height: 56,
              background: '#0A3D62',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              fontSize: 16,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 150ms',
              marginBottom: 12,
            }}
            onMouseEnter={e =>
              ((e.currentTarget as HTMLElement).style.background = '#1B7A8A')
            }
            onMouseLeave={e =>
              ((e.currentTarget as HTMLElement).style.background = '#0A3D62')
            }
          >
            Analyse My Company →
          </button>
          <p
            style={{
              fontSize: 12,
              fontFamily: "'Inter', sans-serif",
              color: '#6B7280',
              textAlign: 'center',
            }}
          >
            By continuing you agree to our Terms. Business email domain required for
            registration.
          </p>
        </div>
      </section>

      {/* Recommendations */}
      {analysed && (
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 32px' }}>
          <h2
            className="font-display"
            style={{
              fontSize: 32,
              fontWeight: 400,
              color: '#0A3D62',
              margin: '0 0 6px',
            }}
          >
            Recommendations
          </h2>
          <p
            style={{
              fontSize: 15,
              fontFamily: "'Inter', sans-serif",
              color: '#6B7280',
              marginBottom: 24,
            }}
          >
            Marine projects and organisations matching your operational profile
          </p>

          {/* Filter chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
            {filterCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                style={{
                  padding: '6px 16px',
                  borderRadius: 9999,
                  border: `1px solid ${activeFilter === cat ? '#0A3D62' : 'rgba(10,61,98,0.2)'}`,
                  background: activeFilter === cat ? '#0A3D62' : '#fff',
                  color: activeFilter === cat ? '#fff' : '#0A3D62',
                  fontSize: 13,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 150ms',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Card grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 20,
            }}
          >
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
