import os

from langchain import hub

from langchain_openai import ChatOpenAI
from langchain_openai.embeddings import OpenAIEmbeddings

from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import TextLoader

from langchain.text_splitter import RecursiveCharacterTextSplitter

from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

from django.conf import settings

from dotenv import load_dotenv, find_dotenv


load_dotenv(find_dotenv())

# -------------------------------------------------------------------------- #

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

# doc_path = os.path.join(settings.BASE_DIR, "ai-database.txt")
# data = TextLoader(doc_path)
# docs = data.load()

# -------------------------------------------------------------------------- #

text_splitter = RecursiveCharacterTextSplitter()
# text_splits = text_splitter.split_documents(docs)

# -------------------------------------------------------------------------- #

embeddings = OpenAIEmbeddings(api_key=OPENAI_API_KEY)
# vectorstore = FAISS.from_documents(text_splits, embeddings)
# retriever = vectorstore.as_retriever()

# -------------------------------------------------------------------------- #

format_docs = lambda docs: "\n\n".join(doc.page_content for doc in docs)

llm = ChatOpenAI(
    model="gpt-3.5-turbo",
    temperature=0.5,
)

# -------------------------------------------------------------------------- #

rag_prompt_template = """
You are an AI nutritionist. I will provide you with a user’s dietary preferences, health goals, and lifestyle information. Based on this, generate a personalized meal plan, offer healthy lifestyle advice, and make specific recommendations for nutrition, exercise, and general wellbeing.

User Information:
- Dietary preferences: {dietary_preferences}
- Health goals: {health_goals}
- Lifestyle details: {lifestyle_details}

Please create a meal plan that aligns with the user's preferences and health goals, provide recommendations for healthy habits, and suggest any improvements or adjustments they could make to their diet and lifestyle.
"""

# -------------------------------------------------------------------------- #

output_parser = StrOutputParser()

user_info = {
    "dietary_preferences": "vegan",
    "health_goals": "weight loss",
    "lifestyle_details": "active but stressed"
}

def generate_rag_prompt(user_info):
    return rag_prompt_template.format(
        dietary_preferences=user_info['dietary_preferences'],
        health_goals=user_info['health_goals'],
        lifestyle_details=user_info['lifestyle_details']
    )

query = {
    # "context": retriever | format_docs,
    "context": None,  # No context since we're not loading docs
    "question": RunnablePassthrough(),
}

def get_chain(user_info):
    rag_prompt = generate_rag_prompt(user_info)

    chain = query | rag_prompt | llm | output_parser

    return chain

chain = get_chain(user_info)

result = chain.invoke()
print(result)