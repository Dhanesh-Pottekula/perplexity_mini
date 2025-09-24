"""Retry utilities with exponential backoff."""

import asyncio
import json
import logging
from functools import wraps
from typing import Any, Callable, TypeVar

import httpx

# Set up logging
logger = logging.getLogger(__name__)

F = TypeVar('F', bound=Callable[..., Any])


def retry_with_exponential_backoff(
    max_retries: int = 3,
    base_delay: float = 1.0,
    max_delay: float = 60.0,
    backoff_factor: float = 2.0,
    exceptions: tuple = (httpx.HTTPError, httpx.RequestError, httpx.TimeoutException, json.JSONDecodeError, ValueError)
) -> Callable[[F], F]:
    """Decorator for retrying async functions with exponential backoff.
    
    Args:
        max_retries: Maximum number of retry attempts (default: 3)
        base_delay: Initial delay in seconds (default: 1.0)
        max_delay: Maximum delay in seconds (default: 60.0)
        backoff_factor: Multiplier for delay between retries (default: 2.0)
        exceptions: Tuple of exception types to retry on
        
    Returns:
        Decorated function with retry logic
    """
    def decorator(func: F) -> F:
        @wraps(func)
        async def wrapper(*args, **kwargs):
            last_exception = None
            
            for attempt in range(max_retries + 1):
                try:
                    return await func(*args, **kwargs)
                except exceptions as e:
                    last_exception = e
                    
                    if attempt == max_retries:
                        logger.error(f"Max retries ({max_retries}) exceeded for {func.__name__}. Last error: {e}")
                        raise e
                    
                    # Calculate delay with exponential backoff
                    delay = min(base_delay * (backoff_factor ** attempt), max_delay)
                    
                    logger.warning(
                        f"Attempt {attempt + 1} failed for {func.__name__}: {e}. "
                        f"Retrying in {delay:.2f} seconds..."
                    )
                    
                    await asyncio.sleep(delay)
            
            # This should never be reached, but just in case
            raise last_exception
        
        return wrapper
    return decorator
