import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add request interceptor for auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Admin API endpoints (no auth required)
export const adminAPI = {
    // Customers
    getCustomers: () => api.get("/customer/"),
    getCustomer: (id) => api.get(`/customer/${id}/`),
    deleteCustomer: (id) => api.delete(`/customer/${id}/`),

    // Products
    getProducts: () => api.get("/product/"),
    getProduct: (id) => api.get(`/product/${id}/`),
    createProduct: (data) => api.post("/product/", data),
    updateProduct: (id, data) => api.put(`/product/${id}/`, data),
    deleteProduct: (id) => api.delete(`/product/${id}/`),

    // Categories
    getCategories: () => api.get("/category/"),
    getCategory: (id) => api.get(`/category/${id}/`),
    createCategory: (data) => api.post("/category/", data),
    updateCategory: (id, data) => api.put(`/category/${id}/`, data),
    deleteCategory: (id) => api.delete(`/category/${id}/`),

    // Staff
    getStaff: () => api.get("/staff/"),
    createStaff: (data) => api.post("/staff/", data),
    updateStaff: (id, data) => api.put(`/staff/${id}/`, data),
    deleteStaff: (id) => api.delete(`/staff/${id}/`),

    // Subscriptions (admin endpoints)
    getSubscriptions: () => api.get("/subscriptions/admin/"),
    deleteSubscription: (id) => api.delete(`/subscriptions/admin/${id}/`),
};

// User API endpoints (auth required)
export const userAPI = {
    login: (credentials) => api.post("/api/token/", credentials),
    refreshToken: (refresh) => api.post("/api/token/refresh/", { refresh }),
    register: (data) => api.post("/customer/register/", data),

    // User subscriptions
    getMySubscriptions: () => api.get("/subscriptions/"),
    createSubscription: (data) => api.post("/subscriptions/", data),

    // Products (public)
    getProducts: () => api.get("/product/"),
};

export default api;