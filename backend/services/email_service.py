"""
Email Service – Sends the AI-generated summary via the Resend API.
"""

import os
import resend

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
EMAIL_FROM = os.getenv("EMAIL_FROM", "onboarding@resend.dev")


def _build_html_body(summary: str) -> str:
    """Construct a polished HTML email body."""
    # Convert newlines and bullet points to HTML for readability
    formatted = summary.replace("\n", "<br>")

    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Sales Data Executive Summary</title>
    </head>
    <body style="margin:0;padding:0;background-color:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:40px 0;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0"
                        style="background:linear-gradient(135deg,#1e293b 0%,#0f172a 100%);
                               border-radius:16px;border:1px solid #334155;overflow:hidden;">
                        <!-- Header -->
                        <tr>
                            <td style="padding:32px 40px 24px;border-bottom:1px solid #334155;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td>
                                            <span style="font-size:24px;font-weight:700;
                                                         background:linear-gradient(135deg,#818cf8,#6366f1,#a78bfa);
                                                         -webkit-background-clip:text;
                                                         -webkit-text-fill-color:transparent;">
                                                📊 Sales Insight Automator
                                            </span>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <!-- Body -->
                        <tr>
                            <td style="padding:32px 40px;">
                                <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 20px;">
                                    Hello,
                                </p>
                                <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 24px;">
                                    Here is the AI-generated analysis of the uploaded sales data:
                                </p>
                                <div style="background-color:#1e293b;border:1px solid #334155;
                                            border-radius:12px;padding:24px;margin:0 0 24px;">
                                    <p style="color:#e2e8f0;font-size:14px;line-height:1.8;margin:0;">
                                        {formatted}
                                    </p>
                                </div>
                            </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                            <td style="padding:24px 40px;border-top:1px solid #334155;">
                                <p style="color:#64748b;font-size:13px;line-height:1.5;margin:0;">
                                    Regards,<br />
                                    <strong style="color:#818cf8;">Sales Insight Automator</strong>
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """


async def send_email(recipient: str, summary: str) -> dict:
    """
    Send the executive summary to *recipient* via Resend.

    Raises
    ------
    RuntimeError
        If the API key is missing or the send fails.
    """
    if not RESEND_API_KEY:
        raise RuntimeError("RESEND_API_KEY environment variable is not set.")

    resend.api_key = RESEND_API_KEY

    params: resend.Emails.SendParams = {
        "from": EMAIL_FROM,
        "to": [recipient],
        "subject": "Sales Data Executive Summary",
        "html": _build_html_body(summary),
    }

    response = resend.Emails.send(params)
    return response  # type: ignore[return-value]
