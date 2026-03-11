"""
Parser Service – Reads CSV / XLSX binary content and converts it to
structured text suitable for AI consumption.
"""

import io
import pandas as pd


MAX_ROWS_FOR_AI = 500  # Cap rows to avoid exceeding token limits


def parse_file(contents: bytes, filename: str) -> str:
    """
    Parse the raw bytes of a CSV or XLSX file and return a structured
    text representation.

    Parameters
    ----------
    contents : bytes
        Raw file bytes.
    filename : str
        Original filename (used to determine the format).

    Returns
    -------
    str
        A formatted text block containing column headers and row data.

    Raises
    ------
    ValueError
        If the file cannot be parsed or contains no data.
    """
    ext = filename.rsplit(".", maxsplit=1)[-1].lower() if "." in filename else ""

    try:
        if ext == "csv":
            df = pd.read_csv(io.BytesIO(contents))
        elif ext in ("xlsx", "xls"):
            df = pd.read_excel(io.BytesIO(contents))
        else:
            raise ValueError(f"Unsupported file extension: .{ext}")
    except ValueError:
        raise
    except Exception as exc:
        raise ValueError(f"Failed to parse file: {exc}") from exc

    if df.empty:
        raise ValueError("The uploaded file contains no data rows.")

    # Drop completely empty columns / rows
    df = df.dropna(how="all", axis=1).dropna(how="all", axis=0)

    if df.empty:
        raise ValueError("The uploaded file contains no meaningful data after cleanup.")

    # Truncate for AI context window
    truncated = df.head(MAX_ROWS_FOR_AI)

    # Build structured text
    lines: list[str] = []
    lines.append(f"Dataset Overview: {len(df)} total rows, {len(df.columns)} columns")
    lines.append(f"Columns: {', '.join(df.columns.astype(str))}")
    lines.append("")

    # Statistical summary
    lines.append("--- Statistical Summary ---")
    lines.append(truncated.describe(include="all").to_string())
    lines.append("")

    # Sample rows
    lines.append(f"--- Data Sample ({len(truncated)} rows) ---")
    lines.append(truncated.to_string(index=False))

    return "\n".join(lines)
