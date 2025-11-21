from langchain_core.prompts import PromptTemplate
from app.utils.prompt_template import prompt_template

from langchain_groq import ChatGroq
from langchain_core.output_parsers import StrOutputParser

# Project Imports
from .groq_api import GROQ_API_KEY


def prompt_to_llm():
    parser = StrOutputParser()

    prompt_to_groq = PromptTemplate(
        template=prompt_template, input_variables=["context", "question"]
    )

    llm = ChatGroq(
        model="llama-3.3-70b-versatile", temperature=0.3, api_key=GROQ_API_KEY
    )

    chain = prompt_to_groq | llm | parser

    return chain
