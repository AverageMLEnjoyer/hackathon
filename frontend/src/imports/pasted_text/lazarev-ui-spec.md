Maritime ESG Intelligence Platform — Full UI Design Specification
PROJECT OVERVIEW
Design a professional B2B SaaS web platform called Lazarev — a Maritime ESG Intelligence tool that helps corporate representatives find tax incentives and sustainable marine projects to donate to, aligned with EU maritime law and sustainability frameworks.

Design Language: Clean, institutional, ocean-inspired. Dark navy and deep teal primary palette with warm white surfaces. Think: premium fintech meets environmental consulting. References: Stripe, Linear, Notion — but with maritime depth. NOT generic green startup. Restrained, data-dense, trustworthy.

Typography: Display font — Instrument Serif or Playfair Display (headings, logo). Body font — Satoshi or Inter (UI elements, body text). Clear hierarchy, professional weight contrast.

Color Palette:

Primary background: #F7F9FC (very light blue-white)

Surface: #FFFFFF

Primary accent: #0A3D62 (deep navy)

Secondary accent: #1B7A8A (teal)

Text primary: #1A1F2E

Text muted: #6B7280

Success: #2E7D52

Border: rgba(10, 61, 98, 0.12)

CTA button: #0A3D62 with white text

Hover states: #1B7A8A

SCREENS TO DESIGN
SCREEN 1 — HOMEPAGE (Unauthenticated State)
Header / Navigation Bar

Height: 64px, sticky, white background, bottom border 1px solid rgba(0,0,0,0.08)

LEFT: Rectangular logo area (180×36px). Logo = "LAZAREV" in Instrument Serif, letter-spaced, with a small anchor/wave SVG icon to the left. Navy color.

CENTER: Navigation tabs — Home | Legal Search | Opportunities. Tab text in Satoshi Medium 14px, navy color. Active tab has a 2px navy underline animation. Hover state: teal color transition.

RIGHT: "Log In" button — rectangular, 1px navy border, navy text, 12px border-radius, 14px Satoshi. On hover: navy fill, white text. NO Sign Up button in nav (registration triggered contextually).

Hero Section

Full-width, min-height 520px

Background: subtle radial gradient — light navy tint at edges, clean white center. Optional: very faint topographic/ocean-depth line pattern (SVG, opacity 0.04) as texture.

Headline (h1): "Find maritime tax incentives. Fund ocean ecosystems." — Instrument Serif, 52px, navy, centered, max-width 680px.

Subheadline: "Lazarev matches your company's maritime operations with EU-compliant marine projects and surfaces available tax benefits across jurisdictions." — Satoshi Regular 18px, muted gray, centered, max-width 560px, margin-top 16px.

Search Panel (main interaction): white card, 16px border-radius, shadow-md, padding 32px, max-width 780px, centered, margin-top 48px.

Search panel title: "Tell us about your company" — Satoshi Semibold 16px, navy.

6 input fields in a 2-column grid layout:

Company Name (text input, placeholder: "e.g. Adria Shipping d.o.o.")

Country of Registration (dropdown with flag icons, placeholder: "Select country")

Industry / Sector (dropdown: Maritime Transport | Port Operations | Offshore Energy | Marine Tourism | Aquaculture | Fishing | Coastal Development | Other)

Operational Zone (multi-select chips: Adriatic Sea | Mediterranean | North Sea | Baltic Sea | Black Sea | Atlantic | Global)

Annual CSR / ESG Budget (EUR) (select range: <10K | 10K–50K | 50K–200K | 200K+ | Not defined)

Fleet Size / Company Scale (select: 1–10 employees | 11–50 | 51–200 | 200+ | N/A)

Below inputs, a full-width CTA button: "Analyze My Company →" — navy fill, white Satoshi Semibold 16px, 12px radius, 56px height. On hover: teal fill transition.

Below button, small text: "By continuing you agree to our Terms. Business email domain required for registration." — 12px, muted.

Recommendations Section (below search, visible after scroll or on first load with dummy data)

