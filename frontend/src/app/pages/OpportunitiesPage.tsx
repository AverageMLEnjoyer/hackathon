/**
 * OPPORTUNITIES PAGE
 *
 * Displays a browsable, filterable list of maritime ESG projects and organizations.
 *
 * FEATURES:
 * - Browse all available projects
 * - Filter by category, operational zone, and status
 * - Sort by relevance, date, tax benefit value, or funding goal
 * - Bookmark/save projects for later
 * - Pagination support
 *
 * BACKEND INTEGRATION REQUIREMENTS:
 * ==================================
 *
 * 1. LOAD PROJECTS:
 *    GET /api/projects?page=1&limit=6
 *    Response: {
 *      projects: Project[],
 *      totalCount: number,
 *      page: number,
 *      totalPages: number
 *    }
 *
 * 2. APPLY FILTERS:
 *    GET /api/projects?category=Seagrass&zone=Adriatic&verified=true
 *    - Support multiple filters simultaneously
 *    - Filter options: category, zone, verified, taxBenefits, activeFundraising, euTaxonomy
 *
 * 3. SORTING:
 *    GET /api/projects?sort=relevance|newest|taxBenefit|fundraising
 *    - Most Relevant: Based on user profile/preferences
 *    - Newest: By creation date (desc)
 *    - Tax Benefit Value: By total tax benefit amount
 *    - Fundraising Goal: By active campaign goal amount
 *
 * 4. PAGINATION:
 *    - 6 projects per page
 *    - Include page number in URL query: /opportunities?page=2
 *    - Update URL when user changes page
 *
 * 5. FILTER COUNTS:
 *    - Show count of results for each filter option
 *    - Example: "Seagrass (12)" if 12 projects match
 *
 * PERFORMANCE:
 * - Cache filter options (categories, zones) as they rarely change
 * - Implement server-side pagination to avoid loading all projects
 * - Add loading skeleton while fetching data
 */

import { useState } from 'react';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import { ProjectCard } from '../components/lazarev/ProjectCard';
import { mockProjects, filterCategories, operationalZones } from '../data/mockData';

// BACKEND TODO: Could make this configurable from admin panel
const sortOptions = [
  'Most Relevant',
  'Newest',
  'Tax Benefit Value',
  'Fundraising Goal',
];

/**
 * FILTER CHECKBOX COMPONENT
 * Reusable checkbox for sidebar filters
 */
function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        cursor: 'pointer',
        fontSize: 13,
        fontFamily: "'Inter', sans-serif",
        color: '#1A1F2E',
        padding: '3px 0',
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ accentColor: '#0A3D62', width: 14, height: 14, cursor: 'pointer' }}
      />
      {label}
    </label>
  );
}

/**
 * FILTER TOGGLE COMPONENT
 * iOS-style toggle switch for boolean filters
 */
function FilterToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between" style={{ padding: '3px 0' }}>
      <span
        style={{
          fontSize: 13,
          fontFamily: "'Inter', sans-serif",
          color: '#1A1F2E',
        }}
      >
        {label}
      </span>
      <button
        onClick={onChange}
        style={{
          width: 36,
          height: 20,
          borderRadius: 10,
          background: checked ? '#0A3D62' : '#d1d5db',
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
            top: 2,
            left: checked ? 18 : 2,
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

/**
 * FILTER SECTION COMPONENT
 * Collapsible section in the filter sidebar
 */
function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ paddingBottom: 20, marginBottom: 20, borderBottom: '1px solid rgba(10,61,98,0.06)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          marginBottom: open ? 12 : 0,
          padding: 0,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            color: '#0A3D62',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {title}
        </span>
        <ChevronDown
          size={14}
          style={{
            color: '#6B7280',
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 200ms',
          }}
        />
      </button>
      {open && children}
    </div>
  );
}

