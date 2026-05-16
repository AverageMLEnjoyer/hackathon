import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export default function App() {
  const [apiStatus, setApiStatus] = useState('Checking...');

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
  }, []);

  return (
    <main className="app-shell">
      <section className="intro">
        <p className="eyebrow">Full-stack starter</p>
        <h1>Hackathon Project</h1>
        <p>
          React is running on the frontend, FastAPI is ready on the backend,
          and both sides are wired together through a health check.
        </p>
      </section>

      <section className="status-panel" aria-label="Backend status">
        <span>Backend status</span>
        <strong>{apiStatus}</strong>
      </section>
    </main>
  );
}