Section header: "Recommendations" — Instrument Serif 32px, navy, left-aligned, padding-left matches container.

Subtitle: "Marine projects and organizations matching your operational profile" — Satoshi 15px, muted.

Filter bar: small chips row — All | Biodiversity | Reef Restoration | Seagrass | Pollution Cleanup | Fisheries Recovery. Active chip: navy fill, white text. Inactive: white with navy border.

Card grid: 3 columns on desktop, 2 on tablet, 1 on mobile. Gap 20px.

PROJECT CARD (Component)
Card dimensions: ~360px wide, auto height. Border-radius 14px. White background. Border: 1px solid rgba(0,0,0,0.07). Shadow: 0 2px 12px rgba(10,61,98,0.08). Hover: shadow elevates, border turns teal.

Card anatomy top to bottom:

TOP TAG ROW: left — category chip (e.g., "🌊 Reef Restoration") in teal tinted background; right — STATUS BADGE: "✓ Verified Partner" (green, filled) OR "◦ Public Data" (gray, outlined). 14px, rounded-full.

ORGANIZATION NAME: Satoshi Bold 17px, navy. e.g., "Posidonia Foundation"

DESCRIPTION: 2–3 lines, Satoshi Regular 14px, gray. e.g., "Restoring Posidonia oceanica meadows across the Adriatic coast through coastal replanting and monitoring programs."

DIVIDER: 1px, light border color.

TAX BENEFITS SECTION:

Label: "Tax Benefits" — Satoshi Semibold 12px, uppercase, letter-spaced, muted.

Benefit row 1: 🏛 "Slovenia: up to 0.3% of revenue deductible"

Benefit row 2: 🇭🇷 "Croatia: charitable donation exemption for maritime operators"

Each row: flag emoji + country + description, 13px Satoshi, navy. Max 2 rows shown, "+ 3 more" link in teal if more exist.

ELIGIBLE FOR: Small gray label "Eligible for: Maritime Transport, Port Operators" — 12px.

BOTTOM ROW: left — "View Profile →" text link in teal; right — "Contact" button: navy outlined, 12px radius, 13px Satoshi Semibold.

If NOT logged in: clicking "Contact" or "View Profile" triggers Login Modal (see Screen 4).

If logged in: navigates to Organization Full Page (see Screen 5).

Footer

Background: #0A3D62 (deep navy)

4-column grid: Logo + tagline | Product (Home, Legal Search, Opportunities, Pricing) | Company (About, Blog, Careers, Press) | Legal (Privacy Policy, Terms of Service, Cookie Policy)

Bottom bar: "© 2026 Lazarev Technologies d.o.o. · Registered in Slovenia · EU VAT compliant"

Social icons: LinkedIn, Twitter/X — white, minimal.

Small print: "Lazarev does not provide legal or tax advice. Information is for guidance only."

Colors: white text, rgba(255,255,255,0.5) muted text, rgba(255,255,255,0.15) borders.

SCREEN 2 — HOMEPAGE (Authenticated State)
Same as Screen 1 but:

Header RIGHT: Replace "Log In" button with Account Avatar (circular, 36px, teal background, user initials) + dropdown arrow. Dropdown: My Dashboard | Saved Projects | Settings | Log Out.

Hero section: Replace generic headline with personalized: "Welcome back, [Company Name]" — Instrument Serif 40px.

Subheadline: "3 new projects match your Adriatic operational zone this week."

Search panel shows pre-filled company data with "Edit Profile" link in teal.

Recommendations cards show "Saved" (bookmark icon, active/inactive toggle) in top-right corner of each card.

SCREEN 3 — REGISTRATION / ONBOARDING FLOW
Step-by-step modal or full page (prefer full page for B2B trust)

Layout: split-screen. LEFT: navy panel 45% width — brand image, quote, animated ocean illustration. RIGHT: white 55% — form.

LEFT PANEL:

LAZAREV logo white.

Quote: "The sea is the same for every flag. The commitments should be too." — italic, Instrument Serif 22px, white.

