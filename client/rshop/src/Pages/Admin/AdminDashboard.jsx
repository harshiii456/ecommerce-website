import React from "react";
import { Link } from "react-router-dom";
import { MdInventory, MdPeople, MdShoppingCart } from "react-icons/md";

const AdminDashboard = () => {
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const dashboardStyle = {
    background: 'white',
    borderRadius: '20px',
    padding: '3rem',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    maxWidth: '800px',
    width: '100%',
    textAlign: 'center'
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: '1rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };

  const subtitleStyle = {
    fontSize: '1.1rem',
    color: '#718096',
    marginBottom: '3rem'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
    marginTop: '2rem'
  };

  const cardStyle = {
    background: 'white',
    borderRadius: '15px',
    padding: '2rem',
    border: '2px solid #e2e8f0',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer'
  };

  const iconStyle = (color) => ({
    fontSize: '3rem',
    color: color,
    marginBottom: '1rem'
  });

  const cardTitleStyle = {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '0.5rem'
  };

  const cardDescStyle = {
    fontSize: '0.9rem',
    color: '#718096',
    lineHeight: '1.4'
  };

  return (
    <div style={containerStyle}>
      <div style={dashboardStyle}>
        <h1 style={titleStyle}>Admin Dashboard</h1>
        <p style={subtitleStyle}>Manage your e-commerce store</p>
        
        <div style={gridStyle}>
          {/* Manage Products */}
          <Link
            to="/admin/products"
            style={cardStyle}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)';
              e.currentTarget.style.borderColor = '#667eea';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <MdInventory style={iconStyle('#667eea')} />
            <h3 style={cardTitleStyle}>Manage Products</h3>
            <p style={cardDescStyle}>Add, edit, and manage your product inventory</p>
          </Link>

          {/* Manage Users */}
          <Link
            to="/admin/users"
            style={cardStyle}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(72, 187, 120, 0.3)';
              e.currentTarget.style.borderColor = '#48bb78';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <MdPeople style={iconStyle('#48bb78')} />
            <h3 style={cardTitleStyle}>Manage Users</h3>
            <p style={cardDescStyle}>View and manage user accounts and permissions</p>
          </Link>

          {/* View Orders */}
          <Link
            to="/admin/orders"
            style={cardStyle}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(159, 122, 234, 0.3)';
              e.currentTarget.style.borderColor = '#9f7aea';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <MdShoppingCart style={iconStyle('#9f7aea')} />
            <h3 style={cardTitleStyle}>View Orders</h3>
            <p style={cardDescStyle}>Track orders and manage fulfillment</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
