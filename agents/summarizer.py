"""Executive Summary agent."""
from typing import Any, Dict, Optional

from agents.base import DEFAULT_MODEL, DEFAULT_TEMPERATURE, AgentSpec, run_agent

SUMMARIZER_PROMPT = """Summarize the following government document in 6-10 concise bullet points plus a 3-sentence overview. Focus on key objectives, timeline, stakeholders, and implementation details.

Provide a clear, executive-friendly summary that captures the essence of the policy."""

SPEC = AgentSpec(title="Executive Summary", instructions=SUMMARIZER_PROMPT)


def run(text: str, model: str = DEFAULT_MODEL, temp: float = DEFAULT_TEMPERATURE, *,
        api_key: Optional[str] = None, client: Optional[Any] = None) -> Dict[str, Any]:
    """Summarize government document with bullets and overview"""
    return run_agent(SPEC, text, model, temp, api_key=api_key, client=client)