Below: "Trusted by maritime operators across 14 EU member states" + 3 company logo placeholders.

RIGHT PANEL — multi-step form (3 steps, progress indicator at top):

Step 1 — Business Verification

Title: "Create your company account"

Field: Business Email (note below field: "Use your company domain email. Free email providers (Gmail, Yahoo, etc.) are not accepted.") — validated against non-free domains.

Field: Password (with strength indicator bar)

Field: Confirm Password

Checkbox: "I confirm this is a registered business entity"

CTA: "Continue →" navy button full-width.

Below: "Already have an account? Log In" — teal link.

Step 2 — Company Profile

Title: "Tell us about your organization"

Field: Official Company Name

Field: Registration Number (optional)

Field: Country of Registration (dropdown)

Field: Industry (same dropdown as homepage)

Field: Operational Zone (multi-select chips)

Field: Number of Employees (select)

Field: Annual Revenue Range (select, EUR)

CTA: "Continue →"

Step 3 — ESG & Maritime Context

Title: "Maritime & sustainability profile"

Field: Fleet owned or managed? (Yes / No toggle)

Field: If yes — fleet size, flag state (dropdown)

Field: Ports of operation (multi-select: major EU ports)

Field: Current ESG/CSR annual budget (EUR range select)

Field: Primary sustainability goal (checkboxes: Biodiversity | Carbon offset | Water quality | Fisheries | Coastal resilience | Regulatory compliance)

Field: How did you hear about Lazarev? (select)

CTA: "Complete Registration →" — teal filled.

Confirmation: animated checkmark, "Account created. Redirecting to your dashboard..."

SCREEN 4 — LOGIN MODAL (Triggered from cards when unauthenticated)
Centered overlay modal, 480px wide, white, 20px radius, shadow-xl. Backdrop: navy 40% opacity blur.

Close button top-right (×)

Small label: "To access full contact details, please sign in."

LAZAREV logo small, centered.

Title: "Sign in to Lazarev" — Instrument Serif 26px.

Field: Business Email

Field: Password (show/hide toggle)

"Forgot password?" — teal right-aligned link.

CTA: "Log In" — full-width navy.

Divider: "or"

Secondary: "Create a company account →" — outlined teal button.

Note: "SSO for enterprise clients available. Contact sales@lazarev.io"

SCREEN 5 — ORGANIZATION FULL PROFILE PAGE (Authenticated)
URL pattern: /organizations/[slug]

Page header breadcrumb: Home → Opportunities → Posidonia Foundation

TOP SECTION — Organization Identity
2-column layout: LEFT 65% content, RIGHT 35% sidebar.

LEFT — main content:

STATUS BANNER at very top:

If VERIFIED PARTNER: green banner "✓ Verified Partner — This organization is actively registered on Lazarev and accepts donations through our platform."

If PUBLIC DATA: amber banner "◦ Public Data Profile — This profile was generated from public sources. The organization has not yet claimed this page. Data may be incomplete."

Organization logo (96px circle placeholder if not uploaded)

Organization name: Instrument Serif 36px, navy.

Category tags row: chips (e.g., "Reef Restoration" "Adriatic Sea" "EU Funded")

Short description: Satoshi 16px, 3–4 lines.

[TABS navigation below name]: Overview | Tax Benefits | Contact | Documents | Future Plans

Active tab: 2px navy underline.

TAB: Overview

"About this organization" — Satoshi 15px paragraphs. 3–4 paragraphs describing mission, area of work, approach, past results.

"Operating Regions" — map or text list of regions.

"Key Impact Metrics" — 3 KPI cards in a row:

Hectares restored | Species monitored | Partner companies | Years active

Each: large number in navy (Instrument Serif 32px), label below in muted Satoshi 13px.

"EU Framework Alignment" — tag list: EU Biodiversity Strategy 2030 | Marine Strategy Framework Directive | EU Taxonomy Regulation (Article 9) | CSRD Reportable.

TAB: Tax Benefits

Section per country (expandable accordions):

Country flag + name as accordion header.

