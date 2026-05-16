import json
import os
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


class EchoRequest(BaseModel):
    text: str


class GeminiRequest(BaseModel):
    topic: str
    audience: str
    goal: str


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


ALLOWED_WEBSITES = [
    "https://react.dev/",
    "https://fastapi.tiangolo.com/",
    "https://ai.google.dev/",
]
MAX_SITE_CHARS = 6000


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


def extract_text_from_html(html: str) -> str:
    parser = TextExtractor()
    parser.feed(html)
    text = " ".join(parser.parts)
    return re.sub(r"\s+", " ", text).strip()


def fetch_allowed_website(url: str) -> dict[str, str]:
    parsed_url = urlparse(url)
    allowed_hosts = {urlparse(allowed_url).netloc for allowed_url in ALLOWED_WEBSITES}

    if parsed_url.netloc not in allowed_hosts:
        raise ValueError(f"{url} is not in the allowed website list")

    request = Request(
        url,
        headers={"User-Agent": "HackathonGeminiResearchBot/0.1"},
        method="GET",
    )

    try:
        with urlopen(request, timeout=10) as response:
            content_type = response.headers.get("content-type", "")
            if "text/html" not in content_type:
                return {"url": url, "content": "Skipped non-HTML response."}
            html = response.read().decode("utf-8", errors="ignore")
    except (HTTPError, URLError, TimeoutError) as error:
        return {"url": url, "content": f"Could not fetch this source: {error}"}

    return {"url": url, "content": extract_text_from_html(html)[:MAX_SITE_CHARS]}


def build_source_context() -> tuple[str, list[str]]:
    sources = [fetch_allowed_website(url) for url in ALLOWED_WEBSITES]
    context = "\n\n".join(
        f"Source: {source['url']}\nContent: {source['content']}"
        for source in sources
    )
    return context, [source["url"] for source in sources]


def call_gemini(prompt: str, source_context: str) -> str:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY is not configured in the backend environment.",
        )

    model = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")
    endpoint = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{model}:generateContent"
    )

    payload = {
        "system_instruction": {
            "parts": [
                {
                    "text": (
                        "Answer the user using only the provided allowed website "
                        "excerpts. Do not use outside knowledge or invent sources. "
                        "If the excerpts do not contain enough information, say so."
                    )
                }
            ]
        },
        "contents": [
            {
                "parts": [
                    {
                        "text": (
                            f"Allowed website excerpts:\n{source_context}\n\n"
                            f"User prompt:\n{prompt}"
                        )
                    }
                ]
            }
        ],
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
        with urlopen(request, timeout=30) as response:
            data = json.loads(response.read().decode("utf-8"))
    except HTTPError as error:
        detail = error.read().decode("utf-8", errors="ignore")
        raise HTTPException(status_code=502, detail=f"Gemini API error: {detail}")
    except (URLError, TimeoutError) as error:
        raise HTTPException(status_code=502, detail=f"Could not reach Gemini: {error}")

    try:
        return data["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError):
        raise HTTPException(status_code=502, detail="Gemini returned an empty response.")


def build_gemini_prompt(payload: GeminiRequest) -> str:
    return f"""
Create a concise, practical answer using this fixed template:

Topic:
{payload.topic}

Target audience:
{payload.audience}

User goal:
{payload.goal}

Required output:
- Start with a short direct answer.
- Then give 3 to 5 useful bullet points.
- Keep the language clear for the target audience.
- Only use information supported by the allowed website excerpts.
""".strip()


load_local_env()

app = FastAPI(title="Hackathon API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "Hackathon API is running"}


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/echo")
def echo_text(payload: EchoRequest) -> dict[str, str]:
    return {"text": payload.text}


@app.get("/allowed-websites")
def allowed_websites() -> dict[str, list[str]]:
    return {"websites": ALLOWED_WEBSITES}


@app.post("/ask-gemini")
def ask_gemini(payload: GeminiRequest) -> dict[str, object]:
    if not payload.topic.strip():
        raise HTTPException(status_code=400, detail="Topic cannot be empty.")
    if not payload.audience.strip():
        raise HTTPException(status_code=400, detail="Audience cannot be empty.")
    if not payload.goal.strip():
        raise HTTPException(status_code=400, detail="Goal cannot be empty.")

    prompt = build_gemini_prompt(payload)
    source_context, sources = build_source_context()
    answer = call_gemini(prompt, source_context)
    return {"answer": answer, "sources": sources}
