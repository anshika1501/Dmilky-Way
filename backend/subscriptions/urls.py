from django.urls import path
from .views import SubscriptionAPIView, AdminSubscriptionAPIView

urlpatterns = [
    # Admin routes (no auth required)
    path('admin/', AdminSubscriptionAPIView.as_view(), name='admin-subscription-list'),
    path('admin/<int:pk>/', AdminSubscriptionAPIView.as_view(), name='admin-subscription-detail'),
    # User routes (auth required)
    path('', SubscriptionAPIView.as_view(), name='subscription-list'),
    path('<int:pk>/', SubscriptionAPIView.as_view(), name='subscription-detail'),
]