export function OpportunitiesPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [taxBenefitOnly, setTaxBenefitOnly] = useState(false);
  const [euTaxonomyOnly, setEuTaxonomyOnly] = useState(false);
  const [activeFundraisingOnly, setActiveFundraisingOnly] = useState(false);
  const [sortBy, setSortBy] = useState('Most Relevant');
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleCategory = (cat: string) =>
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );

  const toggleZone = (zone: string) =>
    setSelectedZones(prev =>
      prev.includes(zone) ? prev.filter(z => z !== zone) : [...prev, zone]
    );

  const filtered = mockProjects.filter(p => {
    if (selectedCategories.length && !selectedCategories.includes(p.category)) return false;
    if (selectedZones.length && !p.zones.some(z => selectedZones.includes(z))) return false;
    if (verifiedOnly && !p.isVerified) return false;
    if (taxBenefitOnly && p.taxBenefits.length === 0) return false;
    if (activeFundraisingOnly && (!p.campaigns || p.campaigns.length === 0)) return false;
    if (
      euTaxonomyOnly &&
      !p.euFrameworks?.some(f => f.includes('Taxonomy'))
    )
      return false;
    return true;
  });

  const perPage = 6;
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div style={{ background: '#F7F9FC', minHeight: '100vh' }}>
      {/* Page header */}
      <div
        style={{
          background: '#fff',
          borderBottom: '1px solid rgba(10,61,98,0.08)',
          padding: '40px 32px 28px',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1
                className="font-display"
                style={{ fontSize: 36, fontWeight: 400, color: '#0A3D62', margin: '0 0 6px' }}
              >
                Marine Project Opportunities
              </h1>
              <p
                style={{
                  fontSize: 15,
                  fontFamily: "'Inter', sans-serif",
                  color: '#6B7280',
                  margin: 0,
                }}
              >
                {filtered.length} organisation{filtered.length !== 1 ? 's' : ''} matching your criteria
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(o => !o)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 14px',
                  border: '1px solid rgba(10,61,98,0.15)',
                  borderRadius: 8,
                  background: sidebarOpen ? '#0A3D62' : '#fff',
                  color: sidebarOpen ? '#fff' : '#0A3D62',
                  fontSize: 13,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 150ms',
                }}
              >
                <SlidersHorizontal size={14} />
                Filters
              </button>

              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid rgba(10,61,98,0.15)',
                  borderRadius: 8,
                  fontSize: 13,
                  fontFamily: "'Inter', sans-serif",
                  color: '#0A3D62',
                  background: '#fff',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                {sortOptions.map(opt => (
                  <option key={opt} value={opt}>
                    Sort: {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 32px 64px' }}>
        <div className="flex gap-8 items-start">
          {/* Filter sidebar */}
          {sidebarOpen && (
            <aside
              style={{
                width: 240,
                flexShrink: 0,
                background: '#fff',
                borderRadius: 12,
                border: '1px solid rgba(10,61,98,0.08)',
                padding: '20px 20px 4px',
                position: 'sticky',
                top: 88,
              }}
            >
              <FilterSection title="Category">
                {filterCategories
                  .filter(c => c !== 'All')
                  .map(cat => (
                    <FilterCheckbox
                      key={cat}
                      label={cat}
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                    />
                  ))}
              </FilterSection>

              <FilterSection title="Operational Zone">
                {operationalZones.map(zone => (
                  <FilterCheckbox
                    key={zone}
                    label={zone}
                    checked={selectedZones.includes(zone)}
                    onChange={() => toggleZone(zone)}
                  />
                ))}
              </FilterSection>

              <FilterSection title="Status">
                <FilterToggle
                  label="Verified Partners only"
                  checked={verifiedOnly}
                  onChange={() => setVerifiedOnly(v => !v)}
                />
              </FilterSection>

              <FilterSection title="Features">
                <FilterToggle
                  label="Tax Benefit Available"
                  checked={taxBenefitOnly}
                  onChange={() => setTaxBenefitOnly(v => !v)}
                />
                <div style={{ marginTop: 6 }}>
                  <FilterToggle
                    label="EU Taxonomy Eligible"
                    checked={euTaxonomyOnly}
                    onChange={() => setEuTaxonomyOnly(v => !v)}
                  />
                </div>
                <div style={{ marginTop: 6 }}>
                  <FilterToggle
                    label="Active Fundraising"
                    checked={activeFundraisingOnly}
                    onChange={() => setActiveFundraisingOnly(v => !v)}
                  />
                </div>
              </FilterSection>

              {(selectedCategories.length > 0 ||
                selectedZones.length > 0 ||
                verifiedOnly ||
                taxBenefitOnly ||
                euTaxonomyOnly ||
                activeFundraisingOnly) && (
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedZones([]);
                    setVerifiedOnly(false);
                    setTaxBenefitOnly(false);
                    setEuTaxonomyOnly(false);
                    setActiveFundraisingOnly(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 0',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#1B7A8A',
                    fontSize: 13,
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    marginBottom: 16,
                  }}
                >
                  Clear all filters
                </button>
              )}
            </aside>
          )}

          {/* Card grid */}
          <div style={{ flex: 1 }}>
            {paginated.length === 0 ? (
              <div
                style={{
                  background: '#fff',
                  borderRadius: 12,
                  border: '1px solid rgba(10,61,98,0.08)',
                  padding: '64px 24px',
                  textAlign: 'center',
                  color: '#6B7280',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                No projects match your current filters. Try removing some criteria.
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 20,
                  marginBottom: 32,
                }}
              >
                {paginated.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      border: `1px solid ${p === page ? '#0A3D62' : 'rgba(10,61,98,0.15)'}`,
                      background: p === page ? '#0A3D62' : '#fff',
                      color: p === page ? '#fff' : '#0A3D62',
                      fontSize: 13,
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 150ms',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
