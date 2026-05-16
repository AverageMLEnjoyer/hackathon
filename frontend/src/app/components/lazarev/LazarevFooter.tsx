import { Anchor } from 'lucide-react';
import { Link } from 'react-router';

const footerLinks = {
  Product: ['Home', 'Legal Search', 'Opportunities', 'Pricing'],
  Company: ['About', 'Blog', 'Careers', 'Press'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
};

const productPaths: Record<string, string> = {
  Home: '/',
  'Legal Search': '/legal-search',
  Opportunities: '/opportunities',
  Pricing: '#',
};

export function LazarevFooter() {
  return (
    <footer style={{ background: '#0A3D62', color: '#fff' }}>
      <div
        className="mx-auto py-16"
        style={{ maxWidth: 1200, padding: '64px 32px 0' }}
      >
        <div
          className="grid gap-12"
          style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr', marginBottom: 48 }}
        >
          {/* Logo + tagline */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Anchor size={20} style={{ color: 'rgba(255,255,255,0.8)' }} />
              <span
                className="font-display"
                style={{ fontSize: 18, letterSpacing: '0.12em', color: '#fff' }}
              >
                LAZAREV
              </span>
            </div>
            <p
              style={{
                fontSize: 14,
                color: 'rgba(255,255,255,0.6)',
                lineHeight: 1.7,
                maxWidth: 240,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Maritime ESG Intelligence Platform. Connecting EU maritime operators with
              ocean conservation projects and tax incentive frameworks.
            </p>
            <div className="flex gap-4 mt-6">
              {/* LinkedIn */}
              <a
                href="#"
                style={{
                  color: 'rgba(255,255,255,0.6)',
                  transition: 'color 150ms',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#fff')}
                onMouseLeave={e =>
                  ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)')
                }
                aria-label="LinkedIn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              {/* X / Twitter */}
              <a
                href="#"
                style={{
                  color: 'rgba(255,255,255,0.6)',
                  transition: 'color 150ms',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#fff')}
                onMouseLeave={e =>
                  ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)')
                }
                aria-label="X / Twitter"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.5)',
                  marginBottom: 16,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {heading}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {links.map(link => (
                  <li key={link}>
                    <Link
                      to={productPaths[link] ?? '#'}
                      style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: 14,
                        textDecoration: 'none',
                        fontFamily: "'Inter', sans-serif",
                        transition: 'color 150ms',
                      }}
                      onMouseEnter={e =>
                        ((e.currentTarget as HTMLElement).style.color = '#fff')
                      }
                      onMouseLeave={e =>
                        ((e.currentTarget as HTMLElement).style.color =
                          'rgba(255,255,255,0.7)')
                      }
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            padding: '24px 0',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <p
            style={{
              fontSize: 13,
              color: 'rgba(255,255,255,0.5)',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            © 2026 Lazarev Technologies d.o.o. · Registered in Slovenia · EU VAT compliant
          </p>
          <p
            style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.35)',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Lazarev does not provide legal or tax advice. Information is for guidance only.
          </p>
        </div>
      </div>
    </footer>
  );
}
