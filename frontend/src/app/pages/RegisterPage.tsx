/**
 * REGISTRATION PAGE
 *
 * Multi-step registration form for new companies/organizations.
 *
 * STEPS:
 * 1. Business Verification - Email, password, company name, VAT number
 * 2. Company Profile - Industry, size, revenue, operational details
 * 3. Maritime Context - Operational zones, ports, ESG goals, budget
 *
 * BACKEND INTEGRATION REQUIREMENTS:
 * ==================================
 *
 * 1. EMAIL VALIDATION:
 *    - Step 1: Verify email is business domain (not gmail.com, etc.)
 *    - Check if email already exists: GET /api/auth/check-email?email=:email
 *    - Return: { available: boolean, message?: string }
 *
 * 2. VAT NUMBER VERIFICATION:
 *    - Validate VAT number format for EU countries
 *    - Optional: Integrate with VIES (VAT Information Exchange System) API
 *    - POST /api/verify/vat with { vatNumber: string, country: string }
 *    - Return: { valid: boolean, companyName?: string }
 *
 * 3. REGISTRATION SUBMISSION:
 *    - Collect all form data from all steps
 *    - POST /api/auth/register
 *    - Body: {
 *        email: string,
 *        password: string (hashed on backend!),
 *        companyName: string,
 *        vatNumber: string,
 *        country: string,
 *        sector: string,
 *        employeeCount: string,
 *        revenue: string,
 *        operationalZones: string[],
 *        majorPorts: string[],
 *        esgGoals: string[],
 *        donationBudget: string,
 *        howHeard: string
 *      }
 *    - Response: { success: boolean, userId: string, token: string }
 *
 * 4. PASSWORD REQUIREMENTS:
 *    - Minimum 8 characters
 *    - At least one uppercase letter
 *    - At least one lowercase letter
 *    - At least one number
 *    - Validate on backend before storing
 *    - Hash with bcrypt or similar (NEVER store plain text!)
 *
 * 5. POST-REGISTRATION:
 *    - Send verification email: POST /api/auth/send-verification
 *    - Create user session (store JWT token)
 *    - Auto-login user after successful registration
 *    - Redirect to dashboard or onboarding tutorial
 *
 * VALIDATION:
 * - Validate each step before allowing "Next"
 * - Show inline error messages for invalid fields
 * - Prevent duplicate submissions
 * - Handle network errors gracefully
 *
 * SECURITY NOTES:
 * - Never send passwords in plain text
 * - Use HTTPS for all API calls
 * - Implement rate limiting on registration endpoint
 * - Add CAPTCHA if spam registrations are a concern
 * - Store email verification tokens securely
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, Check, Anchor, ChevronRight } from 'lucide-react';
import { operationalZones, industries, euCountries } from '../data/mockData';
import { useApp } from '../context/AppContext';

/**
 * REGISTRATION STEPS
 * Three-step process for complete company onboarding
 */
const steps = [
  { label: 'Business Verification', number: 1 },
  { label: 'Company Profile', number: 2 },
  { label: 'Maritime Context', number: 3 },
];

// BACKEND TODO: These could be loaded from API to keep them current
const budgetRanges = ['<10K', '10K–50K', '50K–200K', '200K+', 'Not defined'];
const employeeRanges = ['1–10', '11–50', '51–200', '200–500', '500+'];
const revenueRanges = ['<€1M', '€1M–€5M', '€5M–€20M', '€20M–€100M', '€100M+'];
const esgGoals = [
  'Biodiversity',
  'Carbon offset',
  'Water quality',
  'Fisheries',
  'Coastal resilience',
  'Regulatory compliance',
];
const hearAbout = ['Search engine', 'Maritime industry event', 'Colleague recommendation', 'EU portal', 'Social media', 'Other'];
const majorPorts = ['Rotterdam', 'Antwerp', 'Hamburg', 'Koper', 'Rijeka', 'Split', 'Piraeus', 'Valencia', 'Marseille', 'Genoa'];

// Shared input styling
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
  transition: 'border-color 150ms',
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

