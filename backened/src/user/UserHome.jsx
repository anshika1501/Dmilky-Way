import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function UserHome() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/product/")
            .then(res => res.json())
            .then(data => setProducts(data));
    }, []);

    return (
        <>
            <Navbar />

            <div style={{ padding: "30px" }}>
                <h2>Available Products</h2>

                {products.map(product => (
                    <div key={product.id} style={cardStyle}>
                        <h3>{product.name}</h3>
                        <p>Category ID: {product.category}</p>
                        <p>Status: {product.is_active ? "Available" : "Unavailable"}</p>
                    </div>
                ))}
            </div>
        </>
    );
}

const cardStyle = {
    padding: "15px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px"
};

export default UserHome;