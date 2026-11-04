# GovAIx 🏛️

**Unified multi-agent platform automating government consulting tasks 10× faster.**

GovAIx automates public-sector analysis using multi-agent AI. Upload any government document and get comprehensive analysis including executive summaries, compliance risks, budget planning, and public communications - all in under a minute.

---

## Monorepo Overview

This repository contains two implementations:

- `govaix-next/` — Next.js application (modern web UI with demos and dashboard)
- Python prototype in the root — Streamlit app (`app.py`) with agents and utilities

### Structure

```
.
├── govaix-next/            # Next.js app
├── agents/                 # Python agents
├── utils/                  # Python utilities
├── samples/                # Sample content
├── app.py                  # Streamlit entrypoint
├── requirements.txt        # Python dependencies
└── README.md               # This file
```

## Quick Start

```bash
pip install -r requirements.txt
streamlit run app.py
```

The OpenAI key can be typed into the sidebar (kept per-session, never stored), or
provided by the operator via the `OPENAI_API_KEY` environment variable or
`.streamlit/secrets.toml`.

Run the tests (no API key or network needed — the OpenAI client is faked):

```bash
pip install -r requirements-dev.txt
python -m pytest -q
```

### Next.js App

```bash
cd govaix-next
npm install
npm run dev
```

All integrations (Dedalus, CrustData, Random Labs, Lingo.dev, Shisa AI) are
mocked by default; copy `govaix-next/.env.example` to `.env.local` to configure
them. Checks: `npm run lint`, `npx tsc --noEmit`, `npm run build`.

## 60-Second Demo

1. **Open the app** in your browser (http://localhost:8501)
2. **Paste a 2-page memo**, upload a `.txt`/`.md` file, or click "Load Sample Policy"
3. **Enter your OpenAI API key** in the sidebar
4. **Click "Run Multi-Agent Analysis"**
5. **Watch 4 AI agents run in parallel** to generate summary, risks, budget, and citizen brief in under a minute

## Features

- **📄 Document Upload**: Paste text, upload a file, or load sample policies
- **🤖 Multi-Agent Analysis**: 4 specialized AI agents analyze different aspects concurrently
- **⚡ Real-time Processing**: Complete analysis in under 60 seconds
- **📊 Performance Metrics**: Real token usage (from the API) and wall-clock time
- **💾 Export Options**: Download results as Markdown or plain text
- **🔒 Privacy First**: No data storage, in-memory processing only

## Pricing Ideas

- **Per Analysis**: $15-$49 per brief
- **Seat License**: $99-$499 per user/month
- **Enterprise**: Custom pricing for government departments

## Architecture

```
gov-aix/
├── app.py                 # Main Streamlit application
├── agents/
│   ├── base.py            # Shared agent runner (prompting, usage, errors)
│   ├── summarizer.py      # Executive summary generation
│   ├── compliance.py      # Risk and compliance analysis
│   ├── budget.py          # Budget and resource planning
│   └── comms.py           # Public communication creation
├── utils/
│   └── metrics.py         # Performance tracking utilities
├── samples/
│   └── policy.txt         # Sample government policy
├── tests/                 # pytest suite (agents + Streamlit AppTest)
├── requirements.txt       # Python dependencies
└── requirements-dev.txt   # Test dependencies
```

## Agent Capabilities

### 📝 Summarizer Agent
- Creates 6-10 bullet point summaries
- Generates 3-sentence executive overviews
- Focuses on objectives, timeline, and stakeholders

### ⚖️ Compliance Agent  
- Identifies 10 clarity and process risks
- Flags missing owners, deadlines, and conflicts
- Highlights documentation gaps and ambiguities

### 💰 Budget Agent
- Creates detailed workstream tables
- Estimates timelines, costs, and dependencies
- Provides 3 cost-saving recommendations

### 📢 Communications Agent
- Writes 150-200 word citizen announcements
- Creates 5 FAQ Q&A pairs
- Uses clear, jargon-free language

## Roadmap

- **Audit Logs**: Track all analysis requests and results
- **On-Prem Models**: Support for local LLM deployment
- **Custom Agents**: User-defined analysis modules
- **API Access**: RESTful API for integration
- **Multi-Language**: Support for non-English documents

## Built With

- **Python 3.11+**: Core language
- **Streamlit**: Web interface framework
- **OpenAI**: GPT-4o-mini and GPT-4o models
- **No Database**: In-memory processing for privacy

### Frontend
- **Next.js 16** + **React 19**
- **TypeScript**
- **Tailwind CSS**

---

## Deployment (Next.js)

- When deploying to Vercel, set the project Root Directory to `govaix-next`.
- Install: `npm ci`
- Build: `npm run build`
- Output: `.next`

---

## Continuous Integration

`.github/workflows/ci.yml` runs the pytest suite and the Next.js lint, typecheck,
build and production dependency audit on every push to `main` and every pull request.

## Support

For questions or issues, please refer to the documentation or contact the development team.

---

**Built at VIBE25 Tokyo · GovAIx**