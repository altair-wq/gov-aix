import sys
from pathlib import Path
from types import SimpleNamespace

import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))


class FakeCompletions:
    def __init__(self, content="**ok**", finish_reason="stop", exc=None):
        self.content, self.finish_reason, self.exc = content, finish_reason, exc
        self.calls = []

    def create(self, **kwargs):
        self.calls.append(kwargs)
        if self.exc:
            raise self.exc
        return SimpleNamespace(
            choices=[SimpleNamespace(message=SimpleNamespace(content=self.content), finish_reason=self.finish_reason)],
            usage=SimpleNamespace(prompt_tokens=123, completion_tokens=45),
        )


class FakeClient:
    def __init__(self, **kwargs):
        self.chat = SimpleNamespace(completions=FakeCompletions(**kwargs))


@pytest.fixture
def fake_client():
    return FakeClient


@pytest.fixture
def root():
    return ROOT
