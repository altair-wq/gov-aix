"""Budget & Resource Analysis agent."""
from typing import Any, Dict, Optional

from agents.base import DEFAULT_MODEL, DEFAULT_TEMPERATURE, AgentSpec, run_agent

BUDGET_PROMPT = """Analyze this government document and create a detailed budget analysis with:

1. A markdown table with columns: Workstream | Weeks | Cost | Dependencies | Risk Level
2. Three cost-saving recommendations

Focus on identifying all workstreams, estimating realistic timelines and costs, noting dependencies between activities, and assessing risk levels for each component. Use figures stated in the document wherever possible; when you must estimate, label the value as "(est.)" so readers can tell sourced numbers from assumptions.

Provide specific, actionable budget insights for government decision-makers."""

SPEC = AgentSpec(title="Budget & Resource Analysis", instructions=BUDGET_PROMPT)


def run(text: str, model: str = DEFAULT_MODEL, temp: float = DEFAULT_TEMPERATURE, *,
        api_key: Optional[str] = None, client: Optional[Any] = None) -> Dict[str, Any]:
    """Analyze budget and resource requirements"""
    return run_agent(SPEC, text, model, temp, api_key=api_key, client=client)
