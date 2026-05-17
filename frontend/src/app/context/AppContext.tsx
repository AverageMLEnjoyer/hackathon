import { createContext, useContext, useState, useEffect} from 'react';

const API_BASE_URL = 'http://localhost:8000';

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

interface AppContextType {
  user: User | null;                    // Current authenticated user (null if not logged in)
  isLoginModalOpen: boolean;            // Login modal visibility state
  openLoginModal: () => void;           // Show the login modal
  closeLoginModal: () => void;          // Hide the login modal
  login: () => void;                    // Handle user login (NEEDS BACKEND IMPLEMENTATION)
  logout: () => void;                   // Handle user logout (NEEDS BACKEND IMPLEMENTATION)
  savedProjects: string[];              // Array of saved project IDs
  toggleSaveProject: (id: string) => void;  // Add/remove project from saved list (NEEDS BACKEND)

  apiStatus: string;
  companyName: string;
  setCompanyName: (val: string) => void;
  industryType: string;
  setIndustryType: (val: string) => void;
  zoneOfOperating: string;
  setZoneOfOperating: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
  parentCompanyAddress: string;
  setParentCompanyAddress: (val: string) => void;
  answer: string;
  sources: string[];
  submitStatus: string;
  handleSubmit: (event: React.FormEvent) => Promise<void>;
}

// Create the context with an empty default value
const AppContext = createContext<AppContextType>({} as AppContextType);

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




export function AppProvider({ children }: { children: React.ReactNode }) {
  // User authentication state (null = not logged in)
  const [user, setUser] = useState<User | null>(null);

  // Login modal visibility
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Saved project IDs
  // BACKEND TODO: Load this from GET /api/bookmarks/:userId when user logs in
  const [savedProjects, setSavedProjects] = useState<string[]>(['1', '3']);

 const [apiStatus, setApiStatus] = useState<string>('Checking...');
  const [companyName, setCompanyName] = useState<string>('');
  const [industryType, setIndustryType] = useState<string>('');
  const [zoneOfOperating, setZoneOfOperating] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [parentCompanyAddress, setParentCompanyAddress] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [sources, setSources] = useState<string[]>([]);
  const [submitStatus, setSubmitStatus] = useState<string>('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/health`)
      .then((res) => res.json())
      .then((data) => setApiStatus(data.status || 'Connected'))
      .catch(() => setApiStatus('Backend offline'));
  }, []);


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitStatus('Asking Gemini...');
    setAnswer('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/research`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company_name: companyName,
          industry_type: industryType,
          zone_of_operating: zoneOfOperating,
          address: address,
          parent_company_address: parentCompanyAddress || null, // Отправляем null, если строка пустая
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      setAnswer(data.answer);
      setSources(data.sources || []);
      setSubmitStatus('Analysis Complete');
    } catch (error) {
      console.error('API Error:', error);
      setSubmitStatus('Could not get a Gemini response. Check backend terminal.');
    }
  };

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

        login: () => {
          setUser(mockUser);
          setIsLoginModalOpen(false);
        },
        logout: () => setUser(null),
        savedProjects,
        toggleSaveProject,

        apiStatus,
        companyName,
        setCompanyName,
        industryType,
        setIndustryType,
        zoneOfOperating,
        setZoneOfOperating,
        address,
        setAddress,
        parentCompanyAddress,
        setParentCompanyAddress,
        answer,
        sources,
        submitStatus,
        handleSubmit,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
