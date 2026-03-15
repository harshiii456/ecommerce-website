import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { adminGetAllUsers, adminGetAllOrders, adminGetAllProducts } from "../../features/admin/adminAPI";
import { clearErrors } from "../../features/admin/adminSlice";
import { MdDashboard, MdPeople, MdShoppingCart, MdInventory, MdError, MdCheckCircle, MdCategory } from "react-icons/md";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { products, users, orders, isLoading, error, message } = useSelector((state) => state.admin);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => dispatch(clearErrors()), 3000);
      return () => clearTimeout(timer);
    }
  }, [message, error, dispatch]);

  // No longer blocking the entire UI with a spinner
  // The 3 main sections are static links and should be visible immediately

  const containerStyle = {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#1a202c'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '3rem'
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#1a202c',
    marginBottom: '0.5rem',
    letterSpacing: '-0.025em'
  };

  const subtitleStyle = {
    fontSize: '1.125rem',
    color: '#718096'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    marginTop: '2rem'
  };

  const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '2.5rem',
    backgroundColor: 'white',
    borderRadius: '1.25rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    cursor: 'pointer'
  };

  const iconContainerStyle = (color) => ({
    width: '5rem',
    height: '5rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
    backgroundColor: color,
    transition: 'all 0.3s ease'
  });

  const cardTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '0.75rem'
  };

  const cardDescStyle = {
    color: '#718096',
    marginBottom: '1.5rem',
    fontSize: '1rem',
    lineHeight: '1.5'
  };

  const buttonStyle = (color) => ({
    width: '100%',
    padding: '0.75rem',
    borderRadius: '0.75rem',
    backgroundColor: color,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    transition: 'background-color 0.3s ease'
  });

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Admin Control Center</h1>
        <p style={subtitleStyle}>Select a section to manage your store</p>
      </div>

      {message && (
        <div style={{
          marginBottom: '1.5rem',
          padding: '1rem 1.5rem',
          backgroundColor: '#f0fff4',
          borderLeft: '4px solid #48bb78',
          color: '#2f855a',
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <MdCheckCircle style={{ marginRight: '0.75rem', fontSize: '1.25rem' }} />
          <span style={{ fontWeight: '500' }}>{message}</span>
        </div>
      )}

      {error && (
        <div style={{
          marginBottom: '1.5rem',
          padding: '1rem 1.5rem',
          backgroundColor: '#fff5f5',
          borderLeft: '4px solid #f56565',
          color: '#c53030',
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <MdError style={{ marginRight: '0.75rem', fontSize: '1.25rem' }} />
          <span style={{ fontWeight: '500' }}>{typeof error === 'string' ? error : (error?.message || "An error occurred")}</span>
        </div>
      )}

      <div style={gridStyle}>
        {/* Manage Products */}
        <Link
          to="/admin/products"
          style={cardStyle}
          className="admin-card"
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 12px 20px rgba(0, 0, 0, 0.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
          }}
        >
          <div style={iconContainerStyle('#ebf8ff')}>
            <MdInventory style={{ fontSize: '2.5rem', color: '#3182ce' }} />
          </div>
          <h2 style={cardTitleStyle}>Manage Products</h2>
          <p style={cardDescStyle}>Add, edit, and track your product inventory with ease.</p>
          <div style={buttonStyle('#3182ce')}>Go to Products</div>
        </Link>

        {/* Manage Users */}
        <Link
          to="/admin/users"
          style={cardStyle}
          className="admin-card"
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 12px 20px rgba(0, 0, 0, 0.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
          }}
        >
          <div style={iconContainerStyle('#f0fff4')}>
            <MdPeople style={{ fontSize: '2.5rem', color: '#38a169' }} />
          </div>
          <h2 style={cardTitleStyle}>Manage Users</h2>
          <p style={cardDescStyle}>Monitor user accounts, roles, and registration status.</p>
          <div style={buttonStyle('#38a169')}>Go to Users</div>
        </Link>

        {/* View Orders */}
        <Link
          to="/admin/orders"
          style={cardStyle}
          className="admin-card"
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 12px 20px rgba(0, 0, 0, 0.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
          }}
        >
          <div style={iconContainerStyle('#faf5ff')}>
            <MdShoppingCart style={{ fontSize: '2.5rem', color: '#805ad5' }} />
          </div>
          <h2 style={cardTitleStyle}>View Orders</h2>
          <p style={cardDescStyle}>Track sales, update order statuses, and manage fulfillment.</p>
          <div style={buttonStyle('#805ad5')}>Go to Orders</div>
        </Link>

        {/* Manage Categories */}
        <Link
          to="/admin/categories"
          style={cardStyle}
          className="admin-card"
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 12px 20px rgba(0, 0, 0, 0.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
          }}
        >
          <div style={iconContainerStyle('#fffbeb')}>
            <MdCategory style={{ fontSize: '2.5rem', color: '#d97706' }} />
          </div>
          <h2 style={cardTitleStyle}>Manage Categories</h2>
          <p style={cardDescStyle}>Create and organize your store categories for better navigation.</p>
          <div style={buttonStyle('#d97706')}>Go to Categories</div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
