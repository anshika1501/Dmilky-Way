from rest_framework import serializers
from .models import Customer


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = "__all__"
        
'''
{
  "name": "Rahul",
  "phone": "9876543210",
  "address": "Sector 15, Noida"
}
'''