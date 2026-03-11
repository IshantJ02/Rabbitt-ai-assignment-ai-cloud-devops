"""
Unit tests for utils.security module.
"""

import pytest
from utils.security import validate_email, validate_file_type, validate_file_size, sanitize_text


class TestValidateFileType:
    def test_csv_accepted(self):
        assert validate_file_type("sales_data.csv") is True

    def test_xlsx_accepted(self):
        assert validate_file_type("report.xlsx") is True

    def test_pdf_rejected(self):
        assert validate_file_type("document.pdf") is False

    def test_no_extension_rejected(self):
        assert validate_file_type("noextension") is False

    def test_empty_string_rejected(self):
        assert validate_file_type("") is False

    def test_double_extension(self):
        assert validate_file_type("file.tar.csv") is True

    def test_uppercase_extension(self):
        assert validate_file_type("DATA.CSV") is True


class TestValidateFileSize:
    def test_within_limit(self):
        data = b"x" * 1000
        assert validate_file_size(data, 5 * 1024 * 1024) is True

    def test_exceeds_limit(self):
        data = b"x" * (6 * 1024 * 1024)
        assert validate_file_size(data, 5 * 1024 * 1024) is False

    def test_exactly_at_limit(self):
        data = b"x" * (5 * 1024 * 1024)
        assert validate_file_size(data, 5 * 1024 * 1024) is True


class TestValidateEmail:
    def test_valid_email(self):
        assert validate_email("user@example.com") is True

    def test_valid_email_with_dots(self):
        assert validate_email("first.last@company.co.uk") is True

    def test_missing_at(self):
        assert validate_email("userexample.com") is False

    def test_missing_domain(self):
        assert validate_email("user@") is False

    def test_empty_email(self):
        assert validate_email("") is False

    def test_long_email_rejected(self):
        assert validate_email("a" * 321) is False


class TestSanitizeText:
    def test_strips_whitespace(self):
        assert sanitize_text("  hello  ") == "hello"

    def test_escapes_html(self):
        assert "&lt;" in sanitize_text("<script>alert('xss')</script>")

    def test_collapses_spaces(self):
        assert sanitize_text("hello     world") == "hello world"
