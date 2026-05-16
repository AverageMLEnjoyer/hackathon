# Marine Sustainability Tax Research Starter

React frontend and FastAPI backend for researching marine sustainability tax
incentives with Gemini.

## Project Structure

```text
.
|-- backend/
|   |-- app/
|   |   |-- __init__.py
|   |   |-- load_sites.py
|   |   |-- main.py
|   |   `-- sites.txt
|   |-- .env.example
|   `-- requirements.txt
|-- frontend/
|   |-- src/
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |   `-- styles.css
|   |-- .env.example
|   |-- eslint.config.js
|   |-- index.html
|   `-- package.json
|-- .gitignore
`-- README.md
```

## Prerequisites

- Node.js 20 or newer
- Python 3.11 or newer

## Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

On Windows PowerShell, activate the virtual environment with:

```powershell
.\.venv\Scripts\Activate.ps1
```

Before starting the backend, edit `backend/.env` and set:

```text
GEMINI_API_KEY=your_real_gemini_api_key
```

The API will run at [http://localhost:8000](http://localhost:8000).

## Frontend Setup

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at [http://localhost:5173](http://localhost:5173).

## Environment Variables

Copy the example files before adding local secrets or environment-specific values:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

The frontend uses `VITE_API_BASE_URL` to reach the backend. The backend uses
`GEMINI_API_KEY` to call Gemini.

## Gemini Website Allowlist

The backend loads `ALLOWED_WEBSITES` from `backend/app/sites.txt`.

The backend fetches only these pages, sends their extracted text to Gemini, and
instructs Gemini to answer only from that provided content.

## Gemini Prompt Template

The website collects these backend fields:

- `company_name`
- `industry_type`
- `zone_of_operating`
- `address`
- `parent_company_address`

The frontend sends those values to `POST /api/research`. The hardcoded prompt
template lives in `build_gemini_prompt()` in `backend/app/main.py`.

## Useful Commands

```bash
# Frontend
cd frontend
npm run lint
npm run build

# Backend
cd backend
uvicorn app.main:app --reload
```
