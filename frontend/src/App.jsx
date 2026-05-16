import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export default function App() {
  const [apiStatus, setApiStatus] = useState('Checking...');
  const [companyName, setCompanyName] = useState('');
  const [industryType, setIndustryType] = useState('');
  const [zoneOfOperating, setZoneOfOperating] = useState('');
  const [address, setAddress] = useState('');
  const [parentCompanyAddress, setParentCompanyAddress] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState([]);
  const [submitStatus, setSubmitStatus] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/health`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setApiStatus(data.status ?? 'ok'))
      .catch(() => setApiStatus('Backend not reachable'));

    fetch(`${API_BASE_URL}/allowed-websites`)
      .then((response) => response.json())
      .then((data) => setSources(data.websites ?? []))
      .catch(() => setSources([]));
  }, []);

  async function handleSubmit(event) {
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
          address,
          parent_company_address: parentCompanyAddress || null,
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      setAnswer(data.answer);
      setSources(data.sources ?? sources);
      setSubmitStatus('Gemini response');
    } catch {
      setSubmitStatus('Could not get a Gemini response');
    }
  }

  return (
    <main className="app-shell">
      <section className="intro">
        <p className="eyebrow">Marine sustainability research</p>
        <h1>Tax Incentive Finder</h1>
        <p>
          Enter company details. The backend inserts them into a hardcoded tax
          incentive research prompt and sends only approved source excerpts to
          Gemini.
        </p>
      </section>

      <form className="research-form" onSubmit={handleSubmit}>
        <div className="field-grid">
          <label htmlFor="company-name-input">
            Company name
            <input
              id="company-name-input"
              type="text"
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              placeholder="Example: OceanTech d.o.o."
              required
            />
          </label>

          <label htmlFor="industry-type-input">
            Industry type
            <input
              id="industry-type-input"
              type="text"
              value={industryType}
              onChange={(event) => setIndustryType(event.target.value)}
              placeholder="Example: sustainable aquaculture"
              required
            />
          </label>

          <label htmlFor="zone-input">
            Zone of operating
            <input
              id="zone-input"
              type="text"
              value={zoneOfOperating}
              onChange={(event) => setZoneOfOperating(event.target.value)}
              placeholder="Example: Slovenia and EU"
              required
            />
          </label>

          <label htmlFor="address-input">
            Registered address
            <input
              id="address-input"
              type="text"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Example: Ljubljana, Slovenia"
              required
            />
          </label>

          <label htmlFor="parent-address-input">
            Parent company address
            <input
              id="parent-address-input"
              type="text"
              value={parentCompanyAddress}
              onChange={(event) => setParentCompanyAddress(event.target.value)}
              placeholder="Optional"
            />
          </label>
        </div>

        <button type="submit">Generate</button>
      </form>

      <section className="response-panel" aria-live="polite">
        <span>{submitStatus || 'Backend response will appear here'}</span>
        {answer && <p>{answer}</p>}
      </section>

      <section className="sources-panel" aria-label="Allowed websites">
        <span>Allowed websites</span>
        <ul>
          {sources.map((source) => (
            <li key={source}>
              <a href={source} target="_blank" rel="noreferrer">
                {source}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="status-panel" aria-label="Backend status">
        <span>Backend status</span>
        <strong>{apiStatus}</strong>
      </section>
    </main>
  );
}
