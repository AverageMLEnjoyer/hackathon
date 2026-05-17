/**
 * MOCK DATA FILE
 *
 * ⚠️ CRITICAL: THIS FILE CONTAINS PLACEHOLDER DATA FOR FRONTEND DEVELOPMENT
 * ⚠️ ALL DATA HERE MUST BE REPLACED WITH BACKEND API CALLS
 *
 * PURPOSE:
 * ========
 * This file provides sample data so the frontend can be developed and tested
 * without requiring a working backend. Your backend team should:
 *
 * 1. Use these TypeScript interfaces as a reference for API response structures
 * 2. Create matching database schemas
 * 3. Replace all imports of mockData with actual API calls
 *
 * BACKEND REPLACEMENT STRATEGY:
 * =============================
 *
 * Instead of importing from this file, create API service functions:
 *
 * // OLD (current):
 * import { mockProjects } from './data/mockData';
 * const projects = mockProjects;
 *
 * // NEW (with backend):
 * import { fetchProjects } from '@/services/api';
 * const projects = await fetchProjects();
 *
 * REQUIRED API ENDPOINTS:
 * =======================
 * - GET /api/projects - List all projects (with pagination & filters)
 * - GET /api/projects/:slug - Get single project by slug
 * - GET /api/legal/search - Search legal documents
 * - GET /api/organizations/:slug - Get organization profile
 * - POST /api/bookmarks/toggle - Toggle project bookmark
 *
 * DATA STRUCTURES:
 * ================
 * The interfaces below define the exact structure your API should return.
 * Match these TypeScript types in your backend response format.
 */

/**
 * CAMPAIGN DATA STRUCTURE
 *
 * Represents a fundraising campaign for a project.
 *
 * BACKEND: Store in a 'campaigns' table with foreign key to projects
 * API: GET /api/campaigns?projectId=:id
 */
export interface Campaign {
  id: string;              // Unique campaign identifier
  title: string;           // Campaign name
  description: string;     // Campaign description/goal
  raised: number;          // Amount raised so far (in EUR)
  goal: number;            // Target amount (in EUR)
  deadline: string;        // Campaign end date (ISO string or formatted)
  tags: string[];          // Tags like "EU Taxonomy Eligible"
  isActive: boolean;       // Whether campaign is currently accepting donations
}

/**
 * PROJECT DATA STRUCTURE
 *
 * Represents a maritime ESG project or organization.
 *
 * BACKEND: Main 'projects' or 'organizations' table
 * API: GET /api/projects (list) or GET /api/projects/:slug (single)
 *
 * NOTES:
 * - 'slug' is used for URL-friendly identifiers (e.g., /organizations/posidonia-foundation)
 * - Optional fields marked with '?' may not exist for all projects
 * - taxBenefits should come from a separate tax_benefits table with many-to-many relationship
 */
export interface Project {
  id: string;                     // Database primary key
  slug: string;                   // URL-friendly identifier (unique)
  name: string;                   // Organization/project name
  category: string;               // Project category (Seagrass, Pollution Cleanup, etc.)
  categoryIcon: string;           // Emoji or icon identifier
  isVerified: boolean;            // Whether org is verified by platform admins
  description: string;            // Short description (1-2 sentences)
  longDescription?: string;       // Full description (multiple paragraphs)
  taxBenefits: {                  // Tax incentives available per country
    country: string;
    flag: string;                 // Country flag emoji
    description: string;
  }[];
  eligibleFor: string[];          // Industries that can participate
  zones: string[];                // Geographic operational zones
  founded?: number;               // Year founded
  hqCountry?: string;             // Headquarters country
  impactMetrics?: {               // Key performance indicators
    label: string;
    value: string;
  }[];
  euFrameworks?: string[];        // Applicable EU regulations/frameworks
  campaigns?: Campaign[];         // Active fundraising campaigns
  contactName?: string;           // Primary contact person
  contactRole?: string;           // Contact's job title
  website?: string;               // Organization website URL
  address?: string;               // Physical address
}

