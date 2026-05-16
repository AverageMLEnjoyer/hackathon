import json
import os
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlparse, urlunparse
from urllib.request import Request, urlopen

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .load_sites import load_target_sites


ALLOWED_WEBSITES = load_target_sites()
MAX_SITE_CHARS = 6000
DEFAULT_GEMINI_MODEL = "gemini-2.5-flash"
DEFAULT_GEMINI_TIMEOUT_SECONDS = 60
DEFAULT_CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
LOCAL_NETWORK_ORIGIN_REGEX = (
    r"^https?://("
    r"localhost|"
    r"127\.0\.0\.1|"
    r"10\.\d{1,3}\.\d{1,3}\.\d{1,3}|"
    r"192\.168\.\d{1,3}\.\d{1,3}|"
    r"172\.(?:1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}"
    r")(?::\d+)?$"
)

class CompanyResearchRequest(BaseModel):
    company_name: str
    industry_type: str
    zone_of_operating: str
    address: str
    parent_company_address: str | None = None


class TextExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self._skip_tag: str | None = None
        self.parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in {"script", "style", "noscript"}:
            self._skip_tag = tag

    def handle_endtag(self, tag: str) -> None:
        if tag == self._skip_tag:
            self._skip_tag = None

    def handle_data(self, data: str) -> None:
        if self._skip_tag is None and data.strip():
            self.parts.append(data.strip())


def load_local_env() -> None:
    env_path = Path(__file__).resolve().parents[1] / ".env"
    if not env_path.exists():
        return

    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def get_cors_origins() -> list[str]:
    configured_origins = os.environ.get("BACKEND_CORS_ORIGINS", "")
    extra_origins = [
        origin.strip()
        for origin in configured_origins.split(",")
        if origin.strip()
    ]
    return [*DEFAULT_CORS_ORIGINS, *extra_origins]


def extract_text_from_html(html: str) -> str:
    parser = TextExtractor()
    parser.feed(html)
    text = " ".join(parser.parts)
    return re.sub(r"\s+", " ", text).strip()


def fetch_allowed_website(url: str) -> dict[str, str]:
    if url not in ALLOWED_WEBSITES:
        raise ValueError(f"{url} is not in the allowed website list")

    parsed_url = urlparse(url)
    if parsed_url.scheme not in {"http", "https"}:
        return {"url": url, "content": "Skipped invalid website URL."}

    try:
        encoded_url = urlunparse(
            parsed_url._replace(
                path=quote(parsed_url.path, safe="/:%"),
                query=quote(parsed_url.query, safe="=&?/:%"),
            )
        )
        request = Request(
            encoded_url,
            headers={"User-Agent": "HackathonTaxResearchBot/0.1"},
            method="GET",
        )
        with urlopen(request, timeout=10) as response:
            content_type = response.headers.get("content-type", "")
            if "text/html" not in content_type:
                return {"url": url, "content": "Skipped non-HTML response."}
            html = response.read().decode("utf-8", errors="ignore")
    except (HTTPError, URLError, TimeoutError, UnicodeError, ValueError) as error:
        return {"url": url, "content": f"Could not fetch this source: {error}"}

    return {"url": url, "content": extract_text_from_html(html)[:MAX_SITE_CHARS]}
def safe_fetch_allowed_website(url: str) -> dict[str, str]:
    try:
        return fetch_allowed_website(url)
    except Exception as error:
        return {"url": url, "content": f"Skipped source after fetch error: {error}"}


def build_source_context() -> tuple[str, list[str]]:
    sources = [safe_fetch_allowed_website(url) for url in ALLOWED_WEBSITES]
    context = "\n\n".join(
        f"Source: {source['url']}\nContent: {source['content']}"
        for source in sources
    )
    return context, [source["url"] for source in sources]


def build_gemini_prompt(payload: CompanyResearchRequest) -> str:
    user_prompt = (
        "Analyze the following organization and find applicable green or marine "
        "tax benefits:\n"
        f"- Organization Name: {payload.company_name}\n"
        f"- Industry Type: {payload.industry_type}\n"
        f"- Zone of Operating: {payload.zone_of_operating}\n"
        f"- Registered Address: {payload.address}\n"
    )

    if payload.parent_company_address:
        user_prompt += (
            "- Note: This is a subsidiary company. Parent company location: "
            f"{payload.parent_company_address}\n"
        )

    user_prompt += (
        "\nFind applicable tax incentives, subsidies, grants, or tax deductions "
        "in marine sustainability for this entity."
    )

    return f"""
You are a leading expert in international tax law, green subsidies, and
environmental grants. Your task is to identify tax incentives, subsidies,
grants, or tax deductions specifically in the field of marine sustainability
(blue economy, ocean protection, sustainable aquaculture, eco-shipping) for the
provided organization.

Search rules:
1. Use only the allowed website excerpts provided by the backend.
2. Do not use outside knowledge, general web search, or sources outside the
   allowed websites list.
3. Focus on legislation, local/federal policies, and incentives of the country
   and region where the company operates.

The output must contain:
- A structured list of available support programs or tax deductions matching the
  company's industry.
- Direct references or source links from the allowed websites, if found.
- Step-by-step basic eligibility criteria for the company to qualify.

If no specific incentives are found for this region in the allowed website
excerpts, reply exactly:
"No marine sustainability tax incentives or programs discovered for this region
within the specified data sources."

User request:
{user_prompt}
""".strip()

