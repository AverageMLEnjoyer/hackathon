/**
 * LOGIN MODAL COMPONENT
 *
 * Modal dialog for user authentication.
 * Displayed when user clicks "Log In" button or tries to access protected features.
 *
 * BACKEND INTEGRATION REQUIREMENTS:
 * ==================================
 *
 * 1. LOGIN SUBMISSION:
 *    - When form is submitted, call POST /api/auth/login
 *    - Body: { email: string, password: string }
 *    - Response: { success: boolean, token: string, user: User }
 *
 * 2. AUTHENTICATION FLOW:
 *    a. User enters email and password
 *    b. Frontend validates basic format (email, min length)
 *    c. POST to /api/auth/login
 *    d. Backend verifies credentials
 *    e. Backend returns JWT token + user data
 *    f. Frontend stores token in localStorage
 *    g. Frontend updates global user state
 *    h. Modal closes, user is logged in
 *
 * 3. ERROR HANDLING:
 *    - Invalid credentials: Show "Incorrect email or password"
 *    - Account not found: Show "No account found with this email"
 *    - Network error: Show "Connection error. Please try again"
 *    - Rate limiting: Show "Too many attempts. Please wait X minutes"
 *
 * 4. FORGOT PASSWORD:
 *    - "Forgot password?" link should trigger password reset flow
 *    - POST /api/auth/request-reset with { email }
 *    - Send email with reset link
 *    - Link should go to a password reset page (not implemented yet)
 *
 * 5. SECURITY:
 *    - Never store password in state longer than necessary
 *    - Clear password field after failed attempt
 *    - Implement rate limiting (max 5 attempts per 15 minutes)
 *    - Use HTTPS for all authentication requests
 *    - Store JWT securely (httpOnly cookie preferred over localStorage)
 *
 * 6. SSO (FUTURE):
 *    - "SSO for enterprise clients" note at bottom
 *    - Could add OAuth buttons (Google, Microsoft) here
 *    - Would need separate endpoints:
 *      * GET /api/auth/oauth/google
 *      * GET /api/auth/oauth/microsoft
 */

import { useState } from 'react';
import { X, Eye, EyeOff, Anchor } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router';

