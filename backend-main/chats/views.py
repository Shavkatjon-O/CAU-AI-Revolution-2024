# nutrition/views.py
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import QuerySerializer
from langchain_openai import ChatOpenAI
from langchain_openai.embeddings import OpenAIEmbeddings
from langchain_core.runnables import RunnableLambda, RunnablePassthrough
import os

class NutritionAssistantAPIView(APIView):
    def post(self, request):
        serializer = QuerySerializer(data=request.data)
        if serializer.is_valid():
            query = serializer.validated_data['query']
            
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