function ChipToggle({
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

export function RegisterPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);

  // Step 1
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // Step 2
  const [companyName, setCompanyName] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [country, setCountry] = useState('');
  const [industry, setIndustry] = useState('');
  const [zones, setZones] = useState<string[]>([]);
  const [employees, setEmployees] = useState('');
  const [revenue, setRevenue] = useState('');

  // Step 3
  const [hasFleet, setHasFleet] = useState<null | boolean>(null);
  const [fleetSize, setFleetSize] = useState('');
  const [ports, setPorts] = useState<string[]>([]);
  const [budget, setBudget] = useState('');
  const [goals, setGoals] = useState<string[]>([]);
  const [heard, setHeard] = useState('');

  const toggleZone = (z: string) =>
    setZones(p => (p.includes(z) ? p.filter(x => x !== z) : [...p, z]));
  const toggleGoal = (g: string) =>
    setGoals(p => (p.includes(g) ? p.filter(x => x !== g) : [...p, g]));
  const togglePort = (port: string) =>
    setPorts(p => (p.includes(port) ? p.filter(x => x !== port) : [...p, port]));

  const pwdStrength = password.length === 0 ? 0 : password.length < 8 ? 1 : password.length < 12 ? 2 : 3;

  const handleComplete = () => {
    login();
    setDone(true);
    setTimeout(() => navigate('/dashboard'), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#F7F9FC' }}>
      {/* Left panel */}
      <div
        style={{
          width: '45%',
          background: '#0A3D62',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px 56px',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* Ocean illustration */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.06,
            pointerEvents: 'none',
          }}
          viewBox="0 0 500 700"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {[40, 80, 130, 180, 240, 310, 390].map((r, i) => (
            <ellipse
              key={i}
              cx="250"
              cy="350"
              rx={r * 1.4}
              ry={r * 0.7}
              stroke="white"
              strokeWidth="1.5"
            />
          ))}
          <path
            d="M0 560 Q125 520 250 560 Q375 600 500 560 L500 700 L0 700 Z"
            fill="white"
            opacity="0.08"
          />
          <path
            d="M0 600 Q125 570 250 600 Q375 630 500 600 L500 700 L0 700 Z"
            fill="white"
            opacity="0.06"
          />
        </svg>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="flex items-center gap-2 mb-12">
            <Anchor size={20} style={{ color: 'rgba(255,255,255,0.8)' }} />
            <span
              className="font-display"
              style={{ fontSize: 18, letterSpacing: '0.12em', color: '#fff' }}
            >
              LAZAREV
            </span>
          </div>

          <blockquote
            style={{
              fontSize: 22,
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: 'italic',
              color: '#fff',
              lineHeight: 1.5,
              margin: '0 0 32px',
              maxWidth: 360,
            }}
          >
            "The sea is the same for every flag. The commitments should be too."
          </blockquote>

          <p
            style={{
              fontSize: 13,
              fontFamily: "'Inter', sans-serif",
              color: 'rgba(255,255,255,0.6)',
              marginBottom: 24,
            }}
          >
            Trusted by maritime operators across 14 EU member states
          </p>

          <div style={{ display: 'flex', gap: 12 }}>
            {['Adria Shipping', 'Pelican Lines', 'NordSea Group'].map(co => (
              <div
                key={co}
                style={{
                  padding: '6px 14px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 6,
                  fontSize: 11,
                  fontFamily: "'Inter', sans-serif",
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 500,
                }}
              >
                {co}
              </div>
            ))}
          </div>
        </div>

        <p
          style={{
            position: 'relative',
            zIndex: 1,
            fontSize: 11,
            fontFamily: "'Inter', sans-serif",
            color: 'rgba(255,255,255,0.3)',
          }}
        >
          Lazarev does not provide legal or tax advice.
        </p>
      </div>

      {/* Right panel */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          padding: '48px 56px',
        }}
      >
        {done ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              gap: 16,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(46,125,82,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Check size={28} style={{ color: '#2E7D52' }} />
            </div>
            <h2
              className="font-display"
              style={{ fontSize: 28, fontWeight: 400, color: '#0A3D62' }}
            >
              Account created.
            </h2>
            <p style={{ fontSize: 15, fontFamily: "'Inter', sans-serif", color: '#6B7280' }}>
              Redirecting to your dashboard...
            </p>
          </div>
        ) : (
          <>
            {/* Progress indicator */}
            <div className="flex items-center gap-4 mb-10">
              {steps.map((s, i) => (
                <div key={s.number} className="flex items-center gap-3">
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background:
                        step > s.number
                          ? '#2E7D52'
                          : step === s.number
                          ? '#0A3D62'
                          : 'transparent',
                      border:
                        step > s.number || step === s.number
                          ? 'none'
                          : '1px solid rgba(10,61,98,0.2)',
                      color: step >= s.number ? '#fff' : '#6B7280',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {step > s.number ? <Check size={12} /> : s.number}
                  </div>
                  <span
                    style={{
                      fontSize: 13,
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: step === s.number ? 600 : 400,
                      color: step === s.number ? '#0A3D62' : '#6B7280',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {s.label}
                  </span>
                  {i < steps.length - 1 && (
                    <div
                      style={{
                        height: 1,
                        width: 32,
                        background:
                          step > s.number ? '#2E7D52' : 'rgba(10,61,98,0.15)',
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            <div style={{ maxWidth: 480 }}>
              {/* Step 1 */}
              {step === 1 && (
                <div>
                  <h2
                    className="font-display"
                    style={{ fontSize: 28, fontWeight: 400, color: '#0A3D62', marginBottom: 28 }}
                  >
                    Create your company account
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <FieldLabel htmlFor="reg-email">Business Email</FieldLabel>
                      <input
                        id="reg-email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="marko.novak@adriashipping.si"
                        style={inputStyle}
                        onFocus={e => ((e.currentTarget as HTMLElement).style.borderColor = '#0A3D62')}
                        onBlur={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(10,61,98,0.15)')}
                      />
                      <p style={{ fontSize: 11, fontFamily: "'Inter', sans-serif", color: '#6B7280', marginTop: 4 }}>
                        Use your company domain email. Free email providers are not accepted.
                      </p>
                    </div>

                    <div>
                      <FieldLabel htmlFor="reg-pwd">Password</FieldLabel>
                      <div style={{ position: 'relative' }}>
                        <input
                          id="reg-pwd"
                          type={showPwd ? 'text' : 'password'}
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="••••••••"
                          style={{ ...inputStyle, paddingRight: 40 }}
                          onFocus={e => ((e.currentTarget as HTMLElement).style.borderColor = '#0A3D62')}
                          onBlur={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(10,61,98,0.15)')}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPwd(s => !s)}
                          style={{
                            position: 'absolute', right: 12, top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: '#6B7280', padding: 0, display: 'flex',
                          }}
                        >
                          {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {password && (
                        <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                          {[1, 2, 3].map(lvl => (
                            <div
                              key={lvl}
                              style={{
                                flex: 1, height: 3, borderRadius: 2,
                                background:
                                  pwdStrength >= lvl
                                    ? lvl === 1 ? '#d4183d' : lvl === 2 ? '#b45309' : '#2E7D52'
                                    : 'rgba(10,61,98,0.1)',
                                transition: 'background 200ms',
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <FieldLabel htmlFor="reg-confirm">Confirm Password</FieldLabel>
                      <input
                        id="reg-confirm"
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        style={{
                          ...inputStyle,
                          borderColor: confirmPassword && confirmPassword !== password ? '#d4183d' : 'rgba(10,61,98,0.15)',
                        }}
                        onFocus={e => ((e.currentTarget as HTMLElement).style.borderColor = '#0A3D62')}
                        onBlur={e => ((e.currentTarget as HTMLElement).style.borderColor = confirmPassword && confirmPassword !== password ? '#d4183d' : 'rgba(10,61,98,0.15)')}
                      />
                    </div>

                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={e => setAgreed(e.target.checked)}
                        style={{ accentColor: '#0A3D62', marginTop: 2 }}
                      />
                      <span style={{ fontSize: 13, fontFamily: "'Inter', sans-serif", color: '#1A1F2E', lineHeight: 1.5 }}>
                        I confirm this is a registered business entity
                      </span>
                    </label>

                    <button
                      onClick={() => setStep(2)}
                      disabled={!email || !password || password !== confirmPassword || !agreed}
                      style={{
                        width: '100%', padding: '13px 0',
                        background: email && password && password === confirmPassword && agreed ? '#0A3D62' : '#e5e7eb',
                        color: email && password && password === confirmPassword && agreed ? '#fff' : '#9ca3af',
                        border: 'none', borderRadius: 8,
                        fontSize: 15, fontFamily: "'Inter', sans-serif", fontWeight: 600,
                        cursor: email && password && password === confirmPassword && agreed ? 'pointer' : 'not-allowed',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      }}
                    >
                      Continue <ChevronRight size={16} />
                    </button>

                    <p style={{ textAlign: 'center', fontSize: 13, fontFamily: "'Inter', sans-serif", color: '#6B7280' }}>
                      Already have an account?{' '}
                      <Link to="/" style={{ color: '#1B7A8A', textDecoration: 'none', fontWeight: 500 }}>
                        Log In
                      </Link>
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div>
                  <h2
                    className="font-display"
                    style={{ fontSize: 28, fontWeight: 400, color: '#0A3D62', marginBottom: 28 }}
                  >
                    Tell us about your organisation
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <FieldLabel htmlFor="co-name">Official Company Name</FieldLabel>
                      <input id="co-name" type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g. Adria Shipping d.o.o." style={inputStyle} onFocus={e => ((e.currentTarget as HTMLElement).style.borderColor = '#0A3D62')} onBlur={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(10,61,98,0.15)')} />
                    </div>
                    <div>
                      <FieldLabel htmlFor="co-reg">Registration Number <span style={{ color: '#6B7280', fontWeight: 400 }}>(optional)</span></FieldLabel>
                      <input id="co-reg" type="text" value={regNumber} onChange={e => setRegNumber(e.target.value)} placeholder="e.g. 1234567000" style={inputStyle} onFocus={e => ((e.currentTarget as HTMLElement).style.borderColor = '#0A3D62')} onBlur={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(10,61,98,0.15)')} />
                    </div>
                    <div>
                      <FieldLabel htmlFor="co-country">Country of Registration</FieldLabel>
                      <select id="co-country" value={country} onChange={e => setCountry(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                        <option value="" disabled>Select country</option>
                        {euCountries.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <FieldLabel htmlFor="co-industry">Industry</FieldLabel>
                      <select id="co-industry" value={industry} onChange={e => setIndustry(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                        <option value="" disabled>Select industry</option>
                        {industries.map(i => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                    <div>
                      <FieldLabel htmlFor="co-zones">Operational Zone</FieldLabel>
                      <ChipToggle options={operationalZones} selected={zones} onToggle={toggleZone} />
                    </div>
                    <div>
                      <FieldLabel htmlFor="co-emp">Number of Employees</FieldLabel>
                      <select id="co-emp" value={employees} onChange={e => setEmployees(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                        <option value="" disabled>Select range</option>
                        {employeeRanges.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <FieldLabel htmlFor="co-rev">Annual Revenue Range (EUR)</FieldLabel>
                      <select id="co-rev" value={revenue} onChange={e => setRevenue(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                        <option value="" disabled>Select range</option>
                        {revenueRanges.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>

                    <button
                      onClick={() => setStep(3)}
                      style={{
                        width: '100%', padding: '13px 0',
                        background: '#0A3D62', color: '#fff',
                        border: 'none', borderRadius: 8,
                        fontSize: 15, fontFamily: "'Inter', sans-serif", fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      }}
                    >
                      Continue <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div>
                  <h2
                    className="font-display"
                    style={{ fontSize: 28, fontWeight: 400, color: '#0A3D62', marginBottom: 28 }}
                  >
                    Maritime &amp; sustainability profile
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                      <p style={{ fontSize: 13, fontFamily: "'Inter', sans-serif", fontWeight: 500, color: '#1A1F2E', marginBottom: 8 }}>Fleet owned or managed?</p>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {[true, false].map(v => (
                          <button
                            key={String(v)}
                            type="button"
                            onClick={() => setHasFleet(v)}
                            style={{
                              padding: '8px 24px',
                              border: `1px solid ${hasFleet === v ? '#0A3D62' : 'rgba(10,61,98,0.2)'}`,
                              borderRadius: 8, background: hasFleet === v ? '#0A3D62' : '#fff',
                              color: hasFleet === v ? '#fff' : '#0A3D62',
                              fontSize: 13, fontFamily: "'Inter', sans-serif", fontWeight: 500,
                              cursor: 'pointer', transition: 'all 150ms',
                            }}
                          >
                            {v ? 'Yes' : 'No'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {hasFleet && (
                      <div>
                        <FieldLabel htmlFor="fleet-size">Fleet size</FieldLabel>
                        <input id="fleet-size" type="number" value={fleetSize} onChange={e => setFleetSize(e.target.value)} placeholder="Number of vessels" min="1" style={inputStyle} onFocus={e => ((e.currentTarget as HTMLElement).style.borderColor = '#0A3D62')} onBlur={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(10,61,98,0.15)')} />
                      </div>
                    )}

                    <div>
                      <FieldLabel htmlFor="ports">Ports of operation</FieldLabel>
                      <ChipToggle options={majorPorts} selected={ports} onToggle={togglePort} />
                    </div>

                    <div>
                      <FieldLabel htmlFor="esg-budget">Current ESG/CSR annual budget (EUR)</FieldLabel>
                      <select id="esg-budget" value={budget} onChange={e => setBudget(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                        <option value="" disabled>Select range</option>
                        {budgetRanges.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>

                    <div>
                      <p style={{ fontSize: 13, fontFamily: "'Inter', sans-serif", fontWeight: 500, color: '#1A1F2E', marginBottom: 8 }}>Primary sustainability goal</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {esgGoals.map(goal => (
                          <label key={goal} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontFamily: "'Inter', sans-serif", color: '#1A1F2E' }}>
                            <input type="checkbox" checked={goals.includes(goal)} onChange={() => toggleGoal(goal)} style={{ accentColor: '#0A3D62' }} />
                            {goal}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <FieldLabel htmlFor="heard">How did you hear about Lazarev?</FieldLabel>
                      <select id="heard" value={heard} onChange={e => setHeard(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                        <option value="" disabled>Select</option>
                        {hearAbout.map(h => <option key={h} value={h}>{h}</option>)}
                      </select>
                    </div>

                    <button
                      onClick={handleComplete}
                      style={{
                        width: '100%', padding: '13px 0',
                        background: '#1B7A8A', color: '#fff',
                        border: 'none', borderRadius: 8,
                        fontSize: 15, fontFamily: "'Inter', sans-serif", fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Complete Registration →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
