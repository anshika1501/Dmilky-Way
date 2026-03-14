export const isMilkProduct = (productName) => {
    if (!productName) return false;
    const name = productName.toLowerCase();
    return name.includes("cow milk") || name.includes("buffalo milk");
};

export const getUnit = (productName) => {
    return isMilkProduct(productName) ? "Litre" : "kg";
};

export const getShortUnit = (productName) => {
    return isMilkProduct(productName) ? "L" : "kg";
};

export const isSubscriptionEligible = (productName) => {
    if (!productName) return true;
    const name = productName.toLowerCase();
    return !name.includes("honey");
};

export const getWeightOptions = (productName) => {
    const isMilk = isMilkProduct(productName);
    return [
        { value: 0.5, label: isMilk ? "Half Litre (500ml)" : "Half kg (500g)" },
        { value: 1, label: isMilk ? "1 L" : "1 kg" },
        { value: 1.5, label: isMilk ? "1.5 L" : "1.5 kg" },
        { value: 2, label: isMilk ? "2 L" : "2 kg" },
        { value: 5, label: isMilk ? "5 L" : "5 kg" },
    ];
};
