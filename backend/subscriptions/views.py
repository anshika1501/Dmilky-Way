from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Subscription
from .serializers import SubscriptionSerializer
from customer.models import Customer


# -------------------------
# Admin Subscription API (No auth required - for admin panel)
# -------------------------
class AdminSubscriptionAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk=None):
        if pk:
            try:
                subscription = Subscription.objects.get(pk=pk)
            except Subscription.DoesNotExist:
                return Response({"error": "Subscription not found"}, status=404)
            serializer = SubscriptionSerializer(subscription)
            return Response(serializer.data)

        subscriptions = Subscription.objects.all()
        serializer = SubscriptionSerializer(subscriptions, many=True)
        return Response(serializer.data)

    def delete(self, request, pk):
        try:
            subscription = Subscription.objects.get(pk=pk)
        except Subscription.DoesNotExist:
            return Response({"error": "Subscription not found"}, status=404)
        subscription.delete()
        return Response({"message": "Subscription deleted"}, status=204)


# -------------------------
# User Subscription API (Requires authentication)
# -------------------------
class SubscriptionAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):

        # Get logged-in user's customer profile
        try:
            customer = Customer.objects.get(user=request.user)
        except Customer.DoesNotExist:
            return Response({"error": "Customer profile not found"}, status=404)

        # If specific subscription requested
        if pk:
            try:
                subscription = Subscription.objects.get(pk=pk, customer=customer)
            except Subscription.DoesNotExist:
                return Response({"error": "Subscription not found"}, status=404)

            serializer = SubscriptionSerializer(subscription)
            return Response(serializer.data)

        # Otherwise return only this user's subscriptions
        subscriptions = Subscription.objects.filter(customer=customer)
        serializer = SubscriptionSerializer(subscriptions, many=True)
        return Response(serializer.data)

    def post(self, request):
        try:
            customer = Customer.objects.get(user=request.user)
        except Customer.DoesNotExist:
            return Response({"error": "Customer profile not found"}, status=404)

        data = request.data.copy()
        data["customer"] = customer.id  # Force assign logged-in customer

        serializer = SubscriptionSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def put(self, request, pk):
        try:
            customer = Customer.objects.get(user=request.user)
        except Customer.DoesNotExist:
            return Response({"error": "Customer profile not found"}, status=404)

        try:
            subscription = Subscription.objects.get(pk=pk, customer=customer)
        except Subscription.DoesNotExist:
            return Response({"error": "Subscription not found"}, status=404)

        serializer = SubscriptionSerializer(subscription, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        try:
            customer = Customer.objects.get(user=request.user)
        except Customer.DoesNotExist:
            return Response({"error": "Customer profile not found"}, status=404)

        try:
            subscription = Subscription.objects.get(pk=pk, customer=customer)
        except Subscription.DoesNotExist:
            return Response({"error": "Subscription not found"}, status=404)

        subscription.delete()
        return Response({"message": "Subscription deleted"}, status=204)