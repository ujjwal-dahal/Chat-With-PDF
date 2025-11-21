from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Project Imports
from app.api.main import router as api_router

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def index():
    return {"message": "Chat With PDF Backend"}


app.include_router(api_router, prefix="/api")
