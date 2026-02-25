import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import "../Customer.css";

function Product() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/product/")
            .then(res => res.json())
            .then(data => setProducts(data));
    }, []);

    return (
        <DashboardLayout>
            <h2>Products</h2>

            <table className="customer-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map(p => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.name}</td>
                            <td>₹ {p.price}</td>
                            <td>{p.stock}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </DashboardLayout>
    );
}

export default Product;