/**
 * LEGAL SEARCH RESULT STRUCTURE
 *
 * Represents a legal document or regulation in search results.
 *
 * BACKEND: Store in 'legal_documents' table
 * API: POST /api/legal/search (with query and filters in body)
 *
 * SEARCH IMPLEMENTATION:
 * - Full-text search on title and excerpt
 * - Filter by type, jurisdiction, year range
 * - Return paginated results (e.g., 20 per page)
 * - Track bookmarked state per user
 */
export interface LegalResult {
  id: string;              // Document unique identifier
  title: string;           // Document title/name
  type: string;            // Document type (Tax Law, EU Directive, etc.)
  jurisdiction: string;    // Applicable jurisdiction (EU, Slovenia, etc.)
  year: number;            // Year published/enacted
  excerpt: string;         // Text excerpt (for search results)
  isBookmarked: boolean;   // Whether current user has bookmarked this (requires auth)
}

export const mockProjects: Project[] = [
  {
    id: '1',
    slug: 'posidonia-foundation',
    name: 'Posidonia Foundation',
    category: 'Seagrass',
    categoryIcon: '🌊',
    isVerified: true,
    description:
      'Restoring Posidonia oceanica meadows across the Adriatic coast through coastal replanting and long-term monitoring programmes. Works in close coordination with Croatian and Slovenian maritime authorities.',
    longDescription:
      'The Posidonia Foundation was established in 2014 to address the rapid decline of Posidonia oceanica seagrass meadows across the Adriatic Sea. These meadows, often described as the lungs of the Mediterranean, provide critical habitat for hundreds of species and sequester significant quantities of carbon.\n\nOur approach combines scientific rigour with direct community engagement. We operate six permanent monitoring stations across the Slovenian and Croatian coastline, collecting monthly data on meadow health, density, and biodiversity indicators.\n\nSince inception we have successfully restored 847 hectares of degraded seagrass habitat, working alongside coastal municipalities, fisheries cooperatives, and maritime transport operators. Our restoration methodology has been adopted by three other Mediterranean conservation organisations.\n\nThe Foundation is registered under Slovenian law as a non-profit institution of public interest in the field of environmental protection, making donations fully eligible for the available tax deduction mechanisms.',
    taxBenefits: [
      { country: 'Slovenia', flag: '🇸🇮', description: 'up to 0.3% of revenue deductible' },
      { country: 'Croatia', flag: '🇭🇷', description: 'charitable donation exemption for maritime operators' },
      { country: 'Italy', flag: '🇮🇹', description: 'deduction up to 30% of taxable income' },
    ],
    eligibleFor: ['Maritime Transport', 'Port Operators', 'Coastal Development'],
    zones: ['Adriatic Sea', 'Mediterranean'],
    founded: 2014,
    hqCountry: 'Slovenia',
    impactMetrics: [
      { label: 'Hectares restored', value: '847' },
      { label: 'Species monitored', value: '124' },
      { label: 'Partner companies', value: '38' },
      { label: 'Years active', value: '11' },
    ],
    euFrameworks: [
      'EU Biodiversity Strategy 2030',
      'Marine Strategy Framework Directive',
      'EU Taxonomy Regulation (Article 9)',
      'CSRD Reportable',
    ],
    campaigns: [
      {
        id: 'c1',
        title: 'Adriatic Posidonia Recovery 2026–2028',
        description:
          'Three-year restoration programme targeting 200 additional hectares of Posidonia meadows across 12 coastal sites in Slovenia and Croatia.',
        raised: 47200,
        goal: 120000,
        deadline: '31 Dec 2026',
        tags: ['EU Taxonomy Eligible', 'CSRD Reportable Donation', 'Maritime Operator Priority'],
        isActive: true,
      },
    ],
    contactName: 'Dr Maja Horvat',
    contactRole: 'Executive Director',
    website: 'https://posidoniafoundation.si',
    address: 'Prešernova 14, 6000 Koper, Slovenia',
  },
  {
    id: '2',
    slug: 'adriatic-blue-coalition',
    name: 'Adriatic Blue Coalition',
    category: 'Pollution Cleanup',
    categoryIcon: '🔵',
    isVerified: true,
    description:
      'Marine debris removal and industrial runoff mitigation across the Eastern Adriatic. Operates in partnership with the EU LIFE programme and the Adriatic-Ionian Initiative.',
    longDescription:
      'The Adriatic Blue Coalition coordinates large-scale marine debris removal and pollution prevention across the Eastern Adriatic Sea. Established in 2017 as a joint initiative between Croatian and Montenegrin environmental agencies, the Coalition has grown to encompass 23 member organisations.\n\nOur operational model deploys dedicated vessel teams for offshore debris collection while simultaneously engaging local fishing communities as environmental stewards through our "Fishing for Litter" scheme. To date we have removed 1,240 tonnes of marine debris, including significant quantities of ghost fishing gear.\n\nThe Coalition also operates a real-time pollution monitoring network of 67 sensor buoys providing early-warning capability for industrial discharge events. Data is shared openly with national environmental authorities and the European Environment Agency.',
    taxBenefits: [
      { country: 'Croatia', flag: '🇭🇷', description: 'environmental protection donation relief' },
      { country: 'Montenegro', flag: '🇲🇪', description: 'reduced corporate tax rate for qualifying donors' },
      { country: 'Slovenia', flag: '🇸🇮', description: 'up to 0.3% of revenue for pollution prevention activities' },
    ],
    eligibleFor: ['Maritime Transport', 'Port Operations', 'Offshore Energy'],
    zones: ['Adriatic Sea', 'Mediterranean'],
    founded: 2017,
    hqCountry: 'Croatia',
    impactMetrics: [
      { label: 'Tonnes removed', value: '1,240' },
      { label: 'Monitoring buoys', value: '67' },
      { label: 'Coastal km covered', value: '320' },
      { label: 'Active volunteers', value: '2,100' },
    ],
    euFrameworks: [
      'Marine Strategy Framework Directive',
      'EU Green Deal',
      'OSPAR Convention',
      'CSRD Reportable',
    ],
    campaigns: [],
    contactName: 'Ivan Petrović',
    contactRole: 'Operations Director',
    website: 'https://adriaticblue.hr',
    address: 'Riva 8, 21000 Split, Croatia',
  },
  {
    id: '3',
    slug: 'nordic-marine-recovery-fund',
    name: 'Nordic Marine Recovery Fund',
    category: 'Fisheries Recovery',
    categoryIcon: '🐟',
    isVerified: false,
    description:
      'Supporting sustainable fisheries management and spawning ground protection across the North Sea and Baltic basin. Coordinates with national fisheries authorities in Denmark, Sweden, and Germany.',
    taxBenefits: [
      { country: 'Denmark', flag: '🇩🇰', description: 'charitable contribution deduction up to 17,200 DKK' },
      {
        country: 'Sweden',
        flag: '🇸🇪',
        description: 'corporate donation deduction for environmental organisations',
      },
    ],
    eligibleFor: ['Fishing', 'Aquaculture', 'Maritime Transport'],
    zones: ['North Sea', 'Baltic Sea'],
    founded: 2011,
    hqCountry: 'Denmark',
    impactMetrics: [
      { label: 'Protected spawning areas', value: '23' },
      { label: 'Species supported', value: '18' },
      { label: 'Research partners', value: '14' },
      { label: 'Years active', value: '14' },
    ],
    euFrameworks: [
      'Common Fisheries Policy',
      'EU Biodiversity Strategy 2030',
      'Marine Strategy Framework Directive',
    ],
    campaigns: [],
  },
  {
    id: '4',
    slug: 'dalmatian-coast-biodiversity-trust',
    name: 'Dalmatian Coast Biodiversity Trust',
    category: 'Biodiversity',
    categoryIcon: '🌿',
    isVerified: true,
    description:
      'Conservation of endemic marine and coastal species along the Dalmatian archipelago. Partners with the University of Split Marine Biology faculty and the Croatian Ministry of Environment.',
    taxBenefits: [
      { country: 'Croatia', flag: '🇭🇷', description: 'full exemption for NGO donations in maritime conservation' },
      {
        country: 'Slovenia',
        flag: '🇸🇮',
        description: 'up to 0.5% of revenue for nature conservation donations',
      },
    ],
    eligibleFor: ['Maritime Transport', 'Marine Tourism', 'Coastal Development'],
    zones: ['Adriatic Sea', 'Mediterranean'],
    founded: 2009,
    hqCountry: 'Croatia',
    impactMetrics: [
      { label: 'Protected species', value: '62' },
      { label: 'Monitored sites', value: '43' },
      { label: 'Annual studies', value: '8' },
      { label: 'Partner NGOs', value: '27' },
    ],
    euFrameworks: [
      'EU Biodiversity Strategy 2030',
      'Habitats Directive',
      'EU Taxonomy Regulation (Article 9)',
    ],
    campaigns: [],
    contactName: 'Prof Ana Blažević',
    contactRole: 'Scientific Director',
    website: 'https://dalmatianbiodiversity.hr',
    address: 'Spinut 11, 21000 Split, Croatia',
  },
  {
    id: '5',
    slug: 'ionian-sea-restoration-project',
    name: 'Ionian Sea Restoration Project',
    category: 'Reef Restoration',
    categoryIcon: '🪸',
    isVerified: false,
    description:
      'Coral reef and benthic habitat restoration in the Ionian Sea. Uses proprietary nursery techniques developed by the Hellenic Centre for Marine Research.',
    taxBenefits: [
      {
        country: 'Greece',
        flag: '🇬🇷',
        description: 'corporate income tax deduction for environmental donations',
      },
      {
        country: 'Italy',
        flag: '🇮🇹',
        description: 'art bonus-style deduction for qualifying conservation entities',
      },
    ],
    eligibleFor: ['Maritime Transport', 'Marine Tourism', 'Aquaculture'],
    zones: ['Mediterranean'],
    founded: 2019,
    hqCountry: 'Greece',
    impactMetrics: [
      { label: 'Reef area restored', value: '34 ha' },
      { label: 'Coral colonies', value: '4,200' },
      { label: 'Monitoring sites', value: '12' },
      { label: 'Years active', value: '6' },
    ],
    euFrameworks: ['EU Biodiversity Strategy 2030', 'Marine Strategy Framework Directive'],
    campaigns: [
      {
        id: 'c2',
        title: 'Ionian Deep Reef Survey 2026',
        description:
          'Comprehensive deepwater survey programme to map unexplored reef systems between 40–120m depth.',
        raised: 18500,
        goal: 60000,
        deadline: '30 Jun 2026',
        tags: ['EU Taxonomy Eligible', 'CSRD Reportable Donation'],
        isActive: true,
      },
    ],
  },
  {
    id: '6',
    slug: 'baltic-fisheries-alliance',
    name: 'Baltic Fisheries Alliance',
    category: 'Fisheries Recovery',
    categoryIcon: '🐟',
    isVerified: true,
    description:
      'Coordinating sustainable Baltic Sea fisheries through catch quota management, gear innovation, and ecosystem-based management approaches aligned with EU Common Fisheries Policy.',
    taxBenefits: [
      {
        country: 'Finland',
        flag: '🇫🇮',
        description: 'deduction for donations to qualifying environmental organisations',
      },
      { country: 'Estonia', flag: '🇪🇪', description: 'income tax exemption for non-profit donations' },
      {
        country: 'Latvia',
        flag: '🇱🇻',
        description: 'corporate income tax credit for environmental conservation',
      },
    ],
    eligibleFor: ['Fishing', 'Aquaculture', 'Maritime Transport'],
    zones: ['Baltic Sea', 'North Sea'],
    founded: 2007,
    hqCountry: 'Finland',
    impactMetrics: [
      { label: 'Vessels engaged', value: '1,340' },
      { label: 'Research reports', value: '89' },
      { label: 'Policy submissions', value: '47' },
      { label: 'Member organisations', value: '134' },
    ],
    euFrameworks: [
      'Common Fisheries Policy',
      'Baltic Sea Action Plan',
      'Marine Strategy Framework Directive',
      'CSRD Reportable',
    ],
    campaigns: [],
    contactName: 'Lars Mäkinen',
    contactRole: 'Chief Executive',
    website: 'https://balticfisheries.fi',
    address: 'Merituulentie 424, 00220 Helsinki, Finland',
  },
];

