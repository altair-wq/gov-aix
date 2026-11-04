import os
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
from pathlib import Path

import streamlit as st

import agents.budget as budget
import agents.comms as comms
import agents.compliance as compliance
import agents.summarizer as summarizer
from utils.metrics import format_stats

BASE_DIR = Path(__file__).resolve().parent
SAMPLE_PATH = BASE_DIR / "samples" / "policy.txt"

# (name, icon, module, brief section heading)
AGENTS = [
    ("Summarizer", "📝", summarizer, "Executive Overview"),
    ("Compliance", "⚖️", compliance, "Compliance & Risk Assessment"),
    ("Budget", "💰", budget, "Budget & Resource Planning"),
    ("Communications", "📢", comms, "Public Communication Strategy"),
]

st.set_page_config(
    page_title="GovAIx - Multi-Agent Government Analysis",
    page_icon="🏛️",
    layout="wide",
)

st.markdown(
    """<style>.stTabs [data-baseweb="tab-list"]{gap:24px}.stTabs [data-baseweb="tab"]{height:50px;padding:0 20px}</style>""",
    unsafe_allow_html=True,
)

for key, default in {
    "analysis_results": {},
    "total_tokens_in": 0,
    "total_tokens_out": 0,
    "total_latency": 0,
    "wall_clock_ms": 0,
    "run_log": [],
    "document_text": "",
    "completed_at": None,
}.items():
    if key not in st.session_state:
        st.session_state[key] = default


def _default_api_key() -> str:
    """Prefer an operator-configured key (env or Streamlit secrets) if present."""
    try:
        if "OPENAI_API_KEY" in st.secrets:
            return st.secrets["OPENAI_API_KEY"]
    except Exception:  # noqa: BLE001 - no secrets.toml configured
        pass
    return os.environ.get("OPENAI_API_KEY", "")


def load_sample() -> None:
    try:
        st.session_state.document_text = SAMPLE_PATH.read_text(encoding="utf-8")
    except FileNotFoundError:
        st.session_state.sample_error = True


def load_upload() -> None:
    uploaded = st.session_state.get("uploaded_file")
    if uploaded is not None:
        st.session_state.document_text = uploaded.getvalue().decode("utf-8", errors="replace")


def log(message: str) -> None:
    st.session_state.run_log.append(f"[{datetime.now():%H:%M:%S}] {message}")


# Sidebar
st.sidebar.title("🏛️ GovAIx")
st.sidebar.markdown("*Unified multi-agent platform for government analysis*")
st.sidebar.divider()

env_key = _default_api_key()
api_key = st.sidebar.text_input(
    "OpenAI API Key",
    type="password",
    help="Used only for this session; never stored."
    + (" A server-configured key is in use if left blank." if env_key else ""),
) or env_key
model = st.sidebar.selectbox("Model", ["gpt-4o-mini", "gpt-4o"], index=0)
temperature = st.sidebar.slider("Temperature", 0.0, 1.0, 0.3, 0.1)
st.sidebar.divider()

tab1, tab2, tab3 = st.tabs(["📄 Upload Document", "🤖 Agent Analysis", "📋 Final Brief"])

