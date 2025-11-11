import streamlit as st, os, time
from typing import Dict, List
from datetime import datetime
import agents.summarizer as summarizer, agents.compliance as compliance, agents.budget as budget, agents.comms as comms
from utils.metrics import format_stats

# Page config
st.set_page_config(
    page_title="GovAIx - Multi-Agent Government Analysis",
    page_icon="🏛️",
    layout="wide"
)

# Custom CSS
st.markdown("""<style>.stTabs [data-baseweb="tab-list"]{gap:24px}.stTabs [data-baseweb="tab"]{height:50px;padding:0 20px}.status-complete{color:#27ae60}.status-error{color:#e74c3c}</style>""", unsafe_allow_html=True)

# Initialize session state
for key, default in {'analysis_results': {}, 'total_tokens_in': 0, 'total_tokens_out': 0, 'total_latency': 0, 'run_log': []}.items():
    if key not in st.session_state:
        st.session_state[key] = default

# Sidebar
st.sidebar.title("🏛️ GovAIx")
st.sidebar.markdown("*Unified multi-agent platform for government analysis*")
st.sidebar.divider()

# API Configuration
api_key = st.sidebar.text_input("OpenAI API Key", type="password", help="Enter your OpenAI API key")
model = st.sidebar.selectbox("Model", ["gpt-4o-mini", "gpt-4o"], index=0)
temperature = st.sidebar.slider("Temperature", 0.0, 1.0, 0.3, 0.1)

st.sidebar.divider()

# Main content area
tab1, tab2, tab3 = st.tabs(["📄 Upload Document", "🤖 Agent Analysis", "📋 Final Brief"])

with tab1:
    st.header("Upload Government Document")
    st.markdown("*Prototype. Not legal advice.*")
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        document_text = st.text_area(
            "Paste your document text here:",
            height=300,
            placeholder="Paste the full text of your government policy, regulation, or document here..."
        )
    
    with col2:
        st.markdown("### Quick Start")
        if st.button("📋 Load Sample Policy", use_container_width=True):
            try:
                with open("samples/policy.txt", "r") as f:
                    sample_text = f.read()
                st.session_state.document_text = sample_text
                st.rerun()
            except FileNotFoundError:
                st.error("Sample file not found")
        
        st.markdown("**Tips:**")
        st.markdown("- Use the sample policy to test the system")
        st.markdown("- Paste full documents for best results")
        st.markdown("- Include budget/timeline details for better analysis")
    
    # Use session state for document text
    if 'document_text' in st.session_state:
        document_text = st.session_state.document_text
    
    st.divider()
    
    # Run button
    if st.button("🚀 Run Multi-Agent Analysis", type="primary", use_container_width=True, disabled=not api_key or not document_text):
        if not api_key:
            st.error("Please enter your OpenAI API key in the sidebar")
        elif not document_text:
            st.error("Please provide a document to analyze")
        else:
            # Set API key
            os.environ["OPENAI_API_KEY"] = api_key
            
            # Clear previous results
            st.session_state.analysis_results = {}
            st.session_state.total_tokens_in = 0
            st.session_state.total_tokens_out = 0
            st.session_state.total_latency = 0
            st.session_state.run_log = []
            
        # Run agents
            agents = [("Summarizer", summarizer), ("Compliance", compliance), ("Budget", budget), ("Communications", comms)]
            progress_bar, status_text = st.progress(0), st.empty()
            
            for i, (agent_name, agent_module) in enumerate(agents):
                status_text.text(f"Running {agent_name}...")
                progress_bar.progress((i + 0.5) / len(agents))
                start_time = time.time()
                st.session_state.run_log.append(f"[{datetime.now():%H:%M:%S}] Starting {agent_name}")
                
                try:
                    result = agent_module.run(document_text, model, temperature)
                    st.session_state.analysis_results[agent_name] = result
                    st.session_state.total_tokens_in += result["tokens_in"]
                    st.session_state.total_tokens_out += result["tokens_out"]
                    st.session_state.total_latency += result["latency_ms"]
                    elapsed = int((time.time() - start_time) * 1000)
                    st.session_state.run_log.append(f"[{datetime.now():%H:%M:%S}] {agent_name} completed in {elapsed}ms")
                except Exception as e:
                    st.session_state.analysis_results[agent_name] = {"title": f"{agent_name} Analysis", "content": f"Error: {str(e)}", "tokens_in": 0, "tokens_out": 0, "latency_ms": 0}
                    st.session_state.run_log.append(f"[{datetime.now():%H:%M:%S}] {agent_name} failed: {str(e)}")
                
                progress_bar.progress((i + 1) / len(agents))
            
            status_text.text("Analysis complete! 🎉")
            st.success(f"Analysis completed in {st.session_state.total_latency}ms")
            
            # Switch to Agents tab
            st.session_state.current_tab = 1
            st.rerun()

