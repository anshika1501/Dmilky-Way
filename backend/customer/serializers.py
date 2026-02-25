from rest_framework import serializers
from .models import Customer


class CustomerSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = Customer
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'phone', 'address', 'is_active', 'created_at', 'updated_at']

    def get_username(self, obj):
        return obj.user.username if obj.user else None
        
'''
{
  "name": "Rahul",
  "phone": "9876543210",
  "address": "Sector 15, Noida"
}
'''