"""
AI Service – Interfaces with the Groq API (Llama 3) to produce executive summaries.
"""

import os
from groq import AsyncGroq

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

SYSTEM_PROMPT = (
    "You are a senior business analyst. "
    "Analyze the following sales dataset and produce a concise executive summary highlighting:\n\n"
    "• Top performing products\n"
    "• Regional performance\n"
    "• Revenue trends\n"
    "• Anomalies\n"
    "• Actionable insights\n\n"
    "Return a professional executive summary formatted with clear sections and bullet points."
)


async def generate_summary(dataset_text: str) -> str:
    """
    Send the structured dataset text to Groq (Llama 3) and return the
    AI-generated executive summary.

    Raises
    ------
    RuntimeError
        If the API key is missing or the API call fails.
    """
    if not GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY environment variable is not set.")

    client = AsyncGroq(api_key=GROQ_API_KEY)

    user_prompt = f"Dataset:\n\n{dataset_text}\n\nReturn a professional executive summary."

    chat_completion = await client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.4,
        max_tokens=2048,
        top_p=1,
    )

    response_text = chat_completion.choices[0].message.content
    if not response_text:
        raise RuntimeError("AI returned an empty response.")

    return response_text.strip()
