from rest_framework import serializers
from .models import Customer


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'first_name', 'last_name', 'email', 'phone', 'address', 'is_active', 'created_at', 'updated_at']
        
'''
{
  "name": "Rahul",
  "phone": "9876543210",
  "address": "Sector 15, Noida"
}
'''