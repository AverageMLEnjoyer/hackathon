/**
 * GLOBAL APPLICATION CONTEXT
 *
 * This file manages global application state including:
 * - User authentication and session
 * - Login modal visibility
 * - Saved projects/bookmarks
 *
 * CRITICAL BACKEND INTEGRATION POINTS:
 * =====================================================
 *
 * 1. USER AUTHENTICATION:
 *    - Replace mockUser with real user data from your backend
 *    - Implement JWT token storage in localStorage/cookies
 *    - Add token refresh logic
 *    - Verify session on app load
 *
 * 2. LOGIN FLOW:
 *    - login() function should call POST /api/auth/login
 *    - Store returned JWT token
 *    - Fetch and set user profile data
 *
 * 3. LOGOUT FLOW:
 *    - logout() should call POST /api/auth/logout
 *    - Clear stored tokens
 *    - Redirect to homepage
 *
 * 4. SAVED PROJECTS:
 *    - toggleSaveProject() should call POST /api/bookmarks/toggle
 *    - Load user's bookmarks on login from GET /api/bookmarks/:userId
 *    - Persist changes to backend
 *
 * 5. SESSION PERSISTENCE:
 *    - Check for stored auth token on app initialization
 *    - Validate token with backend
 *    - Auto-login if valid token exists
 */

import { createContext, useContext, useState } from 'react';

/**
 * USER DATA STRUCTURE
 *
 * Represents an authenticated user in the system.
 *
 * BACKEND: This should match the user object returned from your API.
 * You may need to add additional fields like:
 * - id: string (user ID from database)
 * - role: string (user role/permissions)
 * - companyId: string (organization identifier)
 * - subscription: string (subscription tier)
 * - createdAt: Date
 * - lastLogin: Date
 */
export interface User {
  name: string;          // Full name (e.g., "Marko Novak")
  firstName: string;     // First name only
  company: string;       // Company/organization name
  initials: string;      // For avatar display (e.g., "MN")
  email: string;         // User email address
  country: string;       // Country of registration
  sector: string;        // Industry sector
  zones: string[];       // Operational zones (e.g., ["Adriatic Sea"])
}

/**
 * CONTEXT TYPE DEFINITION
 *
 * Defines all the values and functions available through the context.
 * Any component can access these by using the useApp() hook.
 */
interface AppContextType {
  user: User | null;                    // Current authenticated user (null if not logged in)
  isLoginModalOpen: boolean;            // Login modal visibility state
  openLoginModal: () => void;           // Show the login modal
  closeLoginModal: () => void;          // Hide the login modal
  login: () => void;                    // Handle user login (NEEDS BACKEND IMPLEMENTATION)
  logout: () => void;                   // Handle user logout (NEEDS BACKEND IMPLEMENTATION)
  savedProjects: string[];              // Array of saved project IDs
  toggleSaveProject: (id: string) => void;  // Add/remove project from saved list (NEEDS BACKEND)
}

// Create the context with an empty default value
const AppContext = createContext<AppContextType>({} as AppContextType);

/**
 * MOCK USER DATA
 *
 * BACKEND TODO: REMOVE THIS - This is placeholder data for development.
 * Replace with actual user data from your authentication API.
 */
const mockUser: User = {
  name: 'Marko Novak',
  firstName: 'Marko',
  company: 'Adria Shipping d.o.o.',
  initials: 'MN',
  email: 'marko.novak@adriashipping.si',
  country: 'Slovenia',
  sector: 'Maritime Transport',
  zones: ['Adriatic Sea', 'Mediterranean'],
};