Inside: table with columns — Benefit Type | Max Deduction | Eligible Company Types | Conditions | Source regulation.

Note: "Tax information is indicative. Consult a qualified tax advisor before structuring donations."

Bottom: "Which benefits apply to your company?" — teal CTA link that opens a side panel filtered to user's company country.

TAB: Contact

Contact person name + role (if verified)

Email (revealed only when logged in)

Phone (optional)

Website link (external, opens in new tab)

Physical address: full address block with Google Maps embed (static map image if no JS maps).

"Send Message" form inline: Subject | Message textarea | Send button. (For verified partners only; for public data, shows "This organization has not joined Lazarev yet. You can still reach them at...")

TAB: Documents

List of uploaded documents (for verified partners): Annual Report | Impact Report | Tax Receipt Templates | EU Grant Documentation.

Each document: file icon + name + date + download button.

For public data profiles: "No documents available. Documents are uploaded by verified partners."

TAB: Future Plans — Fundraising

Section header: "Active Fundraising Campaigns" — Instrument Serif 24px.

Campaign cards (1–2 visible, rest behind "See All"):
CAMPAIGN CARD ANATOMY:

Campaign image/illustration (16:9 ratio)

Campaign title: e.g., "Adriatic Posidonia Recovery 2026–2028"

Description: 2 lines

Progress bar: navy fill, showing % of goal raised. Below: "€47,200 raised of €120,000 goal"

Deadline: "Campaign closes: 31 Dec 2026"

Tags: "EU Taxonomy Eligible" | "CSRD Reportable Donation" | "Maritime Operator Priority"

"Donate Now" button — teal filled (only for verified partner organizations, disabled with tooltip "Coming soon" for public data).

"Save Campaign" — bookmark icon.

After campaigns: "Planned Projects (Seeking Partners)" — simpler list cards with less detail, status "Seeking Funding".

SDG alignment icons: small SDG goal circles (14, 15) shown.

RIGHT SIDEBAR (sticky on scroll):

White card, shadow-md, 16px radius, padding 24px.

"Quick Summary" header — Satoshi Semibold 14px.

Rows: Status (badge) | Founded | HQ Country | Operating Since | Registered NGO / Foundation (yes/no) | EU Registered (yes/no).

Divider.

"Tax Eligibility for Your Company" — teal label. Shows 2–3 bullet points from user's country.

Divider.

"Donate via Lazarev" button — navy, full width. Disabled with "Available for Verified Partners" tooltip if public data.

"Save Organization" — outlined teal, full width.

"Share Profile" — ghost, full width, with share icon.

Below card: small note "Profile last updated: [date] · Data source: [source]"

SCREEN 6 — LEGAL SEARCH PAGE (Tab from Nav)
URL: /legal-search

Page header: "Maritime Legal & Regulatory Search" — Instrument Serif 40px.
Subtitle: "Search EU maritime law, national tax codes, and sustainability regulations relevant to your operations."

Search bar: Full-width, large (56px height), navy border on focus. Placeholder: "e.g. tonnage tax Slovenia, MARPOL discharge zone Adriatic, EU Taxonomy marine criteria..."

Filters row: Type — (All | Tax Law | Environmental Regulation | Maritime Convention | EU Directive | National Code) | Jurisdiction (dropdown) | Year (range slider).

Results: Listed items, not cards. Each result:

Document title (bold navy link)

Document type tag (chip)

Jurisdiction + year

2-line excerpt with highlighted search term

"View Source →" external link | "Saved" bookmark icon.

Sidebar (right, 30% width): "Your Profile Context" — shows company's country and sector, highlights which results are most relevant. "These 4 results apply to maritime transport operators in Slovenia."

SCREEN 7 — OPPORTUNITIES PAGE (Tab from Nav)
URL: /opportunities

Same card grid as Homepage recommendations but:

Full page, more filters.

Left sidebar with filter panel (collapsible on mobile):

Category (checkboxes)

Operational Zone (checkboxes)

Status (Verified / Public Data)

Tax Benefit Available (toggle)

