from fastapi import APIRouter, HTTPException, UploadFile, File
import os
from groq import Groq
from app.core.config import settings

router = APIRouter()
client = Groq(api_key=settings.GROQ_API_KEY)

@router.post("/speech-to-text")
async def transcribe_audio(file: UploadFile = File(...)):
    try:
        # Save temporary file because Groq requires a file-like object with a filename
        file_location = f"temp_{file.filename}"
        with open(file_location, "wb") as f:
            f.write(await file.read())
            
        with open(file_location, "rb") as f:
            transcription = client.audio.transcriptions.create(
                file=(file_location, f.read()),
                model="whisper-large-v3",
                language="ar"
            )
            
        # Clean up
        os.remove(file_location)
        
        return {"text": transcription.text}
        
    except Exception as e:
        if os.path.exists(file_location):
            os.remove(file_location)
        raise HTTPException(status_code=500, detail=str(e))
