import openai, sys, os
from typing import Dict
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.metrics import timed_call, token_count

COMPLIANCE_PROMPT = """Analyze this government document and identify 10 clarity or process risks. Focus on:
- Missing owners or unclear responsibilities
- Missing deadlines or vague timelines  
- Conflicts with existing policies
- Missing documentation or references
- Ambiguous language or undefined terms
- Resource allocation gaps
- Stakeholder consultation issues
- Implementation challenges
- Legal compliance gaps
- Risk mitigation omissions

Document:
{}

List each risk with a brief explanation and potential impact."""

def run(text: str, model: str = "gpt-4o-mini", temp: float = 0.3) -> Dict:
    """Identify compliance risks and process gaps"""
    try:
        client, prompt = openai.OpenAI(), COMPLIANCE_PROMPT.format(text)
        response, ms = timed_call(client.chat.completions.create, model=model, messages=[{"role": "user", "content": prompt}], temperature=temp, max_tokens=500)
        content = response.choices[0].message.content
        return {"title": "Compliance & Risk Assessment", "content": content, "tokens_in": token_count(prompt), "tokens_out": token_count(content), "latency_ms": ms}
    except Exception as e:
        return {"title": "Compliance & Risk Assessment", "content": f"Error generating compliance analysis: {str(e)}", "tokens_in": token_count(text), "tokens_out": 0, "latency_ms": 0}