import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import "../Customer.css";

function Customer() {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/customer/")
            .then((response) => response.json())
            .then((data) => setCustomers(data))
            .catch((error) => console.error("Error:", error));
    }, []);

    return (
        <DashboardLayout>
            <div className="table-wrapper">
                <h2 className="page-heading">Customer Management</h2>

                <table className="customer-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {customers.map((c) => (
                            <tr key={c.id}>
                                <td>{c.id}</td>
                                <td>{c.first_name} {c.last_name}</td>
                                <td>{c.email}</td>
                                <td>{c.phone}</td>
                                <td>{c.address}</td>
                                <td>
                                    <span
                                        className={
                                            c.is_active
                                                ? "status-badge status-active"
                                                : "status-badge status-inactive"
                                        }
                                    >
                                        {c.is_active ? "Active" : "Inactive"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}

export default Customer;