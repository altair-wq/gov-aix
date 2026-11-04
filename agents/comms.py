"""Public Communications agent."""
from typing import Any, Dict, Optional

from agents.base import DEFAULT_MODEL, DEFAULT_TEMPERATURE, AgentSpec, run_agent

COMMS_PROMPT = """Create a citizen-friendly public announcement (150-200 words) about this government policy, plus 5 frequently asked questions with answers.

The announcement should:
- Use clear, jargon-free language
- Explain what citizens need to know
- Highlight key benefits and timeline
- Include contact information or next steps

The FAQ should address common concerns and provide practical information.

Make it accessible and reassuring for the general public."""

SPEC = AgentSpec(title="Public Communications", instructions=COMMS_PROMPT)


def run(text: str, model: str = DEFAULT_MODEL, temp: float = DEFAULT_TEMPERATURE, *,
        api_key: Optional[str] = None, client: Optional[Any] = None) -> Dict[str, Any]:
    """Generate citizen-friendly communications"""
    return run_agent(SPEC, text, model, temp, api_key=api_key, client=client)