export const mockLegalResults: LegalResult[] = [
  {
    id: '1',
    title: 'Slovenian Maritime Code — Tonnage Tax Special Provisions',
    type: 'Tax Law',
    jurisdiction: 'Slovenia',
    year: 2023,
    excerpt:
      'Maritime transport operators registered in Slovenia may elect the tonnage tax regime in lieu of standard corporate income tax, providing significant tax certainty for qualifying fleet operators across all operational zones...',
    isBookmarked: false,
  },
  {
    id: '2',
    title: 'EU Taxonomy Regulation — Marine and Coastal Ecosystem Criteria',
    type: 'EU Directive',
    jurisdiction: 'European Union',
    year: 2022,
    excerpt:
      'Delegated Regulation (EU) 2022/1214 establishes technical screening criteria for marine restoration activities eligible under the EU Taxonomy. Criteria include measurable biodiversity outcomes and MSFD alignment requirements...',
    isBookmarked: false,
  },
  {
    id: '3',
    title: 'MARPOL Convention — Special Areas: Adriatic Sea Provisions',
    type: 'Maritime Convention',
    jurisdiction: 'International / MARPOL',
    year: 2021,
    excerpt:
      'Annex I and Annex V designations for the Adriatic Sea as a Special Area impose stricter discharge prohibitions. Operators must demonstrate zero-discharge compliance for Annex V waste categories within designated zones...',
    isBookmarked: false,
  },
  {
    id: '4',
    title: 'Croatian Environmental Protection Act — Marine Conservation Donations',
    type: 'National Code',
    jurisdiction: 'Croatia',
    year: 2023,
    excerpt:
      'Article 98(3) provides full corporate income tax exemption for donations to registered marine conservation organisations operating within Croatian territorial waters and the exclusive economic zone...',
    isBookmarked: false,
  },
  {
    id: '5',
    title: 'EU Biodiversity Strategy 2030 — Marine Protection Targets',
    type: 'EU Directive',
    jurisdiction: 'European Union',
    year: 2020,
    excerpt:
      'The Strategy mandates legally protecting 30% of EU sea areas by 2030, with 10% under strict protection. Member States are required to submit national marine protected area implementation plans by 2024...',
    isBookmarked: false,
  },
  {
    id: '6',
    title: 'CSRD — Maritime Sector ESG Reporting Guidance',
    type: 'EU Directive',
    jurisdiction: 'European Union',
    year: 2023,
    excerpt:
      'Maritime transport entities with >250 employees or >€40M turnover must report against ESRS E1, E3, and E5 standards from financial year 2024. Marine biodiversity donations qualify as reportable nature-positive activities...',
    isBookmarked: false,
  },
];