export function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility

  // Don't render if modal is not open
  if (!isLoginModalOpen) return null;

  /**
   * HANDLE LOGIN FORM SUBMISSION
   *
   * BACKEND TODO: Replace login() call with actual API request
   *
   * Example implementation:
   * const handleSubmit = async (e: React.FormEvent) => {
   *   e.preventDefault();
   *   try {
   *     const response = await fetch('/api/auth/login', {
   *       method: 'POST',
   *       headers: { 'Content-Type': 'application/json' },
   *       body: JSON.stringify({ email, password }),
   *     });
   *
   *     if (!response.ok) {
   *       const error = await response.json();
   *       alert(error.message); // Show proper error UI instead
   *       return;
   *     }
   *
   *     const { token, user } = await response.json();
   *     localStorage.setItem('authToken', token);
   *     login(user); // Update global state with user data
   *     closeLoginModal();
   *     setPassword(''); // Clear password from memory
   *   } catch (error) {
   *     console.error('Login failed:', error);
   *     alert('Login failed. Please try again.');
   *   }
   * };
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(); // BACKEND TODO: Replace with actual API call
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      {/* Backdrop */}
      <div
        onClick={closeLoginModal}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(10,61,98,0.4)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'relative',
          background: '#fff',
          borderRadius: 20,
          width: '100%',
          maxWidth: 480,
          padding: '40px 40px 36px',
          boxShadow: '0 24px 80px rgba(10,61,98,0.2)',
          zIndex: 1,
        }}
      >
        {/* Close */}
        <button
          onClick={closeLoginModal}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#6B7280',
            padding: 4,
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Small context label */}
        <p
          style={{
            fontSize: 12,
            fontFamily: "'Inter', sans-serif",
            color: '#6B7280',
            textAlign: 'center',
            marginBottom: 16,
          }}
        >
          To access full contact details, please sign in.
        </p>

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <Anchor size={16} style={{ color: '#0A3D62' }} />
          <span
            className="font-display"
            style={{ fontSize: 16, letterSpacing: '0.12em', color: '#0A3D62' }}
          >
            LAZAREV
          </span>
        </div>

        {/* Title */}
        <h2
          className="font-display"
          style={{
            fontSize: 26,
            fontWeight: 400,
            color: '#0A3D62',
            textAlign: 'center',
            marginBottom: 28,
          }}
        >
          Sign in to Lazarev
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Email */}
          <div>
            <label
              htmlFor="modal-email"
              style={{
                display: 'block',
                fontSize: 13,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                color: '#1A1F2E',
                marginBottom: 6,
              }}
            >
              Business Email
            </label>
            <input
              id="modal-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="marko.novak@adriashipping.si"
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid rgba(10,61,98,0.2)',
                borderRadius: 8,
                fontSize: 14,
                fontFamily: "'Inter', sans-serif",
                color: '#1A1F2E',
                background: '#fff',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={e =>
                ((e.currentTarget as HTMLElement).style.borderColor = '#0A3D62')
              }
              onBlur={e =>
                ((e.currentTarget as HTMLElement).style.borderColor =
                  'rgba(10,61,98,0.2)')
              }
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="modal-password"
              style={{
                display: 'block',
                fontSize: 13,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                color: '#1A1F2E',
                marginBottom: 6,
              }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="modal-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '10px 40px 10px 14px',
                  border: '1px solid rgba(10,61,98,0.2)',
                  borderRadius: 8,
                  fontSize: 14,
                  fontFamily: "'Inter', sans-serif",
                  color: '#1A1F2E',
                  background: '#fff',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={e =>
                  ((e.currentTarget as HTMLElement).style.borderColor = '#0A3D62')
                }
                onBlur={e =>
                  ((e.currentTarget as HTMLElement).style.borderColor =
                    'rgba(10,61,98,0.2)')
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6B7280',
                  padding: 0,
                  display: 'flex',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div style={{ textAlign: 'right', marginTop: 6 }}>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#1B7A8A',
                  fontSize: 12,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Forgot password?
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '13px 0',
              background: '#0A3D62',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 15,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 150ms',
              marginTop: 4,
            }}
            onMouseEnter={e =>
              ((e.currentTarget as HTMLElement).style.background = '#1B7A8A')
            }
            onMouseLeave={e =>
              ((e.currentTarget as HTMLElement).style.background = '#0A3D62')
            }
          >
            Log In
          </button>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              margin: '4px 0',
            }}
          >
            <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
            <span
              style={{
                fontSize: 12,
                color: '#6B7280',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              or
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
          </div>

          {/* Create account */}
          <Link
            to="/register"
            onClick={closeLoginModal}
            style={{
              display: 'block',
              width: '100%',
              padding: '12px 0',
              border: '1px solid #1B7A8A',
              borderRadius: 8,
              color: '#1B7A8A',
              fontSize: 14,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              textAlign: 'center',
              textDecoration: 'none',
              transition: 'all 150ms',
              boxSizing: 'border-box',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = '#1B7A8A';
              (e.currentTarget as HTMLElement).style.color = '#fff';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.color = '#1B7A8A';
            }}
          >
            Create a company account →
          </Link>
        </form>

        <p
          style={{
            fontSize: 11,
            fontFamily: "'Inter', sans-serif",
            color: '#6B7280',
            textAlign: 'center',
            marginTop: 20,
          }}
        >
          SSO for enterprise clients available.{' '}
          <a href="mailto:sales@lazarev.io" style={{ color: '#1B7A8A' }}>
            Contact sales@lazarev.io
          </a>
        </p>
      </div>
    </div>
  );
}
