from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
from groq import Groq
from app.core.config import settings

router = APIRouter()
client = Groq(api_key=settings.GROQ_API_KEY)

class ExplainRequest(BaseModel):
    sentence: str
    word: str
    irab: str
    level: str # 'طفل', 'متوسط', 'متقدم', 'متخصص'

class ExplainResponse(BaseModel):
    explanation: str

@router.post("/explain", response_model=ExplainResponse)
async def explain_grammar(request: ExplainRequest):
    try:
        level_instructions = {
            "طفل": "اشرح الإعراب لطفل صغير في المدرسة الابتدائية بأسلوب قصصي ممتع وبسيط جداً بدون مصطلحات معقدة.",
            "متوسط": "اشرح الإعراب لطالب في المرحلة المتوسطة بأسلوب واضح ومباشر مع ذكر القاعدة الأساسية.",
            "متقدم": "اشرح الإعراب لطالب ثانوي أو جامعي مع تفصيل القاعدة وذكر أمثلة مشابهة والعلة النحوية.",
            "متخصص": "اشرح الإعراب بأسلوب أكاديمي متخصص مع ذكر المدارس النحوية (كالبصريين والكوفيين) إن لزم الأمر واستشهاد بأبيات من ألفية ابن مالك أو الشعر العربي."
        }
        
        instruction = level_instructions.get(request.level, level_instructions["متوسط"])
        
        prompt = f"""
        أنت معلم لغة عربية وخبير في النحو.
        الجملة: "{request.sentence}"
        الكلمة المراد شرحها: "{request.word}"
        الإعراب الخاص بها: "{request.irab}"
        
        التعليمات:
        {instruction}
        
        أعد الإجابة بصيغة JSON فقط بالتنسيق التالي:
        {{
            "explanation": "شرحك هنا"
        }}
        """
        
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that only outputs raw valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=1024,
            response_format={"type": "json_object"}
        )
        
        data = json.loads(completion.choices[0].message.content.strip())
        
        return ExplainResponse(explanation=data.get("explanation", ""))
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
