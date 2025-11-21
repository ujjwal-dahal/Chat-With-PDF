from dotenv import load_dotenv
import os
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
HUGGINGFACEHUB_ACCESS_TOKEN = os.getenv("HUGGINGFACEHUB_ACCESS_TOKEN")
os.environ["HUGGINGFACEHUB_ACCESS_TOKEN"] = HUGGINGFACEHUB_ACCESS_TOKEN


def generate_embedding_vector(text_chunks):
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
    )

    vector_store = Chroma.from_texts(
        text_chunks,
        embeddings,
        collection_name="pdf_embedding_collection_384dim",
        persist_directory="./pdf_chroma_db",
    )

    return vector_store


def load_pdf_vector():
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
    )

    store = Chroma(
        embedding_function=embeddings,
        collection_name="pdf_embedding_collection_384dim",
        persist_directory="./pdf_chroma_db",
    )

    return store
