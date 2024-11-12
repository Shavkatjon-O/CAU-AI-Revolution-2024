import os

from dotenv import find_dotenv, load_dotenv
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableLambda, RunnablePassthrough
from langchain_openai import ChatOpenAI
from langchain_openai.embeddings import OpenAIEmbeddings
from users.models import User

load_dotenv(find_dotenv())

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

embeddings = OpenAIEmbeddings(api_key=OPENAI_API_KEY)
llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.5)
output_parser = StrOutputParser()

rag_prompt_template = """template"""


def query_llm_service(user: User, query: str) -> str:
    # weight = user.weight
    # height = user.height
    # age = user.age
    # gender = user.gender
    # activity_level = user.activity_level
    # dietary_preferences = user.dietary_preferences
    # health_goals = user.health_goals
    # lifestyle_details = user.lifestyle_details

    # rag_prompt = rag_prompt_template.format(
    #     weight=weight,
    #     height=height,
    #     age=age,
    #     gender=gender,
    #     activity_level=activity_level,
    #     dietary_preferences=dietary_preferences,
    #     health_goals=health_goals,
    #     lifestyle_details=lifestyle_details,
    #     query=query
    # )

    rag_prompt = rag_prompt_template.format(
        weight=user.weight,
        height=user.height,
        age=user.age,
        gender=user.gender,
        activity_level=user.activity_level,
        dietary_preferences=user.dietary_preferences,
        health_goals=user.health_goals,
        lifestyle_details=user.lifestyle_details,
        # question
        query=query,
    )

    chain = rag_prompt | llm | output_parser
    response = chain.invoke(rag_prompt)

    return response
