from django.urls import path
from .views import SubscriptionAPIView

urlpatterns = [
    path('', SubscriptionAPIView.as_view(), name='subscription-list'),
    path('<int:pk>/', SubscriptionAPIView.as_view(), name='subscription-detail'),
]