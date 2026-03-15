import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { MdAccountCircle, MdArrowDropDown, MdLogout, MdDashboard, MdInventory, MdCategory, MdPeople, MdShoppingCart } from "react-icons/md";
import { logOut } from "../../features/auth/authAPI";

const AdminHeader = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/auth");
  };

  // Styles
  const headerContainerStyle = {
    backgroundColor: 'white',
    borderBottom: '1px solid #e2e8f0',
    padding: '0.75rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
  };

  const navContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem'
  };

  const navLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: isActive ? '#3182ce' : '#4a5568',
    textDecoration: 'none',
    fontWeight: isActive ? '700' : '600',
    fontSize: '0.925rem',
    transition: 'color 0.2s',
    padding: '0.5rem 0'
  });

  const accountBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    backgroundColor: '#f7fafc',
    border: '1px solid #e2e8f0',
    color: '#2d3748',
    fontWeight: '600',
    position: 'relative'
  };

  const dropdownStyle = {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '0.5rem',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e2e8f0',
    width: '200px',
    overflow: 'hidden',
    display: showDropdown ? 'block' : 'none'
  };

  const dropdownItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    color: '#4a5568',
    textDecoration: 'none',
    fontSize: '0.875rem',
    borderBottom: '1px solid #f7fafc',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  };

  return (
    <div style={headerContainerStyle}>
      <div style={navContainerStyle}>
        <NavLink to="/admin/dashboard" style={{ textDecoration: 'none' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', color: '#1a202c', letterSpacing: '-0.025em' }}>
            RShop <span style={{ color: '#3182ce', fontSize: '1rem' }}>Admin</span>
          </h1>
        </NavLink>

        <nav style={{ display: 'flex', gap: '1.5rem', marginLeft: '1rem' }}>
          <NavLink to="/admin/dashboard" style={navLinkStyle}>
            <MdDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/admin/products" style={navLinkStyle}>
            <MdInventory size={18} /> Products
          </NavLink>
          <NavLink to="/admin/categories" style={navLinkStyle}>
            <MdCategory size={18} /> Categories
          </NavLink>
          <NavLink to="/admin/orders" style={navLinkStyle}>
            <MdShoppingCart size={18} /> Orders
          </NavLink>
          <NavLink to="/admin/users" style={navLinkStyle}>
            <MdPeople size={18} /> Users
          </NavLink>
        </nav>
      </div>

      <div 
        style={accountBtnStyle} 
        onMouseEnter={() => setShowDropdown(true)}
        onMouseLeave={() => setShowDropdown(false)}
      >
        <MdAccountCircle size={20} />
        <span>{userData?.user_first_name || "Admin"}</span>
        <MdArrowDropDown size={18} />

        <div style={dropdownStyle}>
          <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f7fafc' }}>
            <div style={{ fontSize: '0.75rem', color: '#718096', fontWeight: '500' }}>Logged in as</div>
            <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#2d3748', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userData?.email_id}</div>
          </div>
          <div 
            style={dropdownItemStyle} 
            onClick={handleLogout}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fff5f5'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            <MdLogout size={18} style={{ color: '#e53e3e' }} />
            <span style={{ color: '#e53e3e', fontWeight: '600' }}>Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
