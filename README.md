<div align="center">

# 📊 Sales Insight Automator

**AI-powered sales data analysis with executive summary email delivery**

[![CI Pipeline](https://github.com/your-username/sales-insight-automator/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/sales-insight-automator/actions)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![Llama 3](https://img.shields.io/badge/AI-Llama%203-blueviolet?logo=meta)](https://groq.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://docker.com)

Upload → Parse → AI Analysis → Email → ✅

</div>

---

## 🏗️ Architecture

```
┌─────────────┐        ┌──────────────────────────────────────────────┐
│             │  POST   │              FastAPI Backend                 │
│   Next.js   │───────▶│                                              │
│  Frontend   │        │  ┌──────────┐  ┌─────────┐  ┌────────────┐  │
│  (Vercel)   │◀───────│  │  Parser  │─▶│  Groq   │─▶│  Resend    │  │
│             │  JSON   │  │  Service │  │   AI    │  │  Email     │  │
└─────────────┘        │  └──────────┘  └─────────┘  └────────────┘  │
                       │              (Render)                        │
                       └──────────────────────────────────────────────┘
```

### Data Flow

1. **Upload** – User uploads a `.csv` or `.xlsx` sales dataset via the frontend
2. **Validate** – Backend validates file type, size (≤5 MB), email format
3. **Parse** – Pandas converts the dataset into structured text with statistical summary
4. **AI Analysis** – The structured data is sent to Groq's Llama 3 70B model
5. **Email** – The AI-generated executive summary is emailed via Resend
6. **Response** – The frontend displays the summary and confirms email delivery

---

## 📂 Project Structure

```
sales-insight-automator/
│
├── frontend/                    # Next.js 14 (App Router)
│   ├── app/
│   │   ├── layout.tsx          # Root layout with SEO metadata
│   │   └── page.tsx            # Home page with hero & upload widget
│   ├── components/
│   │   └── FileUpload.tsx      # Core upload + progress component
│   ├── styles/
│   │   └── globals.css         # TailwindCSS + custom animations
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                     # FastAPI (Python 3.12)
│   ├── main.py                 # App entry – CORS, rate limit, lifespan
│   ├── routers/
│   │   └── analyze.py          # POST /analyze endpoint
│   ├── services/
│   │   ├── ai_service.py       # Groq API integration
│   │   ├── email_service.py    # Resend API integration
│   │   └── parser_service.py   # CSV/XLSX parsing
│   ├── schemas/
│   │   └── request_schema.py   # Pydantic response models
│   ├── utils/
│   │   └── security.py         # Validation & sanitization
│   ├── tests/
│   │   └── test_security.py    # Unit tests
│   └── requirements.txt
│
├── docker/
│   ├── Dockerfile.frontend     # Multi-stage Next.js build
│   ├── Dockerfile.backend      # Python slim image
│   └── docker-compose.yml      # Full-stack orchestration
│
├── .github/
│   └── workflows/
│       └── ci.yml              # CI pipeline (lint, test, build)
│
├── .env.example                # Environment variable template
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 20
- **Python** ≥ 3.12
- **Docker & Docker Compose** (for containerised run)
- API keys for [Groq](https://console.groq.com) and [Resend](https://resend.com)

### 1. Clone & Configure

```bash
git clone https://github.com/your-username/sales-insight-automator.git
cd sales-insight-automator

# Create .env from template
cp .env.example .env
# Edit .env and add your real API keys
```

### 2. Run with Docker (Recommended)

```bash
cd docker
docker-compose up --build
```

| Service  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:3000         |
| Backend  | http://localhost:8000         |
| API Docs | http://localhost:8000/docs    |

### 3. Run Locally (Development)

**Backend:**

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

---

## 📡 API Documentation

FastAPI automatically generates interactive Swagger docs:

| Endpoint     | Method | Description                          |
|-------------|--------|--------------------------------------|
| `/`         | GET    | Health check                         |
| `/analyze`  | POST   | Upload dataset & trigger AI analysis |
| `/docs`     | GET    | Swagger UI                           |
| `/redoc`    | GET    | ReDoc UI                             |

### POST `/analyze`

**Content-Type:** `multipart/form-data`

| Field   | Type   | Description                   |
|---------|--------|-------------------------------|
| `file`  | File   | `.csv` or `.xlsx` (max 5 MB)  |
| `email` | String | Recipient email address       |

**Success Response (200):**

```json
{
  "status": "success",
  "summary": "AI-generated executive summary text…"
}
```

**Error Response (422):**

```json
{
  "detail": "Unsupported file type. Only .csv and .xlsx files are accepted."
}
```

---

## 🔐 Security Decisions

| Layer              | Implementation                                      |
|--------------------|-----------------------------------------------------|
| File Validation    | Extension whitelist (`.csv`, `.xlsx`) + size cap     |
| Input Sanitization | HTML entity escaping, whitespace normalization       |
| Email Validation   | RFC 5322 regex + length cap (320 chars)              |
| Rate Limiting      | 10 requests/minute per IP via SlowAPI                |
| CORS               | Explicit origin whitelist from environment           |
| Secrets            | Environment variables only — never hard-coded        |
| Docker             | Non-root user in both containers                     |
| Dependencies       | Pinned versions in `requirements.txt` & `package.json` |

---

## 🚢 Deployment Guide

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial release of Sales Insight Automator"
git remote add origin https://github.com/your-username/sales-insight-automator.git
git push -u origin main
```

### Step 2 — Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Set **Root Directory** to `frontend`
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = your Render backend URL (e.g. `https://sia-api.onrender.com`)
5. Deploy

### Step 3 — Deploy Backend to Render

1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect your GitHub repository
3. Set **Root Directory** to `backend`
4. Set **Build Command**: `pip install -r requirements.txt`
5. Set **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables:
   - `GROQ_API_KEY`
   - `RESEND_API_KEY`
   - `EMAIL_FROM`
   - `FRONTEND_URL` = your Vercel frontend URL

### Step 4 — Verify

1. Open `https://your-backend.onrender.com/docs` — Swagger should load
2. Open your Vercel frontend URL
3. Upload a test CSV, enter your email, and confirm the full flow

---

## 🧪 Testing

```bash
cd backend
pytest tests/ -v
```

---

## 📝 Engineer's Log — Design Choices

### Why Groq + Llama 3?
Groq provides extremely fast inference for open-source LLMs. Llama 3 70B delivers enterprise-grade analytical quality while keeping the stack vendor-unlocked — no OpenAI dependency.

### Why Resend?
Modern, developer-first email API with generous free tier. Clean SDK, simple authentication, and instant delivery. No SMTP configuration headaches.

### Why FastAPI?
Async-native, automatic OpenAPI docs, Pydantic validation, and first-class `multipart/form-data` support — ideal for file-upload APIs.

### Why Next.js 14 App Router?
Server components by default, built-in metadata API for SEO, and seamless Vercel deployment. The App Router represents the future of React architecture.

### Parsing Strategy
Rather than sending raw CSV bytes to the AI, we pre-process with Pandas:
- Generate a statistical summary (`describe()`)
- Convert to structured text
- Cap at 500 rows to stay within token limits
This produces far higher-quality AI output than raw data dumps.

### Rate Limiting
10 req/min per IP prevents abuse without impacting legitimate users. SlowAPI integrates natively with FastAPI's middleware stack.

### File Size Cap
5 MB balances usability (most sales exports) with server safety. Combined with the 500-row AI cap, this prevents memory spikes.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with ❤️ using **FastAPI** • **Next.js** • **Llama 3** • **Resend**

</div>
