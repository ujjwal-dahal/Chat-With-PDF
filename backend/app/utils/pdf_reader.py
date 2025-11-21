from pathlib import Path
from langchain_community.document_loaders import PyPDFLoader


def get_pdf_text(pdf_file_path):
    pdf_path = Path(pdf_file_path)
    if not pdf_path.is_file():
        raise FileNotFoundError(f"PDF not found: {pdf_path}")

    loader = PyPDFLoader(str(pdf_path))
    docs = loader.load()
    return "\n".join([d.page_content for d in docs])
