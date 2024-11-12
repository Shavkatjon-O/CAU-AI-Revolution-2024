import os

from dotenv import find_dotenv, load_dotenv
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableLambda, RunnablePassthrough
from langchain_openai import ChatOpenAI
from langchain_openai.embeddings import OpenAIEmbeddings

# from langchain import hub


# from langchain_community.vectorstores import FAISS
# from langchain_community.document_loaders import TextLoader


# from django.conf import settings


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
You are an expert AI nutritionist designed to offer personalized guidance based on a user’s health and wellness needs. I will provide you with a set of basic details about the user's diet, health, and lifestyle preferences. Use this information to create a balanced and tailored meal plan, offer practical nutrition tips, and recommend lifestyle improvements to help them achieve their wellness goals.

User Details:
- Dietary preferences: {dietary_preferences}
- Health goals: {health_goals}
- Lifestyle Details: {lifestyle_details}

Based on this data, your task is to generate:
1. A daily meal plan that aligns with the user's dietary preferences and health goals. Include breakfast, lunch, dinner, and snack suggestions.
2. Nutritional tips (macronutrients and micronutrients) that would help the user meet their health goals.
3. Lifestyle recommendations such as exercise, stress management, sleep tips, or hydration advice to support overall wellbeing.

Please keep your response clear, practical, and concise. Provide only the most relevant and actionable advice. Your response should not exceed 4-5 sentences.

"""

# -------------------------------------------------------------------------- #

output_parser = StrOutputParser()

user_info = {
    "dietary_preferences": "vegan",
    "health_goals": "weight loss",
    "lifestyle_details": "active but stressed",
}


def generate_rag_prompt(user_info):
    return rag_prompt_template.format(
        dietary_preferences=user_info["dietary_preferences"],
        health_goals=user_info["health_goals"],
        lifestyle_details=user_info["lifestyle_details"],
    )


query = {
    # "context": retriever | format_docs,
    "context": None,  # No context since we're not loading docs
    "question": RunnablePassthrough(),
}


def get_chain(user_info):
    rag_prompt = RunnableLambda(lambda user_info: generate_rag_prompt(user_info))

    chain = query["question"] | rag_prompt | llm | output_parser

    return chain


chain = get_chain(user_info)

result = chain.invoke(user_info)
print(result)
