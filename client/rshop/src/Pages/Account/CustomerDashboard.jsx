import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  MdPerson,
  MdShoppingCart,
  MdEmail,
  MdPhone,
  MdHistory,
  MdLocalShipping,
  MdCheckCircle,
  MdPending,
  MdOpenInNew,
  MdEdit,
} from "react-icons/md";
import { FiPackage, FiLogOut, FiSettings } from "react-icons/fi";
import axios from "axios";

const CustomerDashboard = () => {
  const { userData } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const { data } = await axios.get("/api/v1/order");
        if (data.success) {
          setOrders(data.data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyOrders();
  }, []);

  const getStatusConfig = (status) => {
    switch (status) {
      case "PENDING": return { bg: "rgba(245, 158, 11, 0.15)", color: "#fcd34d", border: "rgba(245, 158, 11, 0.3)", label: "Pending" };
      case "PROCESSING": return { bg: "rgba(139, 92, 246, 0.15)", color: "#d8b4fe", border: "rgba(139, 92, 246, 0.3)", label: "Processing" };
      case "SHIPPED": return { bg: "rgba(56, 189, 248, 0.15)", color: "#7dd3fc", border: "rgba(56, 189, 248, 0.3)", label: "Shipped" };
      case "DELIVERED": return { bg: "rgba(16, 185, 129, 0.15)", color: "#6ee7b7", border: "rgba(16, 185, 129, 0.3)", label: "Delivered" };
      case "CANCELLED": return { bg: "rgba(239, 68, 68, 0.15)", color: "#fca5a5", border: "rgba(239, 68, 68, 0.3)", label: "Cancelled" };
      default: return { bg: "rgba(148, 163, 184, 0.15)", color: "#cbd5e1", border: "rgba(148, 163, 184, 0.3)", label: status };
    }
  };

  const statCards = [
    { label: "Total Orders", value: orders.length, icon: <FiPackage size={24} />, gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)", shadow: "rgba(99, 102, 241, 0.4)" },
    { label: "Delivered", value: orders.filter((o) => o.order_status === "DELIVERED").length, icon: <MdCheckCircle size={24} />, gradient: "linear-gradient(135deg, #10b981, #34d399)", shadow: "rgba(16, 185, 129, 0.4)" },
    { label: "In Transit", value: orders.filter((o) => o.order_status === "SHIPPED").length, icon: <MdLocalShipping size={24} />, gradient: "linear-gradient(135deg, #0ea5e9, #38bdf8)", shadow: "rgba(14, 165, 233, 0.4)" },
    { label: "Pending", value: orders.filter((o) => o.order_status === "PENDING").length, icon: <MdPending size={24} />, gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)", shadow: "rgba(245, 158, 11, 0.4)" },
  ];

  const initials = `${userData?.user_first_name?.[0] ?? ""}${userData?.user_last_name?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="dashboard-container">
      {/* Dynamic Background Blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      
      <div className="dashboard-wrapper">
        {/* Header */}
        <header className="dashboard-header">
          <div>
            <p className="greeting-sub">Welcome back,</p>
            <h1 className="greeting-main">{userData?.user_first_name} {userData?.user_last_name} <span className="wave">👋</span></h1>
          </div>
        </header>

        {/* Main Grid Layout */}
        <div className="dashboard-grid">
          {/* Left Sidebar Profile */}
          <aside className="profile-sidebar glass-panel">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar">
                {initials}
              </div>
              <button className="edit-avatar-btn" title="Edit Profile">
                <MdEdit size={14} />
              </button>
            </div>
            
            <h2 className="profile-name">{userData?.user_first_name} {userData?.user_last_name}</h2>
            <div className="badge-customer">Premium Member</div>

            <div className="profile-info-list">
              <div className="info-item">
                <div className="info-icon"><MdEmail size={18} /></div>
                <div className="info-text">
                  <span className="info-label">Email</span>
                  <span className="info-val">{userData?.email_id}</span>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon"><MdPhone size={18} /></div>
                <div className="info-text">
                  <span className="info-label">Phone</span>
                  <span className="info-val">{userData?.mobile_number || "Add phone number"}</span>
                </div>
              </div>
            </div>

            <div className="sidebar-actions">
              <Link to="/grocery-store" className="btn-primary">
                <MdShoppingCart size={18} /> Shop Grocery
              </Link>
              <Link to="/electronics" className="btn-secondary">
                <MdShoppingCart size={18} /> Shop Electronics
              </Link>
              <Link to="/fashion" className="btn-secondary">
                <MdShoppingCart size={18} /> Shop Fashion
              </Link>
              <Link to="/tv-appliances" className="btn-secondary">
                <MdShoppingCart size={18} /> Shop TV & Appliances
              </Link>
              <Link to="/home-furniture" className="btn-secondary">
                <MdShoppingCart size={18} /> Shop Home & Furniture
              </Link>
              <Link to="/toys" className="btn-secondary">
                <MdShoppingCart size={18} /> Shop Toys
              </Link>
            </div>
            <div className="account-settings">
              <button>
                <FiSettings size={18} /> Account Settings
              </button>
            </div>
          </aside>

          {/* Right Content Area */}
          <main className="dashboard-content">
            {/* Stats Grid */}
            <div className="stats-grid">
              {statCards.map((stat, idx) => (
                <div key={idx} className="stat-card glass-panel flex-row">
                  <div className="stat-icon-wrapper" style={{ background: stat.gradient, boxShadow: `0 8px 16px ${stat.shadow}` }}>
                    {stat.icon}
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">{stat.label}</p>
                    <h3 className="stat-value">{stat.value}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Orders Table */}
            <div className="orders-section glass-panel">
              <div className="orders-header">
                <h2><MdHistory size={22} className="orders-head-icon"/> Recent Orders</h2>
                <Link to="/orders" className="view-all-link">View All <MdOpenInNew size={16} /></Link>
              </div>

              {isLoading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Fetching your universe of items...</p>
                </div>
              ) : orders.length > 0 ? (
                <div className="table-responsive">
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Amount</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => {
                        const sc = getStatusConfig(order.order_status);
                        return (
                          <tr key={order.order_id} className="order-row">
                            <td className="col-id"><span>#</span>{order.order_id}</td>
                            <td className="col-date">{new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                            <td className="col-status">
                              <span className="status-badge" style={{ background: sc.bg, color: sc.color, borderColor: sc.border }}>
                                {sc.label}
                              </span>
                            </td>
                            <td className="col-total">${parseFloat(order.total_amount).toFixed(2)}</td>
                            <td className="col-action">
                              <button className="btn-table-view">Details</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon"><FiPackage size={48} /></div>
                  <h3>No Orders Found</h3>
                  <p>Looks like you haven't made your first purchase yet. Discover our latest collections!</p>
                  <Link to="/grocery-store" className="btn-primary" style={{ width: "auto", padding: "0.8rem 2rem", marginTop: "1rem" }}>
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <style>{`
        /* Baseline Reset & Variables */
        :root {
          --glass-bg: rgba(20, 21, 35, 0.45);
          --glass-border: rgba(255, 255, 255, 0.08);
          --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
          --text-main: #f8fafc;
          --text-muted: #94a3b8;
          --accent-primary: #6366f1;
          --accent-hover: #4f46e5;
        }

        .dashboard-container {
          min-height: 100vh;
          backgroundColor: #09090b;
          background: radial-gradient(circle at 50% 0%, #1e1b4b 0%, #09090b 70%);
          position: relative;
          overflow: hidden;
          padding: 3rem 1.5rem;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          color: var(--text-main);
          z-index: 1;
        }

        /* Ambient Animated Blobs */
        .blob {
          position: absolute;
          filter: blur(80px);
          z-index: -1;
          opacity: 0.5;
          animation: float 10s ease-in-out infinite alternate;
        }
        .blob-1 {
          top: -10%;
          left: -10%;
          width: 500px;
          height: 500px;
          background: linear-gradient(to right, #4338ca, #312e81);
          border-radius: 50%;
        }
        .blob-2 {
          bottom: -10%;
          right: -5%;
          width: 400px;
          height: 400px;
          background: linear-gradient(to right, #be185d, #831843);
          border-radius: 50%;
          animation-delay: -5s;
        }

        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(30px, 50px) scale(1.1); }
        }

        .dashboard-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }

        .dashboard-header {
          margin-bottom: 2.5rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .greeting-sub {
          color: var(--accent-primary);
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin: 0 0 0.4rem 0;
        }
        .greeting-main {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0;
          letter-spacing: -0.02em;
          background: linear-gradient(to right, #fff, #cbd5e1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .wave {
          display: inline-block;
          animation: wave 2.5s infinite;
          transform-origin: 70% 70%;
        }
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          10%, 30%, 50%, 70% { transform: rotate(14deg); }
          20%, 40%, 60% { transform: rotate(-8deg); }
          80% { transform: rotate(0deg); }
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 2rem;
          align-items: start;
        }
        @media (max-width: 968px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Universal Glass Panel */
        .glass-panel {
          background: var(--glass-bg);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          box-shadow: var(--glass-shadow);
        }

        /* Sidebar */
        .profile-sidebar {
          padding: 2.5rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: transform 0.3s ease;
        }
        .profile-sidebar:hover {
          transform: translateY(-4px);
        }

        .profile-avatar-wrapper {
          position: relative;
          margin-bottom: 1.5rem;
        }
        .profile-avatar {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #d946ef);
          color: white;
          font-size: 2.2rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
          border: 4px solid rgba(255,255,255,0.1);
          position: relative;
          z-index: 2;
        }
        .profile-avatar::before {
          content: '';
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          background: conic-gradient(from 0deg, transparent, rgba(99, 102, 241, 0.8), transparent);
          animation: spin-glow 4s linear infinite;
          z-index: -1;
        }
        @keyframes spin-glow { 100% { transform: rotate(360deg); } }
        
        .edit-avatar-btn {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #1e1b4b;
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 3;
          transition: all 0.2s;
        }
        .edit-avatar-btn:hover {
          background: var(--accent-primary);
          transform: scale(1.1);
        }

        .profile-name {
          font-size: 1.4rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
        }
        .badge-customer {
          background: rgba(99, 102, 241, 0.15);
          color: #a5b4fc;
          border: 1px solid rgba(99, 102, 241, 0.3);
          padding: 0.35rem 1rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .profile-info-list {
          width: 100%;
          margin: 2rem 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .info-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.8rem 1rem;
          background: rgba(0,0,0,0.2);
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.03);
          transition: background 0.2s;
        }
        .info-item:hover {
          background: rgba(255,255,255,0.05);
        }
        .info-icon {
          color: var(--accent-primary);
          display: flex;
        }
        .info-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }
        .info-label {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.2rem;
        }
        .info-val {
          font-size: 0.9rem;
          color: #e2e8f0;
          font-weight: 500;
          word-break: break-all;
        }

        .sidebar-actions {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }
        .btn-primary {
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-hover));
          color: white;
          border: none;
          padding: 0.8rem 1.2rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          text-decoration: none;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.35);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.5);
        }
        .btn-secondary {
          background: rgba(255, 255, 255, 0.05);
          color: #cbd5e1;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.8rem 1.2rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          transition: all 0.2s;
        }
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        /* Content Area */
        .dashboard-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.25rem;
        }
        .stat-card {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.5);
        }
        .stat-icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }
        .stat-label {
          margin: 0 0 0.3rem 0;
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 600;
        }
        .stat-value {
          margin: 0;
          font-size: 2.2rem;
          font-weight: 800;
          line-height: 1;
          color: white;
        }

        /* Orders Table Area */
        .orders-section {
          padding: 2rem;
          display: flex;
          flex-direction: column;
        }
        .orders-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .orders-header h2 {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .orders-head-icon {
          color: var(--accent-primary);
        }
        .view-all-link {
          color: var(--accent-primary);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 1rem;
          border-radius: 999px;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid transparent;
          transition: all 0.2s;
        }
        .view-all-link:hover {
          background: rgba(99, 102, 241, 0.2);
          border-color: rgba(99, 102, 241, 0.4);
        }

        .table-responsive {
          overflow-x: auto;
          border-radius: 16px;
          background: rgba(0,0,0,0.15);
          border: 1px solid rgba(255,255,255,0.05);
        }
        .orders-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }
        .orders-table th {
          text-align: left;
          padding: 1.25rem 1.5rem;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.02);
        }
        .orders-table td {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          vertical-align: middle;
        }
        .order-row {
          transition: background 0.2s;
        }
        .order-row:hover {
          background: rgba(255,255,255,0.03);
        }
        .order-row:last-child td {
          border-bottom: none;
        }
        
        .col-id {
          font-weight: 700;
          color: #e2e8f0;
          font-size: 0.95rem;
        }
        .col-id span {
          color: var(--accent-primary);
          margin-right: 2px;
        }
        .col-date {
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        .status-badge {
          display: inline-block;
          padding: 0.35rem 0.85rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          border: 1px solid;
          white-space: nowrap;
        }
        .col-total {
          font-weight: 800;
          font-size: 1.05rem;
          color: white;
        }
        .btn-table-view {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #e2e8f0;
          padding: 0.4rem 1.2rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-table-view:hover {
          background: white;
          color: black;
        }

        /* Loading & Empty States */
        .loading-state, .empty-state {
          padding: 4rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(255,255,255,0.1);
          border-top-color: var(--accent-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1.5rem;
        }
        .empty-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
          color: var(--accent-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          box-shadow: 0 0 30px rgba(99, 102, 241, 0.15);
        }
        .empty-state h3 {
          font-size: 1.4rem;
          margin: 0 0 0.5rem 0;
          color: white;
        }
        .empty-state p {
          color: var(--text-muted);
          max-width: 300px;
          line-height: 1.5;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CustomerDashboard;


