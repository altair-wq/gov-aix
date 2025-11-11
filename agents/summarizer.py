import openai, sys, os
from typing import Dict
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.metrics import timed_call, token_count

SUMMARIZER_PROMPT = """Summarize the following government document in 6-10 concise bullet points plus a 3-sentence overview. Focus on key objectives, timeline, stakeholders, and implementation details.

Document:
{}

Provide a clear, executive-friendly summary that captures the essence of the policy."""

def run(text: str, model: str = "gpt-4o-mini", temp: float = 0.3) -> Dict:
    """Summarize government document with bullets and overview"""
    try:
        client, prompt = openai.OpenAI(), SUMMARIZER_PROMPT.format(text)
        response, ms = timed_call(client.chat.completions.create, model=model, messages=[{"role": "user", "content": prompt}], temperature=temp, max_tokens=500)
        content = response.choices[0].message.content
        return {"title": "Executive Summary", "content": content, "tokens_in": token_count(prompt), "tokens_out": token_count(content), "latency_ms": ms}
    except Exception as e:
        return {"title": "Executive Summary", "content": f"Error generating summary: {str(e)}", "tokens_in": token_count(text), "tokens_out": 0, "latency_ms": 0}