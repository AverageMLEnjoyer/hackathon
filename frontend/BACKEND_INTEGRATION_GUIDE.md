# Backend Integration Guide

## Overview

This document provides comprehensive instructions for backend developers to integrate with the Lazarev Maritime ESG Intelligence Platform frontend.

**The frontend is fully functional with mock data.** Your job is to replace the mock data with real API calls to your backend.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Authentication & User Management](#authentication--user-management)
4. [API Endpoints Required](#api-endpoints-required)
5. [Data Models](#data-models)
6. [Integration Checklist](#integration-checklist)
7. [Testing Integration](#testing-integration)
8. [Common Patterns](#common-patterns)
9. [Security Considerations](#security-considerations)

---

## Quick Start

### Where to Start

1. **Read the code comments** - All files have extensive inline comments explaining:
   - What each component does
   - Where backend integration is needed
   - Example API call implementations
   - Data structure requirements

2. **Key files to review first**:
   - `src/app/context/AppContext.tsx` - Global authentication state
   - `src/app/data/mockData.ts` - Data structures and interfaces
   - `src/app/pages/` - All page components with backend requirements

3. **Search for "BACKEND TODO:"** throughout the codebase to find all integration points

### Environment Setup

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=https://your-backend-api.com/api
VITE_AUTH_TOKEN_KEY=lazarev_auth_token
```

---

## Architecture Overview

### Frontend Stack
- **React 18** with TypeScript
- **React Router v7** for navigation (hash-based routing)
- **Tailwind CSS v4** for styling
- **Context API** for global state management
- **No external state management** (Redux, MobX, etc.)

### Data Flow

```
User Action
    ↓
Component calls API function
    ↓
API function makes HTTP request
    ↓
Backend processes request
    ↓
Backend returns JSON response
    ↓
Component updates UI with new data
```

### File Structure

```
src/
├── app/
│   ├── App.tsx                      # Main app with routing
│   ├── context/
│   │   └── AppContext.tsx           # ⭐ Auth & global state
│   ├── data/
│   │   └── mockData.ts              # ⭐ Data structures reference
│   ├── pages/                       # ⭐ All need API integration
│   │   ├── HomePage.tsx
│   │   ├── LegalSearchPage.tsx
│   │   ├── OpportunitiesPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── OrganizationPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── SettingsPage.tsx
│   └── components/
│       └── lazarev/                 # UI components
└── styles/                          # Design system & tokens
```

---

## Authentication & User Management

### Current Implementation (Mock)

Located in `src/app/context/AppContext.tsx`:

```typescript
// CURRENT - Mock implementation
const login = () => {
  setUser(mockUser);
  setIsLoginModalOpen(false);
};
```

### Required Implementation

```typescript
// REQUIRED - Real authentication
const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const { token, user } = await response.json();
    
    // Store token
    localStorage.setItem('authToken', token);
    
    // Update global state
    setUser(user);
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);
  } catch (error) {
    console.error('Login error:', error);
    // Handle error (show message to user)
  }
};
```

### Session Persistence

On app initialization, check for stored token:

```typescript
useEffect(() => {
  const token = localStorage.getItem('authToken');
  if (token) {
    // Validate token and restore user session
    validateToken(token);
  }
}, []);

const validateToken = async (token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/validate`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (response.ok) {
      const { user } = await response.json();
      setUser(user);
      setIsAuthenticated(true);
    } else {
      // Token invalid, clear it
      localStorage.removeItem('authToken');
    }
  } catch (error) {
    console.error('Token validation error:', error);
  }
};
```

---

## API Endpoints Required

### Authentication

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/auth/login` | `{ email, password }` | `{ token, user }` |
| POST | `/api/auth/register` | `{ email, password, companyName, ... }` | `{ token, user }` |
| POST | `/api/auth/logout` | - | `{ success }` |
| GET | `/api/auth/validate` | - (token in header) | `{ user }` |
| POST | `/api/auth/request-reset` | `{ email }` | `{ success }` |

### Projects/Opportunities

| Method | Endpoint | Query Params | Response |
|--------|----------|--------------|----------|
| GET | `/api/projects` | `page, limit, category, zone, verified` | `{ projects[], totalCount, totalPages }` |
| GET | `/api/projects/:slug` | - | `{ project }` |
| POST | `/api/projects/search` | `{ query, filters }` | `{ results[], totalCount }` |

### Legal Documents

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/legal/search` | `{ query, type, jurisdiction }` | `{ results[], totalCount }` |
| GET | `/api/legal/documents/:id` | - | `{ document }` |
| GET | `/api/legal/types` | - | `{ types[] }` |
| GET | `/api/legal/jurisdictions` | - | `{ jurisdictions[] }` |

### Bookmarks

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/bookmarks/toggle` | `{ itemId, itemType }` | `{ success, bookmarked }` |
| GET | `/api/bookmarks/:userId` | - | `{ bookmarks[] }` |

### Dashboard

| Method | Endpoint | Response |
|--------|----------|----------|
| GET | `/api/dashboard/:userId` | `{ complianceScore, metrics, alerts, activity }` |
| GET | `/api/activity/:userId` | `{ activities[] }` |

### Organizations

| Method | Endpoint | Response |
|--------|----------|----------|
| GET | `/api/organizations/:slug` | `{ organization }` |
| PUT | `/api/organizations/:id` | `{ success }` |

### User Settings

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| GET | `/api/users/:userId/settings` | - | `{ settings }` |
| PUT | `/api/users/:userId/settings` | `{ settings }` | `{ success }` |

### Filter Options (Optional - can be hardcoded)

| Method | Endpoint | Response |
|--------|----------|----------|
| GET | `/api/filters/categories` | `{ categories[] }` |
| GET | `/api/filters/zones` | `{ zones[] }` |
| GET | `/api/filters/industries` | `{ industries[] }` |
| GET | `/api/countries` | `{ countries[] }` |

---

## Data Models

All TypeScript interfaces are defined in `src/app/data/mockData.ts`.

Use these as a reference for your API response structures.

### Key Interfaces

#### User
```typescript
interface User {
  name: string;          // Full name
  firstName: string;     // First name
  company: string;       // Company name
  initials: string;      // For avatar (e.g., "MN")
  email: string;
  country: string;
  sector: string;
  zones: string[];       // Operational zones
}
```

#### Project
```typescript
interface Project {
  id: string;
  slug: string;          // URL-friendly identifier
  name: string;
  category: string;
  categoryIcon: string;
  isVerified: boolean;
  description: string;
  longDescription?: string;
  taxBenefits: Array<{
    country: string;
    flag: string;
    description: string;
  }>;
  eligibleFor: string[];
  zones: string[];
  founded?: number;
  hqCountry?: string;
  impactMetrics?: Array<{
    label: string;
    value: string;
  }>;
  euFrameworks?: string[];
  campaigns?: Campaign[];
  contactName?: string;
  contactRole?: string;
  website?: string;
  address?: string;
}
```

#### LegalResult
```typescript
interface LegalResult {
  id: string;
  title: string;
  type: string;           // "Tax Law", "EU Directive", etc.
  jurisdiction: string;
  year: number;
  excerpt: string;
  isBookmarked: boolean;
}
```

---

## Integration Checklist

Use this checklist to track your integration progress:

### Phase 1: Authentication
- [ ] Create POST /api/auth/login endpoint
- [ ] Create POST /api/auth/register endpoint
- [ ] Create POST /api/auth/logout endpoint
- [ ] Create GET /api/auth/validate endpoint
- [ ] Implement JWT token generation
- [ ] Update `AppContext.tsx` login function
- [ ] Update `AppContext.tsx` logout function
- [ ] Add session persistence logic
- [ ] Test login flow end-to-end
- [ ] Test registration flow end-to-end

### Phase 2: Data Loading
- [ ] Create GET /api/projects endpoint
- [ ] Create GET /api/projects/:slug endpoint
- [ ] Create POST /api/legal/search endpoint
- [ ] Update `HomePage.tsx` to load projects from API
- [ ] Update `OpportunitiesPage.tsx` to load projects from API
- [ ] Update `LegalSearchPage.tsx` to search via API
- [ ] Update `OrganizationPage.tsx` to load org data from API

### Phase 3: User Features
- [ ] Create POST /api/bookmarks/toggle endpoint
- [ ] Create GET /api/bookmarks/:userId endpoint
- [ ] Update bookmark functionality in components
- [ ] Create GET /api/dashboard/:userId endpoint
- [ ] Update `DashboardPage.tsx` to load data from API
- [ ] Create GET/PUT /api/users/:userId/settings endpoints
- [ ] Update `SettingsPage.tsx` to save settings to API

### Phase 4: Search & Filtering
- [ ] Implement full-text search for legal documents
- [ ] Implement project filtering by category, zone, etc.
- [ ] Add pagination support to all list endpoints
- [ ] Optimize search queries with database indexes
- [ ] Add debouncing to search inputs (300ms delay)

### Phase 5: Testing & Polish
- [ ] Test all API endpoints with Postman/similar
- [ ] Add error handling for network failures
- [ ] Add loading states to all data-fetching components
- [ ] Test authentication edge cases (expired tokens, etc.)
- [ ] Add rate limiting to login/registration endpoints
- [ ] Add API request/response logging
- [ ] Test end-to-end user journeys

---

## Testing Integration

### Manual Testing

1. **Login Flow**:
   - Try logging in with valid credentials
   - Try logging in with invalid credentials
   - Check that user data appears in header
   - Refresh page - user should stay logged in
   - Log out - user should be cleared

2. **Data Loading**:
   - Visit each page and verify data loads
   - Check browser network tab for API calls
   - Verify correct data is displayed

3. **Bookmarks**:
   - Bookmark a project
   - Refresh page - bookmark should persist
   - Unbookmark - should update immediately

4. **Search**:
   - Search for projects/legal documents
   - Apply filters
   - Verify results match query

### API Testing Tools

Use tools like Postman, Insomnia, or curl to test endpoints:

```bash
# Test login
curl -X POST http://localhost:3000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"test@example.com","password":"password123"}'

# Test projects list
curl -X GET http://localhost:3000/api/projects?page=1&limit=10

# Test with authentication
curl -X GET http://localhost:3000/api/dashboard/user123 \\
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Common Patterns

### Making Authenticated Requests

Create a helper function for authenticated API calls:

```typescript
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers,
    },
  });

  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('authToken');
    window.location.href = '/';
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return await response.json();
}
```

### Loading States

Add loading state to components:

```typescript
const [loading, setLoading] = useState(false);
const [data, setData] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await fetchAPI('/api/projects');
      setData(result.projects);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);

// In render:
if (loading) return <LoadingSpinner />;
if (!data) return <div>No data</div>;
```

### Error Handling

```typescript
const [error, setError] = useState<string | null>(null);

try {
  const result = await fetchAPI('/api/projects');
  setData(result);
  setError(null);
} catch (err) {
  setError(err instanceof Error ? err.message : 'An error occurred');
}

// In render:
{error && <div className="error">{error}</div>}
```

---

## Security Considerations

### Authentication
- ✅ **Use HTTPS** for all API requests
- ✅ **Hash passwords** on backend (bcrypt, argon2)
- ✅ **Never log passwords** or tokens
- ✅ **Use JWT** for stateless authentication
- ✅ **Set token expiration** (e.g., 24 hours)
- ✅ **Implement refresh tokens** for long-term sessions

### API Security
- ✅ **Validate all inputs** on backend
- ✅ **Sanitize data** to prevent SQL injection
- ✅ **Rate limit** authentication endpoints
- ✅ **Use CORS** properly (allow only your frontend domain)
- ✅ **Add request logging** for security monitoring
- ✅ **Implement CSRF protection** if using cookies

### Data Protection
- ✅ **Don't expose sensitive data** in API responses
- ✅ **Use environment variables** for secrets
- ✅ **Encrypt data at rest** in database
- ✅ **Use prepared statements** for database queries
- ✅ **Implement role-based access control** (RBAC)

### Common Vulnerabilities to Avoid
- ❌ **Don't store passwords in plain text**
- ❌ **Don't expose user emails in public endpoints**
- ❌ **Don't allow unlimited API requests** (implement rate limiting)
- ❌ **Don't trust client-side validation alone**
- ❌ **Don't use predictable IDs** for sensitive resources
- ❌ **Don't log sensitive information** (passwords, tokens, PII)

---

## Questions?

**Check the code comments** - Every file has extensive documentation explaining what it does and what backend integration is needed.

**Look for "BACKEND TODO:"** comments throughout the codebase - they mark exact integration points.

**Review the TypeScript interfaces** in `src/app/data/mockData.ts` - they define the exact data structures your API should return.

---

**Good luck with the integration!** The frontend is designed to make your job as easy as possible. All the hard work of UI and state management is done - you just need to connect it to real data.
