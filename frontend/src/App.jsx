import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export default function App() {
  const [apiStatus, setApiStatus] = useState('Checking...');
  const [text, setText] = useState('');
  const [backendText, setBackendText] = useState('');
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
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitStatus('Sending...');
    setBackendText('');

    try {
      const response = await fetch(`${API_BASE_URL}/echo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      setBackendText(data.text);
      setSubmitStatus('Received from backend');
    } catch {
      setSubmitStatus('Could not reach backend');
    }
  }

  return (
    <main className="app-shell">
      <section className="intro">
        <p className="eyebrow">Full-stack starter</p>
        <h1>Echo Website</h1>
        <p>
          Type a message, send it to the FastAPI backend, and see the backend
          response rendered on the page.
        </p>
      </section>

      <form className="echo-form" onSubmit={handleSubmit}>
        <label htmlFor="text-input">Message</label>
        <div className="input-row">
          <input
            id="text-input"
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Write something..."
          />
          <button type="submit">Send</button>
        </div>
      </form>

      <section className="response-panel" aria-live="polite">
        <span>{submitStatus || 'Backend response will appear here'}</span>
        {backendText && <strong>{backendText}</strong>}
      </section>

      <section className="status-panel" aria-label="Backend status">
        <span>Backend status</span>
        <strong>{apiStatus}</strong>
      </section>
    </main>
  );
}
