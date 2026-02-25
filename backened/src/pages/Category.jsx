import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import "../Customer.css";   // reuse same table styling

function Category() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/category/")
            .then((response) => response.json())
            .then((data) => setCategories(data))
            .catch((error) => console.error("Error:", error));
    }, []);

    return (
        <DashboardLayout>
            <div className="table-wrapper">
                <h2 className="page-heading">Category Management</h2>

                <table className="customer-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Category Name</th>
                        </tr>
                    </thead>

                    <tbody>
                        {categories.map((cat) => (
                            <tr key={cat.id}>
                                <td>{cat.id}</td>
                                <td>{cat.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}

export default Category;