from rest_framework import generics, status, permissions, filters
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed, NotFound
from rest_framework.permissions import AllowAny


from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q

from apps.common.utils import success_response, error_response
from ..models import Ingredient, IngredientStock
from .serializers import (
    IngredientSerializer,
    IngredientStockSerializer
)


class IngredientAddListView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = IngredientSerializer

    def get_queryset(self):
        return Ingredient.objects.all()

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)   
        serializer.save()
        return success_response(
            data=serializer.data,
            message='Successfully created Ingredient object'
        )
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return success_response(
            data=serializer.data,
            message='List of Ingredients'
        )


class IngredientDetailUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    
    def get_object(self):
        ingredient_uuid = self.kwargs.get("id")
        return get_object_or_404(Ingredient, id=ingredient_uuid)

    def retrieve(self, request, *args, **kwargs):
        ingredient = self.get_object()
        serializer = self.get_serializer(ingredient)
        return success_response(
            data=serializer.data,
            message='Ingredient Details'
        )
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True) # partial true means put and patch does the same job
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return success_response(message="Ingredient object updated successfully", data=serializer.data)

    def delete(self, request, *args, **kwargs):
        ingredient = self.get_object()
        serializer = self.get_serializer(ingredient, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_destroy(ingredient)
        return success_response(message="Ingredient deleted successfully")


class IngredientStockListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = IngredientStockSerializer

    def get_queryset(self):
        return IngredientStock.objects.all()

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)   
        serializer.save()
        return success_response(
            data=serializer.data,
            message='Successfully created Ingredient object'
        )
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return success_response(
            data=serializer.data,
            message='List of Ingredients'
        )

class IngredientStockDetailUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = IngredientStock.objects.all()
    serializer_class = IngredientStockSerializer
    
    def get_object(self):
        ingredientstock_uuid = self.kwargs.get("id")
        return get_object_or_404(Ingredient, id=ingredientstock_uuid)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return success_response(
            data=serializer.data,
            message='IngredientStock Details'
        )
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True) # partial true means put and patch does the same job
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return success_response(message="IngredientStock object updated successfully", data=serializer.data)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_destroy(instance)
        return success_response(message="IngredientStock deleted successfully")