/**
 * ========================================
 * FILTER OPTIONS & DROPDOWN DATA
 * ========================================
 *
 * BACKEND: These should come from database lookups or API endpoints
 * to keep them in sync with actual data.
 *
 * Recommended API endpoints:
 * - GET /api/filters/categories
 * - GET /api/filters/zones
 * - GET /api/filters/industries
 * - GET /api/countries (for dropdowns)
 */

/**
 * PROJECT CATEGORIES
 * BACKEND: SELECT DISTINCT category FROM projects ORDER BY category
 */
export const filterCategories = [
  'All',
  'Biodiversity',
  'Reef Restoration',
  'Seagrass',
  'Pollution Cleanup',
  'Fisheries Recovery',
];

export const operationalZones = [
  'Adriatic Sea',
  'Mediterranean',
  'North Sea',
  'Baltic Sea',
  'Black Sea',
  'Atlantic',
  'Global',
];

export const industries = [
  'Maritime Transport',
  'Port Operations',
  'Offshore Energy',
  'Marine Tourism',
  'Aquaculture',
  'Fishing',
  'Coastal Development',
  'Other',
];

export const euCountries = [
  'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic',
  'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece',
  'Hungary', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg',
  'Malta', 'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia',
  'Slovenia', 'Spain', 'Sweden',
];
