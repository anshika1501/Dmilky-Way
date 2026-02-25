import { Link } from "react-router-dom";
import "./Dashboard.css";

function DashboardLayout({ children }) {
    return (
        <div className="dashboard">

            {/* Sidebar */}
            <div className="sidebar">
                <h2 className="logo">Milkman Admin</h2>
                <nav>
                    <Link to="/customer">Customers</Link>
                    <Link to="/product">Products</Link>
                    <Link to="/category">Category</Link>
                    <Link to="/subscriptions">Subscriptions</Link>
                    <Link to="/staff">Staff</Link>
                </nav>
            </div>

            {/* Main Content */}
            <div className="main">
                <div className="navbar">
                    <h3>Dashboard</h3>
                </div>

                <div className="content">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default DashboardLayout;