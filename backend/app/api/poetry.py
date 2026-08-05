from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from groq import Groq
from app.core.config import settings

router = APIRouter()
client = Groq(api_key=settings.GROQ_API_KEY)

class PoetryRequest(BaseModel):
    verse: str

@router.post("/poetry")
async def analyze_poetry(request: PoetryRequest):
    if not request.verse.strip():
        raise HTTPException(status_code=400, detail="Verse cannot be empty")
        
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "أنت خبير في علم العروض والشعر العربي. مهمتك أخذ بيت من الشعر وتحليله. أرجع الرد بتنسيق JSON حصرياً يحتوي على المفاتيح التالية: 'meter' (البحر الشعري), 'rhyme' (القافية), 'explanation' (شرح مبسط للبيت والتقطيع العروضي)."
                },
                {
                    "role": "user",
                    "content": request.verse
                }
            ],
            response_format={"type": "json_object"},
            temperature=0.3,
            max_tokens=1024,
        )
        
        return completion.choices[0].message.content

    except Exception as e:
        print("Groq Error:", e)
        raise HTTPException(status_code=500, detail="Failed to process poetry analysis")