Country of Organization (multi-select)

EU Taxonomy Eligible (toggle)

Active Fundraising (toggle)

Center: card grid (2 columns), pagination at bottom.

Sort by: Most Relevant | Newest | Tax Benefit Value | Fundraising Goal.

SCREEN 8 — USER DASHBOARD (Post-login landing)
URL: /dashboard

Left sidebar navigation (240px wide, sticky):

Logo top.

Nav items with icons: Dashboard | My Profile | Saved Projects | Donations | Reports | Settings.

Active item: navy background, white text, left accent bar.

Bottom: "Need help? Contact support" + avatar + company name + plan badge ("Free" or "Pro").

Main content area:

Welcome strip: "Good morning, [First Name]. Your Adriatic operational profile has 5 new matches this week." — Instrument Serif 22px.

KPI row (4 cards):

Saved Organizations | Active Campaigns | Countries Covered | Potential Tax Saving (EUR estimate)

Each: large number (Instrument Serif 32px) + label + small trend arrow.

Section: My Saved Projects — horizontal scroll row of saved org cards (compact version, 280px wide).

Section: Tax Benefit Summary — table: Country | Applicable Law | Max Deduction | Status. One row per relevant country.

Section: Recent Activity — timeline list: "Viewed Posidonia Foundation · 2 hours ago", "Saved Adriatic Cleanup Initiative · yesterday", etc.

SCREEN 9 — SETTINGS / COMPANY PROFILE PAGE
URL: /settings

Tabs: Company Profile | Notifications | Billing | API Access | Security

Company Profile tab:

All fields from registration Step 2 + Step 3, editable.

"Save Changes" button.

"Verification Status" section: if unverified, prompt to upload company registration document.

DESIGN SYSTEM NOTES FOR FIGMA
Component Library to build:

Button variants: Primary (navy) | Secondary (teal outlined) | Ghost | Destructive

Input variants: Default | Focus | Error | Disabled

Card variants: Project Card | Campaign Card | KPI Card | Legal Result Row

Badge variants: Verified (green) | Public Data (gray) | Category (teal tint) | Status

Modal: Login | Confirmation | Alert

Navigation: Desktop Header | Mobile Hamburger | Dashboard Sidebar

Tab bar: underline style

Progress bar: campaign funding

Accordion: legal/tax sections

Chip/tag: filter chips, operational zone chips, category tags

Spacing system: 4px base grid. Components: 8/12/16/24/32/48px.
Border radius system: 6px (inputs, small elements) | 12px (cards) | 16px (modals, large cards) | 24px (hero panels) | 9999px (chips, badges).
Shadow system: sm (subtle card lift) | md (modals, dropdowns) | lg (side panels).

Responsive breakpoints:

Mobile: 375px — single column, hamburger nav, stacked cards.

Tablet: 768px — 2 columns, collapsible sidebar.

Desktop: 1280px — full layout as described.

Wide: 1440px — max-width container 1200px centered.

Interactions to prototype:

Tab navigation underline transition (200ms ease).

Card hover shadow elevation.

Login modal open/close with backdrop blur.

Step-by-step registration progress animation.

Search results appear with fade-in stagger (150ms per card).

Accordion expand/collapse.

Donation progress bar fill animation.

Dashboard KPI number count-up animation.

ACCESSIBILITY NOTES
All interactive elements minimum 44×44px touch target.

WCAG AA contrast on all text/background combinations.

Focus rings visible on all inputs and buttons (2px navy outline).

Alt text on all images and icons.

Semantic heading hierarchy (h1 → h2 → h3) on every page.

Form labels associated with every input.

COPY / TONE NOTES
Professional, not salesy. Institutional authority with environmental conviction.

British English preferred.

Numbers formatted with K/M (€47K, not €47,000 where space is limited).

Avoid generic green startup language ("empower", "unlock", "revolutionize").

Use precise maritime and legal terminology where appropriate to signal expertise.

Placeholder company names in designs: use realistic EU maritime company names (not "Company Name Inc.").

END OF SPECIFICATION