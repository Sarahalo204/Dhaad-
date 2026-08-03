from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import os
from groq import Groq
from app.core.config import settings

router = APIRouter()

client = Groq(api_key=settings.GROQ_API_KEY)

class AnalyzeRequest(BaseModel):
    sentence: str

class WordAnalysis(BaseModel):
    id: str
    word: str
    pos: str
    irab: str
    explanation: str
    root: str | None = None
    pattern: str | None = None
    tense: str | None = None
    number: str | None = None
    gender: str | None = None
    case: str | None = None

class AnalyzeResponse(BaseModel):
    sentence: str
    words: List[WordAnalysis]
    edges: List[Dict[str, Any]] # For React Flow: {id: 'e1-2', source: '1', target: '2', label: 'subject'}

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_sentence(request: AnalyzeRequest):
    try:
        # We will use Groq LLM to parse the sentence into a structured JSON format
        # compatible with our WordAnalysis model and React Flow graph.
        
        prompt = f"""
        You are an expert in Arabic grammar (I'rab) and linguistics. 
        Analyze the following Arabic sentence and provide the output ONLY in valid JSON format.
        Sentence: "{request.sentence}"
        
        The JSON must match this structure exactly:
        {{
            "words": [
                {{
                    "id": "1", // Sequential ID starting from 1
                    "word": "The word",
                    "pos": "Part of speech (e.g. فعل ماض, اسم مجرور)",
                    "irab": "Grammatical case / I'rab",
                    "explanation": "Simple explanation of why this I'rab applies",
                    "root": "Root of the word (e.g. ك ت ب)",
                    "pattern": "Morphological pattern (e.g. فَعَلَ)",
                    "tense": "Tense if verb (e.g. ماض, مضارع) else null",
                    "number": "Number (e.g. مفرد, مثنى, جمع) else null",
                    "gender": "Gender (e.g. مذكر, مؤنث) else null",
                    "case": "Grammatical case (e.g. مرفوع, منصوب, مجرور, مجزوم, مبني)"
                }}
            ],
            "edges": [
                {{
                    "id": "e1-2",
                    "source": "1", // ID of the parent word
                    "target": "2", // ID of the dependent word
                    "label": "Relationship (e.g. فاعل, مفعول به)"
                }}
            ]
        }}
        
        Ensure that the relationships in "edges" build a correct dependency tree.
        Do not include any other text, markdown blocks like ```json, or explanations outside the JSON object.
        """
        
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile", # Using the latest supported Llama model on Groq
            messages=[
                {"role": "system", "content": "You are a helpful assistant that only outputs raw valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,
            max_tokens=2048,
            response_format={"type": "json_object"}
        )
        
        response_text = completion.choices[0].message.content.strip()
        
        import json
        try:
            # Sometime LLMs still output markdown blocks
            if response_text.startswith("```json"):
                response_text = response_text[7:-3].strip()
            elif response_text.startswith("```"):
                response_text = response_text[3:-3].strip()
            
            data = json.loads(response_text)
            return AnalyzeResponse(
                sentence=request.sentence,
                words=data.get("words", []),
                edges=data.get("edges", [])
            )
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="Failed to parse LLM response into JSON")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
