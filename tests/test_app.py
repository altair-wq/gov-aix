import openai
import pytest
from streamlit.testing.v1 import AppTest


@pytest.fixture
def app(root, fake_client, monkeypatch):
    created = []

    def factory(**kwargs):
        c = fake_client(content="Agent output")
        c.kwargs = kwargs
        created.append(c)
        return c

    monkeypatch.setattr(openai, "OpenAI", factory)
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    at = AppTest.from_file(str(root / "app.py"), default_timeout=30)
    at.created_clients = created
    return at.run()


def _button(at, label):
    return next(b for b in at.button if label in b.label)


def test_load_sample_populates_editable_text_area(app, root):
    _button(app, "Load Sample").click().run()
    sample = (root / "samples" / "policy.txt").read_text(encoding="utf-8")
    assert app.text_area[0].value == sample
    app.text_area[0].input("My edited doc").run()
    assert app.text_area[0].value == "My edited doc"


def test_run_disabled_without_key(app):
    _button(app, "Load Sample").click().run()
    assert _button(app, "Run Multi-Agent").disabled


def test_full_run_produces_brief_and_passes_key_per_client(app):
    app.sidebar.text_input[0].input("sk-test").run()
    app.text_area[0].input("Some policy").run()
    _button(app, "Run Multi-Agent").click().run()
    assert not app.exception
    results = app.session_state.analysis_results
    assert set(results) == {"Summarizer", "Compliance", "Budget", "Communications"}
    assert all(r["error"] is None for r in results.values())
    assert app.session_state.total_tokens_in == 4 * 123
    assert all(c.kwargs == {"api_key": "sk-test"} for c in app.created_clients)
    assert any("Analysis Status:** Complete" in m.value for m in app.markdown)
