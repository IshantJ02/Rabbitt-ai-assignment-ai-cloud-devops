"""
Security Utilities
===================
Input validation, sanitization, and file-safety helpers.
"""

import re
import html

# Allowed MIME-like extensions
ALLOWED_EXTENSIONS = {"csv", "xlsx"}

# RFC 5322-ish email regex (simplified but robust)
EMAIL_REGEX = re.compile(
    r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
)


def validate_file_type(filename: str) -> bool:
    """Return True if *filename* ends with an allowed extension."""
    if not filename or "." not in filename:
        return False
    ext = filename.rsplit(".", maxsplit=1)[-1].lower()
    return ext in ALLOWED_EXTENSIONS


def validate_file_size(contents: bytes, max_bytes: int) -> bool:
    """Return True if *contents* does not exceed *max_bytes*."""
    return len(contents) <= max_bytes


def validate_email(email: str) -> bool:
    """Return True if *email* looks like a valid email address."""
    if not email or len(email) > 320:
        return False
    return bool(EMAIL_REGEX.match(email))


def sanitize_text(text: str) -> str:
    """
    Sanitize user-supplied text:
    - Strip leading/trailing whitespace
    - Escape HTML entities
    - Collapse multiple spaces
    """
    text = text.strip()
    text = html.escape(text)
    text = re.sub(r"\s+", " ", text)
    return text
