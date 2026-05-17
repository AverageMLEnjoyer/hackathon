/**
 * LEGAL SEARCH PAGE
 *
 * Allows users to search through maritime legal documents, regulations, and conventions.
 *
 * FEATURES:
 * - Full-text search across document titles and excerpts
 * - Filter by document type (Tax Law, EU Directive, etc.)
 * - Filter by jurisdiction (EU, specific countries, international)
 * - Bookmark documents for later reference
 * - Highlight search terms in results
 *
 * BACKEND INTEGRATION REQUIREMENTS:
 * ==================================
 *
 * 1. SEARCH FUNCTIONALITY:
 *    POST /api/legal/search
 *    Body: {
 *      query: string,           // Search query text
 *      type: string,            // Document type filter
 *      jurisdiction: string,    // Jurisdiction filter
 *      page: number,            // For pagination
 *      limit: number            // Results per page
 *    }
 *    Response: {
 *      results: LegalResult[],
 *      totalCount: number,
 *      page: number,
 *      totalPages: number
 *    }
 *
 * 2. SEARCH IMPLEMENTATION:
 *    - Use full-text search on title and excerpt fields
 *    - Apply filters for type and jurisdiction
 *    - Return paginated results (suggest 20 per page)
 *    - Calculate relevance scores for ranking
 *
 * 3. BOOKMARK FUNCTIONALITY:
 *    - When user clicks bookmark icon: POST /api/bookmarks/legal
 *    - Body: { documentId: string, userId: string }
 *    - Update isBookmarked status for current user
 *
 * 4. FILTER OPTIONS:
 *    - Load document types from: GET /api/legal/types
 *    - Load jurisdictions from: GET /api/legal/jurisdictions
 *    - Keep in sync with actual data in database
 *
 * PERFORMANCE NOTES:
 * - Implement search debouncing (wait 300ms after user stops typing)
 * - Cache search results for common queries
 * - Use database indexes on title, excerpt, type, jurisdiction fields
 */

import { useState } from 'react';
import { Search, Bookmark, ExternalLink } from 'lucide-react';
import { mockLegalResults, type LegalResult } from '../data/mockData';
import { useApp } from '../context/AppContext';

// BACKEND TODO: Load these from API instead of hardcoding
// GET /api/legal/types and GET /api/legal/jurisdictions
const docTypes = ['All', 'Tax Law', 'Environmental Regulation', 'Maritime Convention', 'EU Directive', 'National Code'];
const jurisdictions = ['All', 'European Union', 'Slovenia', 'Croatia', 'Denmark', 'Sweden', 'International / MARPOL'];

/**
 * COLOR CODING FOR DOCUMENT TYPES
 * Makes it easier to visually distinguish different types of documents
 */
const typeColors: Record<string, string> = {
  'Tax Law': '#2E7D52',
  'Environmental Regulation': '#1B7A8A',
  'Maritime Convention': '#0A3D62',
  'EU Directive': '#6d28d9',
  'National Code': '#b45309',
};

/**
 * RESULT ROW COMPONENT
 *
 * Displays a single search result with:
 * - Highlighted search terms
 * - Document metadata (type, jurisdiction, year)
 * - Bookmark button
 * - Link to view full document
 *
 * BACKEND TODO: Replace bookmark toggle with API call
 */
