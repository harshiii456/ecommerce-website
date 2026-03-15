import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  adminCreateProduct,
  adminUpdateProduct,
  adminGetAllProducts,
  adminGetAllCategories
} from "../../features/admin/adminAPI";
import { clearErrors } from "../../features/admin/adminSlice";
import { MdArrowBack, MdSave, MdInventory, MdError, MdCheckCircle } from "react-icons/md";
import toast from "react-hot-toast";

const AdminProductForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, categories, isLoading, error, message } = useSelector((state) => state.admin);

  const [formData, setFormData] = useState({
    product_name: "",
    category_id: "",
    description: "",
    price: "",
    discount_price: "",
    stock_quantity: "",
    main_image_url: "",
    is_active: 1
  });

  useEffect(() => {
    dispatch(adminGetAllCategories());
  }, [dispatch]);

  useEffect(() => {
    if (isEditMode) {
      if (products.length === 0) {
        dispatch(adminGetAllProducts());
      } else {
        const product = products.find(p => p.product_id === parseInt(id));
        if (product) {
          setFormData({
            product_name: product.product_name || "",
            category_id: product.category_id || "",
            description: product.description || "",
            price: product.price || "",
            discount_price: product.discount_price || "",
            stock_quantity: product.stock_quantity || "",
            main_image_url: product.main_image_url || "",
            is_active: product.is_active ?? 1
          });
        }
      }
    }
  }, [isEditMode, id, products, dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearErrors());
      navigate("/admin/products");
    }
    if (error) {
      toast.error(typeof error === 'string' ? error : (error?.message || "Something went wrong"));
      dispatch(clearErrors());
    }
  }, [message, error, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.product_name || !formData.price || !formData.category_id) {
      toast.error("Name, Price and Category are required");
      return;
    }

    if (isEditMode) {
      dispatch(adminUpdateProduct({ id, productData: formData }));
    } else {
      dispatch(adminCreateProduct(formData));
    }
  };

  const containerStyle = {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e2e8f0'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: '0.5rem'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    marginBottom: '1.25rem'
  };

  const selectStyle = {
    ...inputStyle,
    appearance: 'none',
    backgroundColor: 'white'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '120px',
    resize: 'vertical'
  };

  const btnSecondaryStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1.25rem',
    backgroundColor: '#edf2f7',
    color: '#4a5568',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  };

  const btnPrimaryStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 2rem',
    backgroundColor: '#3182ce',
    color: 'white',
    borderRadius: '0.5rem',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  };

  return (
    <div style={containerStyle}>
      <button 
        onClick={() => navigate("/admin/products")}
        style={{ ...btnSecondaryStyle, marginBottom: '1.5rem', padding: '0.5rem 1rem' }}
      >
        <MdArrowBack style={{ marginRight: '0.5rem' }} />
        Back to Products
      </button>

      <div style={cardStyle}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '800', color: '#1a202c', margin: 0 }}>
            {isEditMode ? "Edit Product" : "Add New Product"}
          </h1>
          <p style={{ color: '#718096', marginTop: '0.5rem' }}>
            {isEditMode ? "Update the product information below" : "Fill in the details to create a new product"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0 2rem' }}>
            <div>
              <label style={labelStyle}>Product Name *</label>
              <input
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                placeholder="Ex: iPhone 15 Pro"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Category *</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                style={selectStyle}
              >
                <option value="">Select Category</option>
                {categories.map((cat, index) => (
                  <option key={cat.category_id || index} value={cat.category_id}>{cat.category_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Price ($) *</label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Discount Price ($)</label>
              <input
                type="number"
                step="0.01"
                name="discount_price"
                value={formData.discount_price}
                onChange={handleChange}
                placeholder="0.00"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Stock Quantity *</label>
              <input
                type="number"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleChange}
                placeholder="0"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Main Image URL</label>
              <input
                name="main_image_url"
                value={formData.main_image_url}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell customers about this product..."
              style={textareaStyle}
            />
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: '1rem', 
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #edf2f7'
          }}>
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              style={btnSecondaryStyle}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                ...btnPrimaryStyle,
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              <MdSave style={{ marginRight: '0.5rem' }} />
              {isLoading ? "Saving..." : (isEditMode ? "Update Product" : "Create Product")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductForm;