/**
 * APP PROVIDER COMPONENT
 *
 * Wraps the entire application and provides global state to all child components.
 *
 * BACKEND INTEGRATION STEPS:
 * =========================
 *
 * 1. On mount, check for stored auth token:
 *    useEffect(() => {
 *      const token = localStorage.getItem('authToken');
 *      if (token) {
 *        // Validate token with backend and fetch user data
 *        validateAndLoadUser(token);
 *      }
 *    }, []);
 *
 * 2. Replace login() with actual API call:
 *    const login = async (email: string, password: string) => {
 *      const response = await fetch('/api/auth/login', {
 *        method: 'POST',
 *        body: JSON.stringify({ email, password }),
 *      });
 *      const { token, user } = await response.json();
 *      localStorage.setItem('authToken', token);
 *      setUser(user);
 *      setIsLoginModalOpen(false);
 *    };
 *
 * 3. Replace logout() with API call:
 *    const logout = async () => {
 *      await fetch('/api/auth/logout', { method: 'POST' });
 *      localStorage.removeItem('authToken');
 *      setUser(null);
 *      // Optionally redirect to homepage
 *    };
 *
 * 4. Replace toggleSaveProject() with API call:
 *    const toggleSaveProject = async (id: string) => {
 *      await fetch('/api/bookmarks/toggle', {
 *        method: 'POST',
 *        body: JSON.stringify({ projectId: id }),
 *      });
 *      setSavedProjects(prev =>
 *        prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
 *      );
 *    };
 */
export function AppProvider({ children }: { children: React.ReactNode }) {
  // User authentication state (null = not logged in)
  const [user, setUser] = useState<User | null>(null);

  // Login modal visibility
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Saved project IDs
  // BACKEND TODO: Load this from GET /api/bookmarks/:userId when user logs in
  const [savedProjects, setSavedProjects] = useState<string[]>(['1', '3']);

  /**
   * TOGGLE SAVE PROJECT
   *
   * Adds or removes a project from the user's saved list.
   *
   * BACKEND TODO: Replace with API call to persist bookmark state
   * POST /api/bookmarks/toggle
   * Body: { projectId: string, userId: string }
   */
  const toggleSaveProject = (id: string) => {
    setSavedProjects(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isLoginModalOpen,
        openLoginModal: () => setIsLoginModalOpen(true),
        closeLoginModal: () => setIsLoginModalOpen(false),

        /**
         * LOGIN FUNCTION
         *
         * BACKEND TODO: Replace this mock implementation with real authentication
         *
         * Current behavior: Sets user to mockUser
         * Required behavior:
         * 1. Accept email and password as parameters
         * 2. Call POST /api/auth/login
         * 3. Store JWT token in localStorage
         * 4. Fetch and set user data
         * 5. Handle errors (wrong password, network issues, etc.)
         *
         * Example implementation:
         * login: async (email: string, password: string) => {
         *   try {
         *     const response = await fetch('/api/auth/login', {
         *       method: 'POST',
         *       headers: { 'Content-Type': 'application/json' },
         *       body: JSON.stringify({ email, password }),
         *     });
         *     if (!response.ok) throw new Error('Login failed');
         *     const { token, user } = await response.json();
         *     localStorage.setItem('authToken', token);
         *     setUser(user);
         *     setIsLoginModalOpen(false);
         *   } catch (error) {
         *     console.error('Login error:', error);
         *     // Show error message to user
         *   }
         * }
         */
        login: () => {
          setUser(mockUser);
          setIsLoginModalOpen(false);
        },

        /**
         * LOGOUT FUNCTION
         *
         * BACKEND TODO: Replace with real logout implementation
         *
         * Current behavior: Clears user state
         * Required behavior:
         * 1. Call POST /api/auth/logout to invalidate token
         * 2. Remove token from localStorage
         * 3. Clear user state
         * 4. Clear saved projects
         * 5. Redirect to homepage
         */
        logout: () => setUser(null),

        savedProjects,
        toggleSaveProject,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

/**
 * CUSTOM HOOK TO ACCESS APP CONTEXT
 *
 * Use this hook in any component to access global state and functions.
 *
 * Example usage:
 * const { user, login, logout, savedProjects } = useApp();
 *
 * if (!user) {
 *   // User not logged in
 * }
 */
export const useApp = () => useContext(AppContext);
