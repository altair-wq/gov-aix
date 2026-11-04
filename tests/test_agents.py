import pytest

import agents.budget as budget
import agents.comms as comms
import agents.compliance as compliance
import agents.summarizer as summarizer
from agents.base import MAX_DOCUMENT_CHARS

ALL = [summarizer, compliance, budget, comms]


@pytest.mark.parametrize("mod", ALL)
def test_success_uses_real_usage_and_wraps_document(mod, fake_client):
    client = fake_client(content="# Result")
    result = mod.run("Policy text here", "gpt-4o-mini", 0.2, client=client)
    assert result["error"] is None
    assert result["content"] == "# Result"
    assert (result["tokens_in"], result["tokens_out"]) == (123, 45)
    call = client.chat.completions.calls[0]
    assert call["model"] == "gpt-4o-mini" and call["temperature"] == 0.2
    assert call["messages"][0]["role"] == "system"
    assert "<document>\nPolicy text here\n</document>" in call["messages"][1]["content"]
    assert "{}" not in call["messages"][1]["content"]


@pytest.mark.parametrize("mod", ALL)
def test_api_failure_is_reported_not_raised(mod, fake_client):
    result = mod.run("text", client=fake_client(exc=RuntimeError("boom")))
    assert result["error"] == "RuntimeError: boom"
    assert result["content"].startswith("Error generating")
    assert result["tokens_in"] == 0


def test_empty_document_skips_api_call(fake_client):
    client = fake_client()
    result = summarizer.run("   ", client=client)
    assert result["error"] and client.chat.completions.calls == []


def test_truncation_is_flagged(fake_client):
    result = budget.run("x", client=fake_client(content="table", finish_reason="length"))
    assert "truncated" in result["content"]


def test_oversized_document_is_clipped(fake_client):
    client = fake_client()
    compliance.run("a" * (MAX_DOCUMENT_CHARS + 500), client=client)
    assert client.chat.completions.calls[0]["messages"][1]["content"].count("a") <= MAX_DOCUMENT_CHARS + 50


def test_document_with_braces_is_safe(fake_client):
    # The old str.format-based prompts would choke on templates; make sure braces pass through.
    client = fake_client()
    assert comms.run("Budget {FY2026} is {} TBD", client=client)["error"] is None
