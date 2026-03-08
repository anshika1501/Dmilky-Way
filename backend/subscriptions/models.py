from django.db import models
from customer.models import Customer
from product.models import Product


class Subscription(models.Model):
    SUBSCRIPTION_TYPE_CHOICES = [
        ('daily', 'Daily'),
        ('alternate', 'Alternate Day'),
    ]

    PLAN_TYPE_CHOICES = [
        ('1month', '1 Month'),
        ('3month', '3 Months'),
        ('6month', '6 Months'),
    ]

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name='subscriptions'
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )

    subscription_type = models.CharField(
        max_length=20,
        choices=SUBSCRIPTION_TYPE_CHOICES
    )

    plan_type = models.CharField(
        max_length=20,
        choices=PLAN_TYPE_CHOICES,
        default='1month'
    )

    quantity = models.PositiveIntegerField(
        help_text="Quantity per delivery"
    )

    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)

    is_active = models.BooleanField(default=True)
    is_paused = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.customer} - {self.product} ({self.subscription_type})"