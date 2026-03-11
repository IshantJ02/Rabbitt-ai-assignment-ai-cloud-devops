"""
/analyze endpoint – handles file upload, AI analysis, and email delivery.
"""

import os
from fastapi import APIRouter, File, Form, UploadFile, HTTPException, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from schemas.request_schema import AnalyzeResponse
from services.parser_service import parse_file
from services.ai_service import generate_summary
from services.email_service import send_email
from utils.security import (
    validate_file_type,
    validate_file_size,
    validate_email,
    sanitize_text,
)

router = APIRouter(prefix="", tags=["Analysis"])

limiter = Limiter(key_func=get_remote_address)

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


@router.post(
    "/analyze",
    response_model=AnalyzeResponse,
    summary="Analyze a sales dataset and email the executive summary",
    description=(
        "Upload a CSV or XLSX file along with a recipient email address. "
        "The system parses the dataset, sends it to an AI model for analysis, "
        "and emails the resulting executive summary to the specified address."
    ),
)
@limiter.limit("10/minute")
async def analyze_sales_data(
    request: Request,
    file: UploadFile = File(..., description="CSV or XLSX sales dataset (max 5 MB)"),
    email: str = Form(..., description="Recipient email address"),
):
    # 1 ── Validate email
    sanitized_email = sanitize_text(email)
    if not validate_email(sanitized_email):
        raise HTTPException(status_code=422, detail="Invalid email address.")

    # 2 ── Validate file type
    if not validate_file_type(file.filename or ""):
        raise HTTPException(
            status_code=422,
            detail="Unsupported file type. Only .csv and .xlsx files are accepted.",
        )

    # 3 ── Read & validate file size
    contents = await file.read()
    if not validate_file_size(contents, MAX_FILE_SIZE):
        raise HTTPException(
            status_code=422,
            detail=f"File exceeds the maximum allowed size of {MAX_FILE_SIZE // (1024 * 1024)} MB.",
        )

    if len(contents) == 0:
        raise HTTPException(status_code=422, detail="Uploaded file is empty.")

    # 4 ── Parse dataset
    try:
        dataset_text = parse_file(contents, file.filename or "data.csv")
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))

    # 5 ── AI analysis
    try:
        summary = await generate_summary(dataset_text)
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"AI analysis failed: {str(exc)}",
        )

    # 6 ── Send email
    try:
        await send_email(sanitized_email, summary)
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Email delivery failed: {str(exc)}",
        )

    # 7 ── Return response
    return AnalyzeResponse(status="success", summary=summary)
