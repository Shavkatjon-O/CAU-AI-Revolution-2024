from rest_framework import serializers


class QuerySerializer(serializers.Serializer):
    query = serializers.CharField(max_length=255)


class AIQuestionSerializer(serializers.Serializer):
    question = serializers.CharField(max_length=256)
