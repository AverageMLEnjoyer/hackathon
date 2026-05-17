import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProjectCard } from '../components/lazarev/ProjectCard';
import { mockProjects, filterCategories, operationalZones, industries, euCountries } from '../data/mockData';
import { Search } from 'lucide-react';

// Константы для выпадающих списков (опционально, если решите расширять бэкенд)
const budgetRanges = ['<10K', '10K–50K', '50K–200K', '200K+', 'Not defined'];
const fleetSizes = ['1–10 employees', '11–50', '51–200', '200+', 'N/A'];

/**
 * CHIP SELECT COMPONENT
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
  // 1. ПОДКЛЮЧАЕМ ВСЕ СТЕМПЫ И ФУНКЦИИ ИЗ ВАШЕГО APP.JSX ЧЕРЕЗ КОНТЕКСТ
  const {
    user,
    companyName, setCompanyName,
    industryType, setIndustryType,
    zoneOfOperating, setZoneOfOperating,
    address, setAddress,
    parentCompanyAddress, setParentCompanyAddress,
    answer, submitStatus, sources,
    handleSubmit
  } = useApp();

  const [activeFilter, setActiveFilter] = useState('All');

  // Флаг "проанализировано" теперь зависит от наличия ответа бэкенда
  const isAnalysed = !!answer || submitStatus === 'Asking Gemini...';

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
            <ellipse key={i} cx="400" cy="260" rx={r * 3} ry={r * 1.3} fill="none" stroke="#0A3D62" strokeWidth="1" />
          ))}
        </svg>

        <h1 className="font-display" style={{ fontSize: 52, fontWeight: 400, color: '#0A3D62', textAlign: 'center', maxWidth: 680, margin: '0 auto 16px', lineHeight: 1.15 }}>
          Find maritime tax incentives. Fund ocean ecosystems.
        </h1>
        <p style={{ fontSize: 18, fontFamily: "'Inter', sans-serif", color: '#6B7280', textAlign: 'center', maxWidth: 560, margin: '0 auto 48px', lineHeight: 1.6 }}>
          Lazarev matches your company's maritime operations with EU-compliant marine
          projects and surfaces available tax benefits across jurisdictions.
        </p>

        {/* СТАРТ ФОРМЫ С ВАШИМ ОБРАБОТЧИКОМ */}
        <form
          onSubmit={handleSubmit}
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
          <p style={{ fontSize: 16, fontFamily: "'Inter', sans-serif", fontWeight: 600, color: '#0A3D62', marginBottom: 20 }}>
            Tell us about your company
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

            {/* ПОЛЯ ДЛЯ ВАШЕГО БЭКЕНДА */}
            <InputField label="Company Name" id="company-name">
              <input
                id="company-name"
                type="text"
                placeholder="e.g. Adria Shipping d.o.o."
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                style={inputStyle}
                required
              />
            </InputField>

            <InputField label="Registered Address" id="address">
              <input
                id="address"
                type="text"
                placeholder="Example: Ljubljana, Slovenia"
                value={address}
                onChange={e => setAddress(e.target.value)}
                style={inputStyle}
                required
              />
            </InputField>

            <InputField label="Industry / Sector" id="industry">
              <input
                id="industry"
                type="text"
                placeholder="Example: sustainable aquaculture"
                value={industryType}
                onChange={e => setIndustryType(e.target.value)}
                style={inputStyle}
                required
              />
            </InputField>

            <InputField label="Zone of Operating" id="zone">
              <input
                id="zone"
                type="text"
                placeholder="Example: Slovenia and EU"
                value={zoneOfOperating}
                onChange={e => setZoneOfOperating(e.target.value)}
                style={inputStyle}
                required
              />
            </InputField>

            <InputField label="Parent Company Address" id="parent-address">
              <input
                id="parent-address"
                type="text"
                placeholder="Optional"
                value={parentCompanyAddress}
                onChange={e => setParentCompanyAddress(e.target.value)}
                style={inputStyle}
              />
            </InputField>

            {/* Оставляем оригинальный выпадающий список бюджетов для красоты дизайна */}
            <InputField label="Annual CSR / ESG Budget (EUR)" id="budget">
              <select id="budget" defaultValue="" style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="" disabled>Select range</option>
                {budgetRanges.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </InputField>

          </div>

          {/* КНОПКА ОТПРАВКИ ФОРМЫ С СУПЕР-СТИЛЯМИ LAZAREV */}
          <button
            type="submit"
            disabled={submitStatus === 'Asking Gemini...'}
            style={{
              width: '100%',
              height: 56,
              background: submitStatus === 'Asking Gemini...' ? '#1B7A8A' : '#0A3D62',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              fontSize: 16,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 150ms',
              marginBottom: 12,
              opacity: submitStatus === 'Asking Gemini...' ? 0.8 : 1
            }}
          >
            {submitStatus === 'Asking Gemini...' ? 'Analyse via Gemini...' : 'Analyse My Company →'}
          </button>

          <p style={{ fontSize: 12, fontFamily: "'Inter', sans-serif", color: '#6B7280', textAlign: 'center' }}>
            By continuing you agree to our Terms. Business email domain required for registration.
          </p>
        </form>
      </section>

      {/* ДИНАМИЧЕСКИЙ РЕЗУЛЬТАТ (ОТКРЫВАЕТСЯ ПОСЛЕ КЛИКА / СТАТУСА) */}
      {isAnalysed && (
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 32px 64px' }}>

          {/* КРАСИВОЕ ОКНО С ОТВЕТОМ ОТ ВАШЕГО БЭКЕНДА И GEMINI */}
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 4px 24px rgba(10,61,98,0.06)',
              padding: 32,
              marginBottom: 48,
              borderLeft: '4px solid #1B7A8A',
            }}
          >
            <h2 className="font-display" style={{ fontSize: 24, fontWeight: 400, color: '#0A3D62', margin: '0 0 16px' }}>
              {submitStatus || 'Tax Incentive & Intelligence Report'}
            </h2>

            {answer ? (
              <p style={{ fontSize: 15, fontFamily: "'Inter', sans-serif", color: '#1A1F2E', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {answer}
              </p>
            ) : (
              <p style={{ fontSize: 15, fontFamily: "'Inter', sans-serif", color: '#6B7280', fontStyle: 'italic' }}>
                Analyzing maritime regulations and tax frameworks for your profile...
              </p>
            )}

            {/* Блок источников, если они вернулись с бэкенда */}
            {sources.length > 0 && (
              <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(10,61,98,0.1)' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', display: 'block', marginBottom: 8, letterSpacing: '0.05em' }}>
                  VERIFIED FRAMEWORKS USED:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {sources.map(src => (
                    <a key={src} href={src} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#1B7A8A', textDecoration: 'none', background: 'rgba(27,122,138,0.06)', padding: '6px 12px', borderRadius: 6, fontWeight: 500 }}>
                      {src.replace('https://', '').replace('www.', '')}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* СЕКЦИЯ РЕКОМЕНДАЦИЙ (ИЗ ОРИГИНАЛЬНОГО ШАБЛОНА) */}
          <h2 className="font-display" style={{ fontSize: 32, fontWeight: 400, color: '#0A3D62', margin: '0 0 6px' }}>
            Recommendations
          </h2>
          <p style={{ fontSize: 15, fontFamily: "'Inter', sans-serif", color: '#6B7280', marginBottom: 24 }}>
            Marine projects and organisations matching your operational profile
          </p>

          {/* Фильтры категорий */}
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

          {/* Сетка карточек проектов */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}