with tab1:
    st.header("Upload Government Document")
    st.markdown("*Prototype. Not legal advice.*")

    col1, col2 = st.columns([2, 1])

    with col1:
        # Bound to session state via `key`, so loading a sample or file both
        # displays it and still lets the user edit it afterwards.
        document_text = st.text_area(
            "Paste your document text here:",
            key="document_text",
            height=300,
            placeholder="Paste the full text of your government policy, regulation, or document here...",
        )
        st.caption(f"{len(document_text.split()):,} words")

    with col2:
        st.markdown("### Quick Start")
        st.button("📋 Load Sample Policy", on_click=load_sample, width="stretch")
        if st.session_state.pop("sample_error", False):
            st.error("Sample file not found")
        st.file_uploader(
            "…or upload a .txt / .md file",
            type=["txt", "md"],
            key="uploaded_file",
            on_change=load_upload,
        )

        st.markdown("**Tips:**")
        st.markdown("- Use the sample policy to test the system")
        st.markdown("- Paste full documents for best results")
        st.markdown("- Include budget/timeline details for better analysis")

    st.divider()

    if not api_key:
        st.info("Enter your OpenAI API key in the sidebar to enable analysis.")

    if st.button(
        "🚀 Run Multi-Agent Analysis",
        type="primary",
        width="stretch",
        disabled=not api_key or not document_text.strip(),
    ):
        st.session_state.analysis_results = {}
        st.session_state.total_tokens_in = 0
        st.session_state.total_tokens_out = 0
        st.session_state.total_latency = 0
        st.session_state.run_log = []

        progress_bar, status_text = st.progress(0.0), st.empty()
        status_text.text(f"Running {len(AGENTS)} agents in parallel...")
        log(f"Starting {len(AGENTS)} agents in parallel ({model})")
        started = time.perf_counter()

        # Agents are independent, so run them concurrently. Streamlit calls
        # stay on the main thread; workers only talk to the OpenAI API.
        with ThreadPoolExecutor(max_workers=len(AGENTS)) as pool:
            futures = {
                pool.submit(mod.run, document_text, model, temperature, api_key=api_key): name
                for name, _, mod, _ in AGENTS
            }
            for done, future in enumerate(as_completed(futures), 1):
                name = futures[future]
                result = future.result()
                st.session_state.analysis_results[name] = result
                st.session_state.total_tokens_in += result["tokens_in"]
                st.session_state.total_tokens_out += result["tokens_out"]
                st.session_state.total_latency += result["latency_ms"]
                if result.get("error"):
                    log(f"{name} failed: {result['error']}")
                else:
                    log(f"{name} completed in {result['latency_ms']}ms")
                progress_bar.progress(done / len(AGENTS))
                status_text.text(f"{done}/{len(AGENTS)} agents finished (latest: {name})")

        st.session_state.wall_clock_ms = int((time.perf_counter() - started) * 1000)
        st.session_state.completed_at = datetime.now()
        failures = [n for n, r in st.session_state.analysis_results.items() if r.get("error")]
        if failures:
            st.warning(f"Finished with errors in: {', '.join(failures)}. See the Agent Analysis tab.")
        else:
            st.success(
                f"Analysis completed in {st.session_state.wall_clock_ms / 1000:.1f}s — "
                "open the **Agent Analysis** and **Final Brief** tabs."
            )

results = st.session_state.analysis_results

with tab2:
    st.header("Agent Analysis Results")

    if results:
        col1, col2 = st.columns(2)
        for i, (name, icon, _, _) in enumerate(AGENTS):
            with (col1 if i % 2 == 0 else col2):
                result = results.get(name)
                if result is None:
                    st.markdown(f"### ⏳ {icon} {name}")
                    st.info("Waiting for analysis...")
                    continue
                if result.get("error"):
                    st.markdown(f"### ❌ {icon} {name}")
                    st.error(result["content"])
                else:
                    st.markdown(f"### ✅ {icon} {name}")
                    st.caption(f"📊 {format_stats(result['tokens_in'], result['tokens_out'], result['latency_ms'])}")
                    st.markdown(result["content"])

        st.divider()
        total_stats = format_stats(
            st.session_state.total_tokens_in,
            st.session_state.total_tokens_out,
            st.session_state.wall_clock_ms,
        )
        st.markdown(f"**Total Analysis:** {total_stats} (wall clock)")
    else:
        st.info("Run the analysis on the Upload tab to see results here")

with tab3:
    st.header("Executive Brief")

    if results:
        completed_at = st.session_state.completed_at or datetime.now()
        failures = [n for n, r in results.items() if r.get("error")]
        sections = "\n---\n".join(
            f"## {heading}\n{results.get(name, {}).get('content', f'No {name.lower()} analysis available')}"
            for name, _, _, heading in AGENTS
        )
        status = "Complete" if not failures else f"Partial — failed: {', '.join(failures)}"
        brief_content = f"""# Executive Brief: Government Document Analysis
Generated on {completed_at:%Y-%m-%d %H:%M:%S} · Model: {model}
---
{sections}
---
## Analysis Summary
- **Total Processing Time:** {st.session_state.wall_clock_ms / 1000:.1f}s
- **Total Tokens Used:** {st.session_state.total_tokens_in + st.session_state.total_tokens_out:,}
- **Agents Deployed:** {len(AGENTS)}
- **Analysis Status:** {status}
---
*This analysis was generated by GovAIx, a multi-agent AI platform for government document analysis. Prototype — not legal advice; verify before acting.*"""

        st.markdown(brief_content)

        col1, col2 = st.columns(2)
        timestamp = completed_at.strftime("%Y%m%d_%H%M%S")
        with col1:
            st.download_button(
                "📥 Download as Markdown", brief_content, f"gov_analysis_{timestamp}.md", "text/markdown", width="stretch"
            )
        with col2:
            plain_text = brief_content.replace("#", "").replace("**", "").replace("*", "")
            st.download_button(
                "📄 Download as Text", plain_text, f"gov_analysis_{timestamp}.txt", "text/plain", width="stretch"
            )
    else:
        st.info("Complete the analysis to generate the executive brief")

st.divider()
st.markdown("Built at VIBE25 Tokyo · GovAIx")

if st.session_state.run_log:
    with st.expander("🔍 View Run Log"):
        for log_entry in st.session_state.run_log:
            st.text(log_entry)
