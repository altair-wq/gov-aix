import time
from typing import Any, Tuple

def timed_call(fn, *args, **kwargs) -> Tuple[Any, int]:
    """Time function execution and return (result, milliseconds)"""
    start = time.time()
    result = fn(*args, **kwargs)
    return result, int((time.time() - start) * 1000)

def token_count(text: str) -> int:
    """Simple token counter using word count"""
    return len(text.split())

def format_stats(tokens_in: int, tokens_out: int, ms: int) -> str:
    """Format performance stats"""
    return f"in:{tokens_in} out:{tokens_out} {ms}ms"