def get_gemini_timeout() -> int:
    configured_timeout = os.environ.get("GEMINI_TIMEOUT_SECONDS")
    if not configured_timeout:
        return DEFAULT_GEMINI_TIMEOUT_SECONDS

    try:
        return int(configured_timeout)
    except ValueError:
        return DEFAULT_GEMINI_TIMEOUT_SECONDS


def get_gemini_model_id() -> str:
    model = os.environ.get("GEMINI_MODEL", DEFAULT_GEMINI_MODEL).strip()
    if not model:
        return DEFAULT_GEMINI_MODEL
    if model.startswith("models/"):
        return model.removeprefix("models/")
    return model


def get_gemini_api_key() -> str:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY is not configured in backend/.env.",
        )
    return api_key


def call_gemini(prompt: str, source_context: str) -> str:
    api_key = get_gemini_api_key()
    model = get_gemini_model_id()
    timeout = get_gemini_timeout()
    endpoint = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{model}:generateContent"
    )

    payload = {
        "system_instruction": {
            "parts": [
                {
                    "text": (
                        "Answer only from the allowed website excerpts included "
                        "in the user message. Do not browse, search, or invent "
                        "facts. If the excerpts are insufficient, say so."
                    )
                }
            ]
        },
        "contents": [
            {
                "role": "user",
                "parts": [
                    {
                        "text": (
                            f"Allowed website excerpts:\n{source_context}\n\n"
                            f"Research prompt:\n{prompt}"
                        )
                    }
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.2,
            "topP": 0.9,
            "maxOutputTokens": 2048,
        },
    }

    request = Request(
        endpoint,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "x-goog-api-key": api_key,
        },
        method="POST",
    )

    try:
        with urlopen(request, timeout=timeout) as response:
            data = json.loads(response.read().decode("utf-8"))
    except HTTPError as error:
        detail = error.read().decode("utf-8", errors="ignore")
        raise HTTPException(status_code=502, detail=f"Gemini API error: {detail}")
    except (URLError, TimeoutError) as error:
        raise HTTPException(status_code=502, detail=f"Could not reach Gemini: {error}")

    return extract_gemini_text(data)

def extract_gemini_text(data: dict[str, object]) -> str:
    candidates = data.get("candidates")
    if not isinstance(candidates, list) or not candidates:
        prompt_feedback = data.get("promptFeedback")
        raise HTTPException(
            status_code=502,
            detail=f"Gemini returned no candidates. Prompt feedback: {prompt_feedback}",
        )

    candidate = candidates[0]
    if not isinstance(candidate, dict):
        raise HTTPException(
            status_code=502,
            detail="Gemini returned a malformed candidate.",
        )

    content = candidate.get("content")
    parts = content.get("parts") if isinstance(content, dict) else None
    text_parts = [
        part["text"].strip()
        for part in parts or []
        if (
            isinstance(part, dict)
            and isinstance(part.get("text"), str)
            and part["text"].strip()
        )
    ]

    if text_parts:
        return "\n".join(text_parts)

    finish_reason = candidate.get("finishReason")
    safety_ratings = candidate.get("safetyRatings")
    raise HTTPException(
        status_code=502,
        detail=(
            "Gemini returned no text. "
            f"finishReason={finish_reason}, safetyRatings={safety_ratings}"
        ),
    )


load_local_env()

app = FastAPI(title="Marine Sustainability Tax Research API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_origin_regex=LOCAL_NETWORK_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "Marine sustainability tax research API is running"}


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/allowed-websites")
def allowed_websites() -> dict[str, list[str]]:
    return {"websites": ALLOWED_WEBSITES}


@app.post("/api/research")
def research_tax_incentives(payload: CompanyResearchRequest) -> dict[str, object]:
    required_fields = {
        "company_name": payload.company_name,
        "industry_type": payload.industry_type,
        "zone_of_operating": payload.zone_of_operating,
        "address": payload.address,
    }
    for field_name, value in required_fields.items():
        if not value.strip():
            raise HTTPException(status_code=400, detail=f"{field_name} cannot be empty.")

    get_gemini_api_key()
    prompt = build_gemini_prompt(payload)
    source_context, sources = build_source_context()
    answer = call_gemini(prompt, source_context)
    return {"answer": answer, "sources": sources}
