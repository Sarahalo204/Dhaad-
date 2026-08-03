from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import json
from groq import Groq
from app.core.config import settings

router = APIRouter()
client = Groq(api_key=settings.GROQ_API_KEY)

class WordRequest(BaseModel):
    word: str

class WordRelationshipResponse(BaseModel):
    word: str
    synonyms: List[str]
    antonyms: List[str]
    related: List[str]
    root: str
    pattern: str
    usages: List[str]
    examples: List[str]

@router.post("/word-relationships", response_model=WordRelationshipResponse)
async def get_word_relationships(request: WordRequest):
    try:
        prompt = f"""
        You are an expert in Arabic lexicography and linguistics.
        Analyze the word: "{request.word}" and provide the following relationships in JSON format ONLY:
        {{
            "word": "The original word",
            "synonyms": ["مرادف1", "مرادف2", "مرادف3"],
            "antonyms": ["ضد1", "ضد2"],
            "related": ["كلمة قريبة1", "كلمة قريبة2"],
            "root": "الجذر",
            "pattern": "الوزن",
            "usages": ["استخدام شائع 1", "استخدام شائع 2"],
            "examples": ["مثال 1", "مثال 2"]
        }}
        Do not include any other text, markdown blocks, or explanations outside the JSON object.
        """
        
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that only outputs raw valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
            max_tokens=1024,
            response_format={"type": "json_object"}
        )
        
        response_text = completion.choices[0].message.content.strip()
        data = json.loads(response_text)
        
        return WordRelationshipResponse(**data)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
