from django.urls import path
from apps.ingredients.api.views import (
    IngredientAddListView,
    IngredientDetailUpdateDeleteView,
    IngredientStockListCreateView,
    IngredientStockDetailUpdateDeleteView
)

urlpatterns = [
    path('', IngredientAddListView.as_view(), name='ingredient-add-list'),
    path('<uuid:id>/', IngredientDetailUpdateDeleteView.as_view(), name='ingredient-detail-update-delete'),

    path('stocks/', IngredientStockListCreateView.as_view(), name='ingredient-stock-list-create'),
    path('stocks/<int:id>/', IngredientStockDetailUpdateDeleteView.as_view(), name='ingredient-stock-detail-update-delete'),
]
