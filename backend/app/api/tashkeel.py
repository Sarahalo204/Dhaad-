from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from groq import Groq
from app.core.config import settings
import json

router = APIRouter()
client = Groq(api_key=settings.GROQ_API_KEY)

class TashkeelRequest(BaseModel):
    sentence: str

@router.post("/tashkeel")
async def process_tashkeel(request: TashkeelRequest):
    if not request.sentence.strip():
        raise HTTPException(status_code=400, detail="Sentence cannot be empty")
        
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "أنت خبير في النحو العربي والتشكيل. مهمتك الوحيدة هي أخذ الجملة غير المشكّلة وإرجاعها مشكّلة تشكيلاً كاملاً وصحيحاً لغوياً ونحوياً. أرجع النص المشكل فقط بدون أي كلام إضافي أو علامات اقتباس."
                },
                {
                    "role": "user",
                    "content": request.sentence
                }
            ],
            temperature=0.1,
            max_tokens=500,
        )
        
        tashkeel_result = completion.choices[0].message.content.strip()
        
        if tashkeel_result.startswith('"') and tashkeel_result.endswith('"'):
            tashkeel_result = tashkeel_result[1:-1]
        if tashkeel_result.startswith("'") and tashkeel_result.endswith("'"):
            tashkeel_result = tashkeel_result[1:-1]
            
        return {"tashkeel": tashkeel_result.strip()}

    except Exception as e:
        print("Groq Error:", e)
        raise HTTPException(status_code=500, detail="Failed to process tashkeel")
