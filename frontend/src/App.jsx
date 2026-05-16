import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export default function App() {
  const [apiStatus, setApiStatus] = useState('Checking...');
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [goal, setGoal] = useState('');
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
      const response = await fetch(`${API_BASE_URL}/ask-gemini`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, audience, goal }),
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
        <p className="eyebrow">Full-stack starter</p>
        <h1>Gemini Research</h1>
        <p>
          Fill in the three fields. The backend inserts them into a hardcoded
          prompt template and sends that prompt to Gemini.
        </p>
      </section>

      <form className="echo-form" onSubmit={handleSubmit}>
        <div className="field-grid">
          <label htmlFor="topic-input">
            Topic
            <input
              id="topic-input"
              type="text"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="Example: FastAPI routing"
            />
          </label>

          <label htmlFor="audience-input">
            Audience
            <input
              id="audience-input"
              type="text"
              value={audience}
              onChange={(event) => setAudience(event.target.value)}
              placeholder="Example: beginner developers"
            />
          </label>

          <label htmlFor="goal-input">
            Goal
            <input
              id="goal-input"
              type="text"
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
              placeholder="Example: explain how to add one endpoint"
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
