import openai, sys, os
from typing import Dict
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.metrics import timed_call, token_count

BUDGET_PROMPT = """Analyze this government document and create a detailed budget analysis with:

1. A markdown table with columns: Workstream | Weeks | Cost | Dependencies | Risk Level
2. Three cost-saving recommendations

Focus on identifying all workstreams, estimating realistic timelines and costs, noting dependencies between activities, and assessing risk levels for each component.

Document:
{}

Provide specific, actionable budget insights for government decision-makers."""

def run(text: str, model: str = "gpt-4o-mini", temp: float = 0.3) -> Dict:
    """Analyze budget and resource requirements"""
    try:
        client, prompt = openai.OpenAI(), BUDGET_PROMPT.format(text)
        response, ms = timed_call(client.chat.completions.create, model=model, messages=[{"role": "user", "content": prompt}], temperature=temp, max_tokens=500)
        content = response.choices[0].message.content
        return {"title": "Budget & Resource Analysis", "content": content, "tokens_in": token_count(prompt), "tokens_out": token_count(content), "latency_ms": ms}
    except Exception as e:
        return {"title": "Budget & Resource Analysis", "content": f"Error generating budget analysis: {str(e)}", "tokens_in": token_count(text), "tokens_out": 0, "latency_ms": 0}