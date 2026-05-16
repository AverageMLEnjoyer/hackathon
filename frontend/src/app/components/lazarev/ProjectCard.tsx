import { useState } from 'react';
import { Link } from 'react-router';
import { Bookmark } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Project } from '../../data/mockData';

interface ProjectCardProps {
  project: Project;
  onContactClick?: () => void;
}

export function ProjectCard({ project, onContactClick }: ProjectCardProps) {
  const { user, savedProjects, toggleSaveProject, openLoginModal } = useApp();
  const [hovered, setHovered] = useState(false);
  const isSaved = savedProjects.includes(project.id);
  const showExtra = project.taxBenefits.length > 2;

  const handleProtectedAction = (action: () => void) => {
    if (!user) {
      openLoginModal();
    } else {
      action();
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        borderRadius: 14,
        border: hovered ? '1px solid #1B7A8A' : '1px solid rgba(0,0,0,0.07)',
        boxShadow: hovered
          ? '0 6px 24px rgba(10,61,98,0.14)'
          : '0 2px 12px rgba(10,61,98,0.08)',
        transition: 'all 200ms ease',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Save bookmark (authenticated) */}
      {user && (
        <button
          onClick={() => toggleSaveProject(project.id)}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            borderRadius: 6,
            color: isSaved ? '#1B7A8A' : '#6B7280',
            zIndex: 1,
          }}
          aria-label={isSaved ? 'Unsave project' : 'Save project'}
        >
          <Bookmark size={16} fill={isSaved ? '#1B7A8A' : 'none'} />
        </button>
      )}

      <div style={{ padding: '20px 20px 0' }}>
        {/* Tag row */}
        <div className="flex items-center justify-between mb-3" style={{ gap: 8 }}>
          <span
            style={{
              background: 'rgba(27,122,138,0.08)',
              color: '#1B7A8A',
              fontSize: 12,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              padding: '4px 10px',
              borderRadius: 9999,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {project.categoryIcon} {project.category}
          </span>
          {project.isVerified ? (
            <span
              style={{
                background: 'rgba(46,125,82,0.1)',
                color: '#2E7D52',
                fontSize: 11,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                padding: '3px 8px',
                borderRadius: 9999,
              }}
            >
              ✓ Verified Partner
            </span>
          ) : (
            <span
              style={{
                background: 'transparent',
                color: '#6B7280',
                fontSize: 11,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                padding: '3px 8px',
                borderRadius: 9999,
                border: '1px solid #d1d5db',
              }}
            >
              ◦ Public Data
            </span>
          )}
        </div>

        {/* Org name */}
        <h3
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: '#0A3D62',
            fontFamily: "'Inter', sans-serif",
            margin: '0 0 8px',
          }}
        >
          {project.name}
        </h3>

        {/* Description */}
        <p
          style={{
            fontSize: 14,
            color: '#6B7280',
            fontFamily: "'Inter', sans-serif",
            lineHeight: 1.6,
            margin: '0 0 16px',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {project.description}
        </p>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(10,61,98,0.08)', marginBottom: 14 }} />

        {/* Tax benefits */}
        <div style={{ marginBottom: 12 }}>
          <p
            style={{
              fontSize: 11,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#6B7280',
              marginBottom: 8,
            }}
          >
            Tax Benefits
          </p>
          {project.taxBenefits.slice(0, 2).map((benefit, i) => (
            <p
              key={i}
              style={{
                fontSize: 13,
                fontFamily: "'Inter', sans-serif",
                color: '#0A3D62',
                marginBottom: 4,
                lineHeight: 1.4,
              }}
            >
              {benefit.flag} {benefit.country}: {benefit.description}
            </p>
          ))}
          {showExtra && (
            <button
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                color: '#1B7A8A',
                fontSize: 13,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
              }}
            >
              + {project.taxBenefits.length - 2} more
            </button>
          )}
        </div>

        {/* Eligible for */}
        <p
          style={{
            fontSize: 12,
            fontFamily: "'Inter', sans-serif",
            color: '#6B7280',
            marginBottom: 16,
          }}
        >
          Eligible for: {project.eligibleFor.join(', ')}
        </p>
      </div>

      {/* Bottom row */}
      <div
        style={{
          padding: '12px 20px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto',
          borderTop: '1px solid rgba(10,61,98,0.06)',
        }}
      >
        <Link
          to={user ? `/organizations/${project.slug}` : '#'}
          onClick={e => {
            if (!user) {
              e.preventDefault();
              openLoginModal();
            }
          }}
          style={{
            color: '#1B7A8A',
            fontSize: 14,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          View Profile →
        </Link>
        <button
          onClick={() => handleProtectedAction(() => {})}
          style={{
            padding: '7px 16px',
            border: '1px solid #0A3D62',
            borderRadius: 8,
            background: 'transparent',
            color: '#0A3D62',
            fontSize: 13,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 150ms',
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
          Contact
        </button>
      </div>
    </div>
  );
}