with tab2:
    st.header("Agent Analysis Results")
    
    if st.session_state.analysis_results:
# Display results
        col1, col2 = st.columns(2)
        agents_display = [("Summarizer", "📝", col1), ("Compliance", "⚖️", col2), ("Budget", "💰", col1), ("Communications", "📢", col2)]
        
        for agent_name, icon, col in agents_display:
            with col:
                if agent_name in st.session_state.analysis_results:
                    result = st.session_state.analysis_results[agent_name]
                    status_html = f'<span class="status-error">❌ {icon} {agent_name}</span>' if "Error" in result["content"] else f'<span class="status-complete">✅ {icon} {agent_name}</span>'
                    st.markdown(f"### {status_html}", unsafe_allow_html=True)
                    st.caption(f"📊 {format_stats(result['tokens_in'], result['tokens_out'], result['latency_ms'])}")
                    st.markdown(result["content"])
                else:
                    st.markdown(f"### ⏳ {icon} {agent_name}")
                    st.info("Waiting for analysis...")
        
        # Total stats
        st.divider()
        total_stats = format_stats(
            st.session_state.total_tokens_in,
            st.session_state.total_tokens_out,
            st.session_state.total_latency
        )
        st.markdown(f"**Total Analysis:** {total_stats}")
        
    else:
        st.info("Run the analysis on the Upload tab to see results here")

with tab3:
    st.header("Executive Brief")
    
    if st.session_state.analysis_results:
# Generate final brief
        brief_content = f"""# Executive Brief: Government Document Analysis
Generated on {datetime.now():%Y-%m-%d %H:%M:%S}
---
## Executive Overview
{st.session_state.analysis_results.get('Summarizer', {}).get('content', 'No summary available')}
---
## Compliance & Risk Assessment
{st.session_state.analysis_results.get('Compliance', {}).get('content', 'No compliance analysis available')}
---
## Budget & Resource Planning
{st.session_state.analysis_results.get('Budget', {}).get('content', 'No budget analysis available')}
---
## Public Communication Strategy
{st.session_state.analysis_results.get('Communications', {}).get('content', 'No communications analysis available')}
---
## Analysis Summary
- **Total Processing Time:** {st.session_state.total_latency}ms
- **Total Tokens Used:** {st.session_state.total_tokens_in + st.session_state.total_tokens_out:,}
- **Agents Deployed:** 4
- **Analysis Status:** Complete
---
*This analysis was generated by GovAIx, a multi-agent AI platform for government document analysis.*"""
        
        # Display brief
        st.markdown(brief_content)
        
# Download buttons
        col1, col2 = st.columns(2)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        with col1:
            st.download_button("📥 Download as Markdown", brief_content, f"gov_analysis_{timestamp}.md", "text/markdown", use_container_width=True)
        with col2:
            plain_text = brief_content.replace('#', '').replace('**', '').replace('*', '')
            st.download_button("📄 Download as Text", plain_text, f"gov_analysis_{timestamp}.txt", "text/plain", use_container_width=True)
        
        # Runtime progress bar
        if st.session_state.total_latency > 0:
            st.divider()
            st.markdown("**Analysis Runtime**")
            st.progress(min(1.0, st.session_state.total_latency / 10000))
            st.caption(f"Completed in {st.session_state.total_latency}ms")
            
    else:
        st.info("Complete the analysis to generate the executive brief")

# Footer
st.divider()
st.markdown("Built at VIBE25 Tokyo · GovAIx")

# Run log expander (nice-to-have)
if st.session_state.run_log:
    with st.expander("🔍 View Run Log"):
        for log_entry in st.session_state.run_log:
            st.text(log_entry)