from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
from groq import Groq
from app.core.config import settings

router = APIRouter()
client = Groq(api_key=settings.GROQ_API_KEY)

class ChallengeRequest(BaseModel):
    level: int # User's level to determine difficulty
    topic: str | None = None # e.g. "إعراب المبتدأ والخبر", "المفاعيل"
    previous_sentences: list[str] | None = None

class ChallengeResponse(BaseModel):
    sentence: str
    options: list[str]
    answer: str
    explanation: str

@router.post("/generate-challenge", response_model=ChallengeResponse)
async def generate_challenge(request: ChallengeRequest):
    try:
        difficulty = "مبتدئ جداً وسهل (للمرحلة الابتدائية)"
        if request.level > 5:
            difficulty = "متوسط (للمرحلة الإعدادية)"
        if request.level > 10:
            difficulty = "متقدم (للمرحلة الثانوية)"
            
        topic_instruction = f"حول موضوع: {request.topic}" if request.topic else "في قواعد النحو الأساسية"
        avoid_instruction = ""
        if request.previous_sentences and len(request.previous_sentences) > 0:
            avoid_instruction = f"\nتحذير هام جداً: لا تقم بتوليد أي جملة مشابهة أو قريبة من هذه الجمل السابقة:\n{', '.join(request.previous_sentences)}\nنريد جملة مختلفة تماماً وموضوعاً مختلفاً."
            
        prompt = f"""
        أنت صانع ألعاب تعليمية خبير في اللغة العربية والنحو.
        قم بتوليد سؤال تحدي "املأ الفراغ" أو "اختر الإجابة الصحيحة".
        مستوى الصعوبة المطلوب: {difficulty}
        الموضوع: {topic_instruction}
        {avoid_instruction}
        
        قم بإنشاء جملة فيها كلمة مفقودة يمثلها فراغ (_____)، أو سؤال مباشر حول إعراب جملة.
        يجب أن تقدم 3 خيارات (options)، وإجابة صحيحة واحدة (answer) تطابق أحد الخيارات تماماً، وشرح بسيط للسبب (explanation).
        
        أعد الإجابة بصيغة JSON فقط بالتنسيق التالي:
        {{
            "sentence": "ذهب _____ إلى المدرسة.",
            "options": ["الولدُ", "الولدَ", "الولدِ"],
            "answer": "الولدُ",
            "explanation": "لأنه فاعل مرفوع وعلامة رفعه الضمة الظاهرة."
        }}
        لا تضف أي نصوص أخرى خارج الـ JSON.
        """
        
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that only outputs raw valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7, # Higher temperature for varied questions
            max_tokens=1024,
            response_format={"type": "json_object"}
        )
        
        data = json.loads(completion.choices[0].message.content.strip())
        
        return ChallengeResponse(
            sentence=data.get("sentence", ""),
            options=data.get("options", []),
            answer=data.get("answer", ""),
            explanation=data.get("explanation", "")
        )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