function ResultRow({ result, query }: { result: LegalResult; query: string }) {
  const [saved, setSaved] = useState(result.isBookmarked);
  const [hovered, setHovered] = useState(false);

  /**
   * HIGHLIGHT SEARCH TERMS
   *
   * Wraps matching text in <mark> tags for visual highlighting.
   * This improves user experience by showing why a result matched.
   */
  const highlight = (text: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark
          key={i}
          style={{ background: 'rgba(27,122,138,0.15)', color: '#1B7A8A', borderRadius: 2 }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        borderRadius: 10,
        border: hovered ? '1px solid rgba(10,61,98,0.2)' : '1px solid rgba(10,61,98,0.08)',
        padding: '20px 24px',
        transition: 'all 150ms',
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div style={{ flex: 1 }}>
          {/* Title */}
          <div className="flex items-start gap-3 mb-2">
            <h3
              style={{
                fontSize: 15,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                color: '#0A3D62',
                margin: 0,
                lineHeight: 1.4,
                cursor: 'pointer',
              }}
            >
              {highlight(result.title)}
            </h3>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-3 mb-3">
            <span
              style={{
                fontSize: 11,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 9999,
                background: `${typeColors[result.type] ?? '#0A3D62'}18`,
                color: typeColors[result.type] ?? '#0A3D62',
              }}
            >
              {result.type}
            </span>
            <span
              style={{
                fontSize: 12,
                fontFamily: "'Inter', sans-serif",
                color: '#6B7280',
              }}
            >
              {result.jurisdiction} · {result.year}
            </span>
          </div>

          {/* Excerpt */}
          <p
            style={{
              fontSize: 13,
              fontFamily: "'Inter', sans-serif",
              color: '#6B7280',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {highlight(result.excerpt)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3" style={{ flexShrink: 0 }}>
          {/* BACKEND TODO: Replace this with API call to bookmark document */}
          {/* POST /api/bookmarks/legal with { documentId: result.id, userId } */}
          <button
            onClick={() => setSaved(s => !s)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: saved ? '#1B7A8A' : '#6B7280',
              padding: 4,
              display: 'flex',
            }}
            aria-label="Bookmark"
          >
            <Bookmark size={16} fill={saved ? '#1B7A8A' : 'none'} />
          </button>
          <a
            href="#"
            style={{
              fontSize: 13,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              color: '#1B7A8A',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              whiteSpace: 'nowrap',
            }}
          >
            View Source <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * MAIN LEGAL SEARCH PAGE COMPONENT
 */
export function LegalSearchPage() {
  const { user } = useApp(); // Get current user (for bookmark functionality)

  // Search and filter state
  const [query, setQuery] = useState('');                    // Search query text
  const [activeType, setActiveType] = useState('All');       // Document type filter
  const [activeJurisdiction, setActiveJurisdiction] = useState('All'); // Jurisdiction filter

  /**
   * FILTER LOGIC - CLIENT-SIDE
   *
   * ⚠️ BACKEND TODO: Replace this client-side filtering with API call
   *
   * Current: Filters mockLegalResults array in browser
   * Required: Make API call when query/filters change
   *
   * Example implementation:
   * useEffect(() => {
   *   const fetchResults = async () => {
   *     const response = await fetch('/api/legal/search', {
   *       method: 'POST',
   *       body: JSON.stringify({
   *         query,
   *         type: activeType !== 'All' ? activeType : undefined,
   *         jurisdiction: activeJurisdiction !== 'All' ? activeJurisdiction : undefined
   *       })
   *     });
   *     const data = await response.json();
   *     setResults(data.results);
   *   };
   *   fetchResults();
   * }, [query, activeType, activeJurisdiction]);
   *
   * DEBOUNCING:
   * Add 300ms delay after user stops typing before making API call
   * to avoid excessive requests
   */
  const filtered = mockLegalResults.filter(r => {
    const matchType = activeType === 'All' || r.type === activeType;
    const matchJurisdiction =
      activeJurisdiction === 'All' || r.jurisdiction === activeJurisdiction;
    const matchQuery =
      !query.trim() ||
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      r.jurisdiction.toLowerCase().includes(query.toLowerCase());
    return matchType && matchJurisdiction && matchQuery;
  });

  return (
    <div style={{ background: '#F7F9FC', minHeight: '100vh' }}>
      {/* Page header */}
      <div
        style={{
          background: '#fff',
          borderBottom: '1px solid rgba(10,61,98,0.08)',
          padding: '48px 32px 40px',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1
            className="font-display"
            style={{
              fontSize: 40,
              fontWeight: 400,
              color: '#0A3D62',
              margin: '0 0 8px',
            }}
          >
            Maritime Legal &amp; Regulatory Search
          </h1>
          <p
            style={{
              fontSize: 16,
              fontFamily: "'Inter', sans-serif",
              color: '#6B7280',
              margin: '0 0 28px',
            }}
          >
            Search EU maritime law, national tax codes, and sustainability regulations
            relevant to your operations.
          </p>

          {/* Search bar */}
          <div style={{ position: 'relative', maxWidth: 820 }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: 18,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6B7280',
              }}
            />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="e.g. tonnage tax Slovenia, MARPOL discharge zone Adriatic, EU Taxonomy marine criteria..."
              style={{
                width: '100%',
                height: 56,
                padding: '0 20px 0 50px',
                border: '2px solid rgba(10,61,98,0.15)',
                borderRadius: 10,
                fontSize: 14,
                fontFamily: "'Inter', sans-serif",
                color: '#1A1F2E',
                background: '#fff',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 150ms',
              }}
              onFocus={e => ((e.currentTarget as HTMLElement).style.borderColor = '#0A3D62')}
              onBlur={e =>
                ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(10,61,98,0.15)')
              }
            />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 32px 64px' }}>
        {/* Filters row */}
        <div className="flex items-center gap-4 flex-wrap mb-8">
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {docTypes.map(type => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 9999,
                  border: `1px solid ${activeType === type ? '#0A3D62' : 'rgba(10,61,98,0.15)'}`,
                  background: activeType === type ? '#0A3D62' : '#fff',
                  color: activeType === type ? '#fff' : '#0A3D62',
                  fontSize: 12,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 150ms',
                }}
              >
                {type}
              </button>
            ))}
          </div>

          <select
            value={activeJurisdiction}
            onChange={e => setActiveJurisdiction(e.target.value)}
            style={{
              padding: '7px 12px',
              border: '1px solid rgba(10,61,98,0.15)',
              borderRadius: 8,
              fontSize: 12,
              fontFamily: "'Inter', sans-serif",
              color: '#0A3D62',
              background: '#fff',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {jurisdictions.map(j => (
              <option key={j} value={j}>
                {j === 'All' ? 'All jurisdictions' : j}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
          {/* Results */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.length === 0 ? (
              <div
                style={{
                  background: '#fff',
                  borderRadius: 10,
                  border: '1px solid rgba(10,61,98,0.08)',
                  padding: '40px 24px',
                  textAlign: 'center',
                  color: '#6B7280',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                }}
              >
                No results found for your search. Try adjusting your filters.
              </div>
            ) : (
              filtered.map(result => (
                <ResultRow key={result.id} result={result} query={query} />
              ))
            )}
          </div>

          {/* Sidebar */}
          <aside
            style={{
              width: 280,
              flexShrink: 0,
              background: '#fff',
              borderRadius: 12,
              border: '1px solid rgba(10,61,98,0.08)',
              padding: 20,
              position: 'sticky',
              top: 88,
            }}
          >
            <h3
              style={{
                fontSize: 13,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                color: '#0A3D62',
                marginBottom: 12,
              }}
            >
              Your Profile Context
            </h3>
            {user ? (
              <>
                <div
                  style={{
                    background: 'rgba(27,122,138,0.06)',
                    borderRadius: 8,
                    padding: '10px 12px',
                    marginBottom: 12,
                  }}
                >
                  <p
                    style={{
                      fontSize: 12,
                      fontFamily: "'Inter', sans-serif",
                      color: '#1B7A8A',
                      fontWeight: 500,
                      margin: '0 0 4px',
                    }}
                  >
                    {user.company}
                  </p>
                  <p style={{ fontSize: 11, fontFamily: "'Inter', sans-serif", color: '#6B7280', margin: 0 }}>
                    {user.sector} · {user.country}
                  </p>
                </div>
                <p
                  style={{
                    fontSize: 12,
                    fontFamily: "'Inter', sans-serif",
                    color: '#1A1F2E',
                    lineHeight: 1.6,
                  }}
                >
                  {filtered.length} result{filtered.length !== 1 ? 's' : ''} found.{' '}
                  <span style={{ color: '#1B7A8A', fontWeight: 500 }}>
                    {Math.min(filtered.length, 4)} apply to maritime transport operators in{' '}
                    {user.country}.
                  </span>
                </p>
              </>
            ) : (
              <p style={{ fontSize: 12, fontFamily: "'Inter', sans-serif", color: '#6B7280', lineHeight: 1.6 }}>
                Sign in to see which results are most relevant to your company profile and
                jurisdiction.
              </p>
            )}

            <div
              style={{
                marginTop: 16,
                paddingTop: 16,
                borderTop: '1px solid rgba(10,61,98,0.08)',
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontFamily: "'Inter', sans-serif",
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                Browse by type
              </p>
              {docTypes.filter(t => t !== 'All').map(type => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    padding: '5px 0',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontFamily: "'Inter', sans-serif",
                    color: activeType === type ? '#1B7A8A' : '#6B7280',
                    fontWeight: activeType === type ? 600 : 400,
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
