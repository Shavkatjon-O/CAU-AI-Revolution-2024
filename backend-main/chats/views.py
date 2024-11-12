# nutrition/views.py
import os

from langchain_core.runnables import RunnableLambda, RunnablePassthrough
from langchain_openai import ChatOpenAI
from langchain_openai.embeddings import OpenAIEmbeddings
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import AIQuestionSerializer, QuerySerializer

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")


class AIQuestionAPIView(CreateAPIView):
    serializer_class = AIQuestionSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        question = serializer.validated_data["question"]
        user = request.user

        user_info = {
            "age": user.age,
            "gender": user.gender,
            "height": user.height,
            "weight": user.weight,
            "goal": user.goal,
            "allergies": user.allergies,
            "activity_level": user.activity_level,
            "dietary_preferences": user.dietary_preferences,
        }

        user_info_str = f"""
        User Information:
        - Age: {user_info['age']} years
        - Gender: {user_info['gender']}
        - Height: {user_info['height']} cm
        - Weight: {user_info['weight']} kg
        - Goal: {user_info['goal']}
        - Allergies: {user_info['allergies'] if user_info['allergies'] else 'None'}
        - Activity Level: {user_info['activity_level']}
        - Dietary Preferences: {user_info['dietary_preferences'] if user_info['dietary_preferences'] else 'None'}
        """

        llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.5, api_key=OPENAI_API_KEY)

        # Adjusted rag_prompt_template to handle general and specific questions
        rag_prompt_template = """
        You are an expert nutritionist and health advisor. You will receive user information and a question.
        Please answer the question based on the user's personal information and provide actionable, practical, and healthy advice tailored to their needs.
        However, if the question is general or doesn't require personalized advice (e.g., greetings or common social questions), respond directly to the question without referencing the user's information.

        User Information:
        {user_info}

        Question: {question}

        Response Guidelines:
        - If the question is a casual or general inquiry (e.g., "Hello", "How are you?", "What's your name?"), respond directly to the query without using the user information.
        - If the question relates to nutrition, fitness, or personal advice, tailor the response to the user's information and provide actionable recommendations.
        - Keep the response clear, concise, and relevant to the user's needs.

        Your response should be focused and specific to the question, even if the user hasn't mentioned anything.
        """

        rag_prompt = rag_prompt_template.format(
            user_info=user_info_str, question=question
        )

        response = llm([rag_prompt])

        return Response({"response": response})


class NutritionAssistantAPIView(APIView):
    def post(self, request):
        serializer = QuerySerializer(data=request.data)
        if serializer.is_valid():
            query = serializer.validated_data["query"]

            # Assuming OPENAI_API_KEY is set in your environment
            OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
            llm = ChatOpenAI(
                model="gpt-3.5-turbo",
                temperature=0.5,
                api_key=OPENAI_API_KEY,
            )

            # Use the query directly without user-specific information
            rag_prompt_template = """
            You are an expert AI nutritionist designed to offer personalized guidance based on a user’s health and wellness needs. I will provide you with a query from the user. Please answer the question based on your expertise, offering actionable and concise advice.

            Query: {query}

            Your response should be clear, practical, and relevant to the question. Keep the response under 4-5 sentences.
            """

            # Format the prompt with the received query
            rag_prompt = rag_prompt_template.format(query=query)

            # Use the LLM to get a response
            response = llm([rag_prompt])

            return Response({"response": response})
        else:
            return Response(serializer.errors, status=400)
