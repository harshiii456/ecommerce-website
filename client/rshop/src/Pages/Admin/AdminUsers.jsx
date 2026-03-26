import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  adminGetAllUsers,
  adminDeleteUser,
  adminUpdateUserRole
} from "../../features/admin/adminAPI";
import { clearErrors } from "../../features/admin/adminSlice";
import { MdPeople, MdDelete, MdError, MdCheckCircle } from "react-icons/md";

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { users, isLoading, error, message } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState("");
  const [localLoading, setLocalLoading] = useState(true);

  console.log("AdminUsers component - users:", users);
  console.log("AdminUsers component - isLoading:", isLoading);
  console.log("AdminUsers component - error:", error);
  console.log("AdminUsers component - localLoading:", localLoading);

  useEffect(() => {
    dispatch(adminGetAllUsers());
    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setLocalLoading(false);
    }, 3000); // 3 seconds timeout
    
    return () => clearTimeout(timeout);
  }, [dispatch]);

  // Update local loading when global loading changes or when users data arrives
  useEffect(() => {
    if (!isLoading && (users || users?.length > 0)) {
      setLocalLoading(false);
    }
  }, [isLoading, users]);

  useEffect(() => {
    if (message) {
      setTimeout(() => dispatch(clearErrors()), 3000);
    }
    if (error) {
      setTimeout(() => dispatch(clearErrors()), 3000);
    }
  }, [message, error, dispatch]);

  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(adminDeleteUser(userId));
    }
  };

  const handleRoleChange = (userId, newRole) => {
    if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      dispatch(adminUpdateUserRole({ id: userId, role: newRole }));
    }
  };

  const filteredUsers = users?.filter(user => {
    // Handle both Sequelize and plain object formats
    const email = user?.dataValues?.email_id || user?.email_id;
    const firstName = user?.dataValues?.user_first_name || user?.user_first_name;
    const lastName = user?.dataValues?.user_last_name || user?.user_last_name;
    
    console.log("Filtering user - email:", email, "firstName:", firstName, "lastName:", lastName);
    
    return email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           lastName?.toLowerCase().includes(searchTerm.toLowerCase());
  }) || [];

  console.log("Filtered users:", filteredUsers);

  if (isLoading || localLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #f3f3f3', 
          borderTop: '4px solid #3498db', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite' 
        }}></div>
      </div>
    );
  }

  // Show loading skeleton if no users yet but not loading
  if (!users || users.length === 0) {
    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2d3748' }}>Manage Users</h2>
        </div>
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '0.75rem' }}>
          <div style={{ marginBottom: '1rem' }}>Loading users...</div>
        </div>
      </div>
    );
  }

  const containerStyle = {
    padding: '2rem',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const headerStyle = {
    marginBottom: '2rem'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, color: '#1a202c' }}>User Management</h1>
        <p style={{ color: '#718096', margin: '0.25rem 0 0 0' }}>Manage user accounts and permissions</p>
      </div>

      {message && (
        <div style={{
          marginBottom: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f0fff4',
          border: '1px solid #c6f6d5',
          color: '#2f855a',
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center'
        }}>
          <MdCheckCircle style={{ marginRight: '0.5rem' }} />
          {message}
        </div>
      )}

      {error && (
        <div style={{
          marginBottom: '1.5rem',
          padding: '1rem',
          backgroundColor: '#fff5f5',
          border: '1px solid #feb2b2',
          color: '#c53030',
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center'
        }}>
          <MdError style={{ marginRight: '0.5rem' }} />
          {typeof error === 'string' ? error : (error?.message || "An error occurred")}
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            outline: 'none',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
          }}
          onFocus={(e) => e.target.style.borderColor = '#3182ce'}
          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
        />
      </div>

      {/* Users Table */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '0.75rem', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
        overflow: 'hidden',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase' }}>User</th>
                <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase' }}>Email</th>
                <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase' }}>Phone</th>
                <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase' }}>Role</th>
                <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers?.map((user, index) => {
                // Handle both Sequelize and plain object formats
                const userData = user?.dataValues || user;
                return (
                <tr key={userData.user_id || index} style={{ borderBottom: '1px solid #edf2f7' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ height: '2.5rem', width: '2.5rem', backgroundColor: '#edf2f7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem' }}>
                        <MdPeople style={{ color: '#a0aec0' }} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#2d3748' }}>{userData.user_first_name} {userData.user_last_name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#718096' }}>ID: {userData.user_id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontSize: '0.875rem', color: '#2d3748' }}>{userData.email_id}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontSize: '0.875rem', color: '#2d3748' }}>{userData.mobile_number || 'N/A'}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <select
                      value={userData.role || 'customer'}
                      onChange={(e) => handleRoleChange(userData.user_id, e.target.value)}
                      style={{
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        borderRadius: '0.375rem',
                        border: '1px solid #cbd5e0',
                        backgroundColor: userData.role === 'admin' ? '#f3e8ff' : '#edf2f7',
                        color: userData.role === 'admin' ? '#6b21a8' : '#4a5568',
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <button
                      onClick={() => handleDelete(userData.user_id)}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#e53e3e' }}
                    >
                      <MdDelete style={{ fontSize: '1.25rem' }} />
                    </button>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
        {(!filteredUsers || filteredUsers.length === 0) && (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <MdPeople style={{ margin: '0 auto', fontSize: '3rem', color: '#cbd5e0' }} />
            <h3 style={{ marginTop: '1rem', fontSize: '1rem', fontWeight: '600', color: '#2d3748' }}>No users</h3>
            <p style={{ marginTop: '0.5rem', color: '#718096' }}>
              {searchTerm ? "No users match your search." : "No users found in the system."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
