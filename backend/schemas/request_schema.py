"""
Pydantic response schemas for the /analyze endpoint.
"""

from pydantic import BaseModel, Field


class AnalyzeResponse(BaseModel):
    """Successful analysis response."""

    status: str = Field(
        ...,
        description="Result status – 'success' or 'error'.",
        examples=["success"],
    )
    summary: str = Field(
        ...,
        description="AI-generated executive summary of the sales dataset.",
        examples=[
            "Revenue grew 12 % QoQ driven by the East region. "
            "Product X was the top performer …"
        ],
    )


class ErrorResponse(BaseModel):
    """Standard error response."""

    detail: str = Field(
        ...,
        description="Human-readable error message.",
        examples=["Unsupported file type. Only .csv and .xlsx files are accepted."],
    )
