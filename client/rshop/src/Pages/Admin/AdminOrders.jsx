import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  adminGetAllOrders,
  adminUpdateOrderStatus
} from "../../features/admin/adminAPI";
import { clearErrors } from "../../features/admin/adminSlice";
import { MdShoppingCart, MdError, MdCheckCircle, MdRefresh } from "react-icons/md";

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, error, message } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    dispatch(adminGetAllOrders());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      setTimeout(() => dispatch(clearErrors()), 3000);
    }
    if (error) {
      setTimeout(() => dispatch(clearErrors()), 3000);
    }
  }, [message, error, dispatch]);

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(adminUpdateOrderStatus({ id: orderId, status: newStatus }));
  };

  const filteredOrders = orders?.filter(order => {
    const matchesSearch = 
      order.order_id?.toString().includes(searchTerm) ||
      order.email_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || order.order_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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

  const statusBadgeStyle = (status) => {
    let bg, text;
    switch (status) {
      case 'PENDING': bg = '#fef3c7'; text = '#92400e'; break;
      case 'PROCESSING': bg = '#ebf8ff'; text = '#2b6cb0'; break;
      case 'SHIPPED': bg = '#faf5ff'; text = '#6b46c1'; break;
      case 'DELIVERED': bg = '#f0fff4'; text = '#2f855a'; break;
      case 'CANCELLED': bg = '#fff5f5'; text = '#c53030'; break;
      default: bg = '#edf2f7'; text = '#4a5568'; break;
    }
    return {
      padding: '0.125rem 0.5rem',
      fontSize: '0.75rem',
      fontWeight: '600',
      borderRadius: '9999px',
      backgroundColor: bg,
      color: text
    };
  };

  const paymentBadgeStyle = (status) => {
    let bg, text;
    switch (status) {
      case 'PAID': bg = '#def7ec'; text = '#03543f'; break;
      case 'PENDING': bg = '#fef3c7'; text = '#92400e'; break;
      case 'FAILED': bg = '#fde8e8'; text = '#9b1c1c'; break;
      default: bg = '#edf2f7'; text = '#4a5568'; break;
    }
    return {
      padding: '0.125rem 0.5rem',
      fontSize: '0.75rem',
      fontWeight: '600',
      borderRadius: '9999px',
      backgroundColor: bg,
      color: text
    };
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, color: '#1a202c' }}>Order Management</h1>
        <p style={{ color: '#718096', margin: '0.25rem 0 0 0' }}>Manage customer orders and fulfillment</p>
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

      {/* Filters */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search ID or Email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: '250px',
            padding: '0.75rem 1rem',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            outline: 'none'
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            backgroundColor: 'white',
            outline: 'none'
          }}
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
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
                <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase' }}>Order ID</th>
                <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase' }}>Customer</th>
                <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase' }}>Total</th>
                <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase' }}>Payment</th>
                <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase' }}>Date</th>
                <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders?.map((order, index) => (
                <tr key={order.order_id || index} style={{ borderBottom: '1px solid #edf2f7' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#2d3748' }}>#{order.order_id}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontSize: '0.875rem', color: '#2d3748' }}>{order.email_id}</div>
                    <div style={{ fontSize: '0.75rem', color: '#718096' }}>{order.shipping_address}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: '700' }}>${order.total_amount}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={statusBadgeStyle(order.order_status)}>{order.order_status}</span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={paymentBadgeStyle(order.payment_status)}>{order.payment_status}</span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontSize: '0.875rem' }}>{new Date(order.created_at).toLocaleDateString()}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <select
                      value={order.order_status}
                      onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                      style={{
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #cbd5e0',
                        backgroundColor: 'white',
                        outline: 'none'
                      }}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(!filteredOrders || filteredOrders.length === 0) && (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <MdShoppingCart style={{ margin: '0 auto', fontSize: '3rem', color: '#cbd5e0' }} />
            <h3 style={{ marginTop: '1rem', fontSize: '1rem', fontWeight: '600', color: '#2d3748' }}>No orders</h3>
            <p style={{ marginTop: '0.5rem', color: '#718096' }}>
              {searchTerm || statusFilter ? "No orders match your filters." : "No orders found in the system."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
