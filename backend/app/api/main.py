from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
import os
from pathlib import Path

# Project Imports
from app.utils.pdf_reader import get_pdf_text
from app.utils.text_chunker import get_text_chunks
from app.utils.generate_vector import generate_embedding_vector, load_pdf_vector
from app.utils.prompt_to_llm import prompt_to_llm


router = APIRouter()

PDF_FOLDER = "upload"
os.makedirs(PDF_FOLDER, exist_ok=True)


class UserQuery(BaseModel):
    user_query: str


@router.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        # Save PDF
        file_location = Path(PDF_FOLDER) / file.filename
        with open(file_location, "wb") as f:
            f.write(await file.read())
        print("File saved successfully:", file_location)

        # Extract text from saved file
        all_text = get_pdf_text(file_location)

        # Chunk text
        chunks = get_text_chunks(all_text)

        # Generate embeddings and store in vector DB
        generate_embedding_vector(chunks)

        return {"message": "PDF Uploaded & Stored in Vector Database"}

    except Exception as e:
        print("Error details:", e)
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/user-query")
def get_user_input_from_chat(query: UserQuery):
    try:
        memory = []
        user_query = query.user_query
        # Load vector store
        store = load_pdf_vector()

        # Search for similar documents
        docs = store.similarity_search(user_query)

        # Generate response using LLM chain
        chain = prompt_to_llm()
        result = chain.invoke(
            {"context": docs, "question": user_query, "history": memory}
        )

        if len(memory) > 2:
            result = chain.invoke(
                {"context": docs, "question": user_query, "history": memory[-1:-3]}
            )

        memory.append(result)
        return {"response": result}

    except Exception as e:
        print("Error in user-query:", e)
        raise HTTPException(status_code=500, detail=str(e))
