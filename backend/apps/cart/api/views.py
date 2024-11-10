from rest_framework import generics, status, permissions, filters
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed, NotFound
from rest_framework.permissions import AllowAny


from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q

from apps.common.utils import success_response, error_response
from ..models import ShoppingListItem
from .serializers import (
    ShoppingItemListSerializer
)

class ShoppingItemListView(generics.ListCreateAPIView):
    queryset = ShoppingListItem.objects.all()
    serializer_class = ShoppingItemListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ShoppingListItem.objects.filter(user=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return success_response(
            data=serializer.data,
            message='List of Shopping Items'
        )


class ShoppingItemDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = ShoppingListItem.objects.all()
    serializer_class = ShoppingItemListSerializer

    def get_object(self):
        shoppingitem_uuid = self.kwargs.get("id")
        return get_object_or_404(ShoppingListItem, id=shoppingitem_uuid)

    def retrieve(self, request, *args, **kwargs):
        ingredient = self.get_object()
        serializer = self.get_serializer(ingredient)
        return success_response(
            data=serializer.data,
            message='Ingredient Details'
        )
