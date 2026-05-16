/**
 * MAIN APPLICATION COMPONENT
 *
 * This is the root component of the Lazarev Maritime ESG Intelligence Platform.
 * It sets up routing, global state management, and page layouts.
 *
 * BACKEND INTEGRATION NOTES:
 * - HashRouter is used for client-side routing (no server config needed)
 * - To use BrowserRouter (cleaner URLs), replace HashRouter and configure your server
 *   to serve index.html for all routes
 * - AppProvider wraps the entire app and provides authentication state
 * - All page components consume data that should come from your backend API
 *
 * ROUTING STRUCTURE:
 * - / : Homepage with company search form
 * - /legal-search : Search maritime legal documents
 * - /opportunities : Browse ESG project opportunities
 * - /organizations/:slug : View organization profile (slug = company identifier)
 * - /dashboard : User dashboard (requires authentication)
 * - /settings : User settings (requires authentication)
 * - /register : Multi-step registration form
 */

import { HashRouter, Routes, Route } from 'react-router';
import { AppProvider } from './context/AppContext';
import { LazarevHeader } from './components/lazarev/LazarevHeader';
import { LazarevFooter } from './components/lazarev/LazarevFooter';
import { LoginModal } from './components/lazarev/LoginModal';
import { HomePage } from './pages/HomePage';
import { LegalSearchPage } from './pages/LegalSearchPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { DashboardPage } from './pages/DashboardPage';
import { OrganizationPage } from './pages/OrganizationPage';
import { RegisterPage } from './pages/RegisterPage';
import { SettingsPage } from './pages/SettingsPage';

/**
 * STANDARD LAYOUT COMPONENT
 *
 * Used for most pages - includes header, footer, and login modal.
 * The main content area grows to fill available space between header and footer.
 *
 * BACKEND NOTES:
 * - Header contains navigation and user authentication state
 * - Footer is static content
 * - LoginModal is globally available and controlled by AppContext
 */
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <LazarevHeader />
      <main style={{ flex: 1 }}>{children}</main>
      <LazarevFooter />
      <LoginModal />
    </div>
  );
}

/**
 * FULL-PAGE LAYOUT COMPONENT
 *
 * Used for pages that need the full viewport (e.g., registration).
 * No header or footer - just the page content and login modal.
 */
function FullPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <LoginModal />
    </>
  );
}

/**
 * ROOT APP COMPONENT
 *
 * Sets up the entire application with:
 * 1. HashRouter for client-side routing
 * 2. AppProvider for global state (authentication, bookmarks)
 * 3. All application routes
 *
 * BACKEND INTEGRATION:
 * - Each route loads a page component that will need backend data
 * - See individual page files for specific API requirements
 * - Protected routes (dashboard, settings) should redirect to login if not authenticated
 *   (Currently handled in the pages themselves via AppContext)
 */
export default function App() {
  return (
    <HashRouter>
      <AppProvider>
        <Routes>
          {/* Homepage - Company search and project recommendations */}
          <Route
            path="/"
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />

          {/* Legal Search - Search maritime laws and regulations */}
          <Route
            path="/legal-search"
            element={
              <Layout>
                <LegalSearchPage />
              </Layout>
            }
          />

          {/* Opportunities - Browse ESG projects and funding opportunities */}
          <Route
            path="/opportunities"
            element={
              <Layout>
                <OpportunitiesPage />
              </Layout>
            }
          />

          {/* Organization Profile - Dynamic route with :slug parameter */}
          {/* BACKEND: Fetch organization data by slug from URL params */}
          <Route
            path="/organizations/:slug"
            element={
              <Layout>
                <OrganizationPage />
              </Layout>
            }
          />

          {/* Dashboard - Requires authentication */}
          {/* BACKEND: Should verify user session/token before returning data */}
          <Route
            path="/dashboard"
            element={
              <Layout>
                <DashboardPage />
              </Layout>
            }
          />

          {/* Settings - Requires authentication */}
          {/* BACKEND: Should verify user session/token before returning data */}
          <Route
            path="/settings"
            element={
              <Layout>
                <SettingsPage />
              </Layout>
            }
          />

          {/* Registration - Multi-step form (no header/footer) */}
          {/* BACKEND: POST to /api/register with form data */}
          <Route
            path="/register"
            element={
              <FullPageLayout>
                <RegisterPage />
              </FullPageLayout>
            }
          />
        </Routes>
      </AppProvider>
    </HashRouter>
  );
}
