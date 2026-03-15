import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminGetAllCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from "../../features/admin/adminAPI";
import { clearErrors } from "../../features/admin/adminSlice";
import { MdAdd, MdEdit, MdDelete, MdCategory, MdClose, MdSave } from "react-icons/md";
import toast from "react-hot-toast";

const AdminCategories = () => {
  const dispatch = useDispatch();
  const { categories, isLoading, error, message } = useSelector((state) => state.admin);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    dispatch(adminGetAllCategories());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearErrors());
      setIsModalOpen(false);
      setCategoryName("");
      dispatch(adminGetAllCategories());
    }
    if (error) {
      toast.error(typeof error === 'string' ? error : (error?.message || "Something went wrong"));
      dispatch(clearErrors());
    }
  }, [message, error, dispatch]);

  const handleOpenModal = (category = null) => {
    if (category) {
      setIsEditMode(true);
      setCurrentCategoryId(category.category_id);
      setCategoryName(category.category_name);
    } else {
      setIsEditMode(false);
      setCurrentCategoryId(null);
      setCategoryName("");
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    if (isEditMode) {
      dispatch(adminUpdateCategory({ id: currentCategoryId, categoryData: { category_name: categoryName } }));
    } else {
      dispatch(adminCreateCategory({ category_name: categoryName }));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      dispatch(adminDeleteCategory(id));
    }
  };

  // Styles
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

  const addBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3182ce',
    color: 'white',
    borderRadius: '0.5rem',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  };

  const tableCardStyle = {
    backgroundColor: 'white',
    borderRadius: '1rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    overflow: 'hidden',
    border: '1px solid #e2e8f0'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  };

  const thStyle = {
    backgroundColor: '#f7fafc',
    padding: '1rem 1.5rem',
    color: '#4a5568',
    fontWeight: '600',
    borderBottom: '1px solid #e2e8f0'
  };

  const tdStyle = {
    padding: '1rem 1.5rem',
    borderBottom: '1px solid #e2e8f0',
    color: '#2d3748'
  };

  const actionBtnStyle = {
    padding: '0.5rem',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
    marginRight: '0.5rem'
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)'
  };

  const modalStyle = {
    backgroundColor: 'white',
    borderRadius: '1rem',
    width: '400px',
    padding: '2rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    marginTop: '0.5rem',
    outline: 'none',
    fontSize: '1rem'
  };

  if (isLoading && categories.length === 0) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2rem', color: '#4a5568' }}>Loading categories...</div>;
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '800', color: '#1a202c', margin: 0 }}>Category Management</h1>
          <p style={{ color: '#718096', marginTop: '0.5rem' }}>Organize your store inventory with custom categories</p>
        </div>
        <button onClick={() => handleOpenModal()} style={addBtnStyle}>
          <MdAdd size={20} style={{ marginRight: '0.5rem' }} />
          Add Category
        </button>
      </div>

      <div style={tableCardStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Category Name</th>
              <th style={thStyle}>Created At</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category.category_id || index} style={{ transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f7fafc'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <td style={tdStyle}>#{category.category_id}</td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', fontWeight: '600' }}>
                    <MdCategory style={{ marginRight: '0.75rem', color: '#4a90e2' }} />
                    {category.category_name}
                  </div>
                </td>
                <td style={tdStyle}>{new Date(category.created_at).toLocaleDateString()}</td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex' }}>
                    <button 
                      onClick={() => handleOpenModal(category)}
                      style={{ ...actionBtnStyle, backgroundColor: '#ebf8ff', color: '#3182ce' }}
                      title="Edit"
                    >
                      <MdEdit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(category.category_id)}
                      style={{ ...actionBtnStyle, backgroundColor: '#fff5f5', color: '#e53e3e' }}
                      title="Delete"
                    >
                      <MdDelete size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#718096' }}>
            No categories found. Click "Add Category" to get started.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#1a202c' }}>
                {isEditMode ? "Edit Category" : "New Category"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#718096' }}>
                <MdClose size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#4a5568' }}>Category Name</label>
                <input 
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Home Decor"
                  style={inputStyle}
                  autoFocus
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ flex: 1, padding: '0.75rem', backgroundColor: '#f7fafc', color: '#4a5568', borderRadius: '0.5rem', border: '1px solid #e2e8f0', cursor: 'pointer', fontWeight: '600' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  style={{ flex: 1, padding: '0.75rem', backgroundColor: '#3182ce', color: 'white', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isLoading ? 0.7 : 1 }}
                >
                  {isLoading ? "Saving..." : <><MdSave style={{ marginRight: '0.5rem' }} /> Save</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
