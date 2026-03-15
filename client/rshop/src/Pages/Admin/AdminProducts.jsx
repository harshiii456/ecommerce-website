import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  adminGetAllProducts,
  adminDeleteProduct
} from "../../features/admin/adminAPI";
import { clearErrors } from "../../features/admin/adminSlice";
import { MdAdd, MdEdit, MdDelete, MdInventory, MdError, MdCheckCircle } from "react-icons/md";

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { products, isLoading, error, message } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(adminGetAllProducts());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      setTimeout(() => dispatch(clearErrors()), 3000);
    }
    if (error) {
      setTimeout(() => dispatch(clearErrors()), 3000);
    }
  }, [message, error, dispatch]);

  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(adminDeleteProduct(productId));
    }
  };

  const filteredProducts = products?.filter(product =>
    product.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, color: '#1a202c' }}>Product Management</h1>
          <p style={{ color: '#718096', margin: '0.25rem 0 0 0' }}>Manage your product inventory</p>
        </div>
        <Link
          to="/admin/products/new"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.75rem 1.25rem',
            backgroundColor: '#3182ce',
            color: 'white',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2b6cb0'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#3182ce'}
        >
          <MdAdd style={{ marginRight: '0.5rem' }} />
          Add Product
        </Link>
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
          placeholder="Search products..."
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

      {/* Products Table */}
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
                <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase' }}>Product</th>
                <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase' }}>Price</th>
                <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase' }}>Stock</th>
                <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#4a5568', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody style={{ divideY: '1px solid #e2e8f0' }}>
              {filteredProducts?.map((product) => (
                <tr key={product.product_id} style={{ borderBottom: '1px solid #edf2f7' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {product.main_image_url ? (
                        <img
                          src={product.main_image_url}
                          alt={product.product_name}
                          style={{ height: '2.5rem', width: '2.5rem', borderRadius: '0.375rem', objectCover: 'cover', marginRight: '1rem' }}
                        />
                      ) : (
                        <div style={{ height: '2.5rem', width: '2.5rem', backgroundColor: '#edf2f7', borderRadius: '0.375rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem' }}>
                          <MdInventory style={{ color: '#a0aec0' }} />
                        </div>
                      )}
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#2d3748' }}>{product.product_name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#718096' }}>ID: {product.product_id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontSize: '0.875rem', color: '#2d3748' }}>${product.price}</div>
                    {product.discount_price && (
                      <div style={{ fontSize: '0.75rem', color: '#38a169' }}>${product.discount_price}</div>
                    )}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontSize: '0.875rem', color: '#2d3748' }}>{product.stock_quantity}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{
                      padding: '0.125rem 0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      borderRadius: '9999px',
                      backgroundColor: product.is_active ? '#def7ec' : '#fde8e8',
                      color: product.is_active ? '#03543f' : '#9b1c1c'
                    }}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <Link
                        to={`/admin/products/edit/${product.product_id}`}
                        style={{ color: '#3182ce', textDecoration: 'none' }}
                      >
                        <MdEdit style={{ fontSize: '1.25rem' }} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.product_id)}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#e53e3e' }}
                      >
                        <MdDelete style={{ fontSize: '1.25rem' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(!filteredProducts || filteredProducts.length === 0) && (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <MdInventory style={{ margin: '0 auto', fontSize: '3rem', color: '#cbd5e0' }} />
            <h3 style={{ marginTop: '1rem', fontSize: '1rem', fontWeight: '600', color: '#2d3748' }}>No products</h3>
            <p style={{ marginTop: '0.5rem', color: '#718096' }}>
              {searchTerm ? "No products match your search." : "Get started by creating a new product."}
            </p>
            <div style={{ marginTop: '1.5rem' }}>
              <Link
                to="/admin/products/new"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#3182ce',
                  color: 'white',
                  borderRadius: '0.375rem',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                <MdAdd style={{ marginRight: '0.5rem' }} />
                Add Product
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
