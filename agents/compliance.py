"""Compliance & Risk Assessment agent."""
from typing import Any, Dict, Optional

from agents.base import DEFAULT_MODEL, DEFAULT_TEMPERATURE, AgentSpec, run_agent

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

List each risk with a brief explanation and potential impact."""

SPEC = AgentSpec(title="Compliance & Risk Assessment", instructions=COMPLIANCE_PROMPT)


def run(text: str, model: str = DEFAULT_MODEL, temp: float = DEFAULT_TEMPERATURE, *,
        api_key: Optional[str] = None, client: Optional[Any] = None) -> Dict[str, Any]:
    """Identify compliance risks and process gaps"""
    return run_agent(SPEC, text, model, temp, api_key=api_key, client=client)
