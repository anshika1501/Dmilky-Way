import { useEffect, useState } from "react";
import { userAPI } from "../../api/axios";
import Navbar from "../../components/Navbar";

function UserHome() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await userAPI.getProducts();
            setProducts(Array.isArray(response.data) ? response.data : []);
            setError(null);
        } catch (err) {
            console.error("Error fetching products:", err);
            setError("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <div style={styles.container}>
                <h2>Available Products</h2>

                {loading && <p>Loading...</p>}
                {error && <p style={styles.error}>{error}</p>}

                <div style={styles.grid}>
                    {products.filter(p => p.is_active).map(product => (
                        <div key={product.id} style={styles.card}>
                            <h3>{product.name}</h3>
                            <p style={styles.price}>₹ {product.price}</p>
                            <p>Stock: {product.stock > 0 ? `${product.stock} available` : "Out of stock"}</p>
                            <span style={product.is_active ? styles.available : styles.unavailable}>
                                {product.is_active ? "Available" : "Unavailable"}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

const styles = {
    container: {
        padding: "30px",
        maxWidth: "1200px",
        margin: "0 auto"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "20px",
        marginTop: "20px"
    },
    card: {
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#fff"
    },
    price: {
        fontSize: "18px",
        fontWeight: "bold",
        color: "#4caf50"
    },
    available: {
        display: "inline-block",
        padding: "4px 8px",
        backgroundColor: "#e8f5e9",
        color: "#2e7d32",
        borderRadius: "4px",
        fontSize: "12px"
    },
    unavailable: {
        display: "inline-block",
        padding: "4px 8px",
        backgroundColor: "#ffebee",
        color: "#c62828",
        borderRadius: "4px",
        fontSize: "12px"
    },
    error: {
        color: "red"
    }
};

export default UserHome;