from django.urls import path
from apps.ingredients.api.views import (
    IngredientListView,
    IngredientDetailView,
    IngredientStockListCreateView,
    IngredientStockDetailUpdateDeleteView
)

urlpatterns = [
    path('', IngredientListView.as_view(), name='ingredient-add-list'),
    path('<uuid:id>/', IngredientDetailView.as_view(), name='ingredient-detail-update-delete'),

    # path('stocks/', IngredientStockListCreateView.as_view(), name='ingredient-stock-list-create'),
    # path('stocks/<uuid:id>/', IngredientStockDetailUpdateDeleteView.as_view(), name='ingredient-stock-detail-update-delete'),
]
