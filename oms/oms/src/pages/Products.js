// src/pages/Products.js
import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import Toast from '../components/Toast';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    productCode: '',
    productName: '',
    description: '',
    price: '',
    stockQuantity: '',
    minStockLevel: '',
    category: '',
    isActive: true,
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/products');
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
      setToast('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetForm = () => {
    setEditing(null);
    setForm({
      productCode: '',
      productName: '',
      description: '',
      price: '',
      stockQuantity: '',
      minStockLevel: '',
      category: '',
      isActive: true,
    });
  };

  const onEdit = (p) => {
    setEditing(p);
    setForm({
      productCode: p.productCode || '',
      productName: p.productName || '',
      description: p.description || '',
      price: p.price ?? '',
      stockQuantity: p.stockQuantity ?? '',
      minStockLevel: p.minStockLevel ?? '',
      category: p.category || '',
      isActive: p.isActive ?? true,
    });
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/api/products/${id}`);
      setToast('Product deleted');
      loadProducts();
    } catch (err) {
      console.error(err);
      setToast('Delete failed');
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        price: Number(form.price || 0),
        stockQuantity: Number(form.stockQuantity || 0),
        minStockLevel: Number(form.minStockLevel || 0),
      };

      if (editing) {
        await api.put(`/api/products/${editing.productId}`, payload);
        setToast('Product updated');
      } else {
        await api.post('/api/products', payload);
        setToast('Product created');
      }

      resetForm();
      loadProducts();
    } catch (err) {
      console.error(err);
      setToast('Save failed – please check inputs');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p className="page-subtitle">
            Manage products synced with the E-commerce website
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '16px' }}>
          {editing ? 'Edit Product' : 'Add New Product'}
        </h3>

        <form onSubmit={onSubmit}>
          <div className="grid-2">
            <div className="form-row">
              <label>Product Code (SKU) *</label>
              <input
                className="input"
                name="productCode"
                value={form.productCode}
                onChange={onChange}
                placeholder="LAP-001, PHN-001..."
                required
              />
            </div>

            <div className="form-row">
              <label>Product Name *</label>
              <input
                className="input"
                name="productName"
                value={form.productName}
                onChange={onChange}
                placeholder="Laptop, Phone..."
                required
              />
            </div>

            <div className="form-row">
              <label>Category</label>
              <input
                className="input"
                name="category"
                value={form.category}
                onChange={onChange}
                placeholder="Electronics, Accessories..."
              />
            </div>

            <div className="form-row">
              <label>Price (₹)</label>
              <input
                type="number"
                className="input"
                name="price"
                value={form.price}
                onChange={onChange}
                min="0"
              />
            </div>

            <div className="form-row">
              <label>Stock Quantity</label>
              <input
                type="number"
                className="input"
                name="stockQuantity"
                value={form.stockQuantity}
                onChange={onChange}
                min="0"
              />
            </div>

            <div className="form-row">
              <label>Min Stock Level</label>
              <input
                type="number"
                className="input"
                name="minStockLevel"
                value={form.minStockLevel}
                onChange={onChange}
                min="0"
              />
            </div>
          </div>

          <div className="form-row">
            <label>Description</label>
            <textarea
              className="input"
              name="description"
              value={form.description}
              onChange={onChange}
              rows="3"
              placeholder="Short description for this product"
            />
          </div>

          <div
            className="form-row"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={form.isActive}
              onChange={onChange}
            />
            <label htmlFor="isActive" style={{ margin: 0 }}>
              Active (visible on E-commerce)
            </label>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            {editing && (
              <button
                type="button"
                className="btn btn-muted"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
            <button className="btn btn-primary" type="submit">
              {editing ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>

      {/* Products Table */}
      <div className="card">
        <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
          <h3>All Products</h3>
          <span style={{ color: '#64748b', fontSize: '14px' }}>
            Total: {products.length}
          </span>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading products...</div>
        ) : products.length ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Min Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.productId}>
                    <td>{p.productCode}</td>
                    <td>{p.productName}</td>
                    <td>{p.category}</td>
                    <td>₹{(p.price ?? 0).toLocaleString()}</td>
                    <td>{p.stockQuantity}</td>
                    <td>{p.minStockLevel}</td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: p.isActive ? '#10b981' : '#6b7280',
                          color: 'white',
                        }}
                      >
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-muted btn-sm"
                        style={{ marginRight: '8px' }}
                        onClick={() => onEdit(p)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => onDelete(p.productId)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📦</div>
            <p className="text-muted">No products found.</p>
          </div>
        )}
      </div>

      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  );
}
