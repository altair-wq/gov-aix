import openai, sys, os
from typing import Dict
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.metrics import timed_call, token_count

COMMS_PROMPT = """Create a citizen-friendly public announcement (150-200 words) about this government policy, plus 5 frequently asked questions with answers.

The announcement should:
- Use clear, jargon-free language
- Explain what citizens need to know
- Highlight key benefits and timeline
- Include contact information or next steps

The FAQ should address common concerns and provide practical information.

Document:
{}

Make it accessible and reassuring for the general public."""

def run(text: str, model: str = "gpt-4o-mini", temp: float = 0.3) -> Dict:
    """Generate citizen-friendly communications"""
    try:
        client, prompt = openai.OpenAI(), COMMS_PROMPT.format(text)
        response, ms = timed_call(client.chat.completions.create, model=model, messages=[{"role": "user", "content": prompt}], temperature=temp, max_tokens=500)
        content = response.choices[0].message.content
        return {"title": "Public Communications", "content": content, "tokens_in": token_count(prompt), "tokens_out": token_count(content), "latency_ms": ms}
    except Exception as e:
        return {"title": "Public Communications", "content": f"Error generating communications: {str(e)}", "tokens_in": token_count(text), "tokens_out": 0, "latency_ms": 0}