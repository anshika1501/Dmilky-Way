import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import "../Customer.css";

function Staff() {
    const [staffs, setStaffs] = useState([]);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("");

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = () => {
        fetch("http://127.0.0.1:8000/staff/")
            .then((res) => res.json())
            .then((data) => setStaffs(data))
            .catch((error) => console.error("Error:", error));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch("http://127.0.0.1:8000/staff/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                phone,
                role,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setStaffs([...staffs, data]);
                setName("");
                setPhone("");
                setRole("");
            });
    };

    const handleDelete = (id) => {
        fetch(`http://127.0.0.1:8000/staff/${id}/`, {
            method: "DELETE",
        })
            .then(() => {
                setStaffs(staffs.filter((s) => s.id !== id));
            })
            .catch((error) => console.error("Error:", error));
    };

    return (
        <DashboardLayout>
            <div className="table-wrapper">
                <h2 className="page-heading">Staff Management</h2>

                {/* Add Staff Form */}
                {/* Add Staff Form */}
                <div className="form-card">
                    <h3 className="form-title">Add New Staff</h3>

                    <form className="modern-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                placeholder="Enter staff name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                placeholder="Enter phone number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Role</label>
                            <input
                                type="text"
                                placeholder="e.g. Delivery Boy / Manager"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="primary-btn">
                            + Add Staff
                        </button>
                    </form>
                </div>
                
                {/* Staff Table */}
                <table className="customer-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Created</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {staffs.map((staff) => (
                            <tr key={staff.id}>
                                <td>{staff.id}</td>
                                <td>{staff.name}</td>
                                <td>{staff.phone}</td>
                                <td>{staff.role}</td>
                                <td>{new Date(staff.created_at).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(staff.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}

export default Staff;