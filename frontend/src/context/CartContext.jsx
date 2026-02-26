import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem("cart");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1, weight = 1, purchaseType = "onetime") => {
        setCartItems((prev) => {
            const existingIndex = prev.findIndex(
                (item) => item.product.id === product.id && item.purchaseType === purchaseType && item.weight === weight
            );

            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex].quantity += quantity;
                return updated;
            }

            return [...prev, { product, quantity, weight, purchaseType }];
        });
    };

    const removeFromCart = (index) => {
        setCartItems((prev) => prev.filter((_, i) => i !== index));
    };

    const updateQuantity = (index, quantity) => {
        if (quantity < 1) return;
        setCartItems((prev) => {
            const updated = [...prev];
            updated[index].quantity = quantity;
            return updated;
        });
    };

    const updateWeight = (index, weight) => {
        setCartItems((prev) => {
            const updated = [...prev];
            updated[index].weight = weight;
            return updated;
        });
    };

    const updatePurchaseType = (index, purchaseType) => {
        setCartItems((prev) => {
            const updated = [...prev];
            updated[index].purchaseType = purchaseType;
            return updated;
        });
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        const plans = {
            onetime: { discount: 0, days: 1 },
            "1month": { discount: 5, days: 30 },
            "3month": { discount: 10, days: 90 },
            "6month": { discount: 15, days: 180 },
        };

        return cartItems.reduce((total, item) => {
            const plan = plans[item.purchaseType] || plans.onetime;
            const basePrice = item.product.price * item.quantity * item.weight * plan.days;
            const discount = (basePrice * plan.discount) / 100;
            return total + (basePrice - discount);
        }, 0);
    };

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                updateWeight,
                updatePurchaseType,
                clearCart,
                getCartTotal,
                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
