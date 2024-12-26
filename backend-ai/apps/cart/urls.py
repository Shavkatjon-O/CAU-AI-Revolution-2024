from django.urls import path
from apps.cart.api.views import (
    ShoppingItemListView,
    ShoppingItemDetailView
)

urlpatterns = [
    path('', ShoppingItemListView.as_view(), name='ingredient-list'),
    path('<uuid:id>/', ShoppingItemDetailView.as_view(), name='ingredient-detail'),
]

