import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

export default function OrderEnquiry() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Fetch orders on component mount and set up polling
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/api/orders');
      const data = response.data;
      // Sort by most recent first
      const sortedOrders = data.sort((a, b) => b.orderId - a.orderId);
      setOrders(sortedOrders);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        showToast('Session expired. Please login again.', 'error');
        return;
      }
      console.error('Error fetching orders:', error);
      showToast('Failed to load orders from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await api.put(`/api/orders/${orderId}/status`, { status: newStatus });
      const updatedOrder = response.data;
      setOrders(prev =>
        prev.map(o => (o.orderId === orderId ? updatedOrder : o))
      );
      setSelectedOrder(updatedOrder);
      showToast(`Order status updated to ${newStatus}`, 'success');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        showToast('Session expired. Please login again.', 'error');
        return;
      }
      console.error('Error updating order status:', error);
      showToast('Failed to update order status', 'error');
    }
  };

  const deleteOrder = async orderId => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      await api.delete(`/api/orders/${orderId}`);
      setOrders(prev => prev.filter(o => o.orderId !== orderId));
      showToast('Order deleted successfully', 'success');
      setSelectedOrder(null);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        showToast('Session expired. Please login again.', 'error');
        return;
      }
      console.error('Error deleting order:', error);
      showToast('Failed to delete order', 'error');
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: '', type: '' }),
      4000
    );
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.externalOrderId
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.customerName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.productName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.orderId?.toString().includes(searchTerm);

    const matchesStatus =
      statusFilter === 'ALL' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Get status counts
  const statusCounts = {
    ALL: orders.length,
    CONFIRMED: orders.filter(o => o.status === 'CONFIRMED').length,
    PROCESSING: orders.filter(o => o.status === 'PROCESSING').length,
    SHIPPED: orders.filter(o => o.status === 'SHIPPED').length,
    DELIVERED: orders.filter(o => o.status === 'DELIVERED').length,
    CANCELLED: orders.filter(o => o.status === 'CANCELLED').length
  };

  const getStatusColor = status => {
    const colors = {
      CONFIRMED: '#3b82f6',
      PROCESSING: '#f59e0b',
      SHIPPED: '#8b5cf6',
      DELIVERED: '#10b981',
      CANCELLED: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getPlatformIcon = platform => {
    return platform === 'ECOMMERCE' ? '🛍️' : '📱';
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Orders</h1>
          <p style={styles.subtitle}>
            View and manage orders from all platforms
          </p>
        </div>
        <button onClick={fetchOrders} style={styles.refreshButton}>
          🔄 Refresh
        </button>
      </div>

      {/* Stats Bar */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📦</div>
          <div>
            <div style={styles.statValue}>{orders.length}</div>
            <div style={styles.statLabel}>Total Orders</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div
            style={{
              ...styles.statIcon,
              backgroundColor: '#dbeafe',
              color: '#1e40af'
            }}
          >
            ⏳
          </div>
          <div>
            <div style={styles.statValue}>
              {statusCounts.CONFIRMED + statusCounts.PROCESSING}
            </div>
            <div style={styles.statLabel}>Pending</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div
            style={{
              ...styles.statIcon,
              backgroundColor: '#d1fae5',
              color: '#065f46'
            }}
          >
            ✅
          </div>
          <div>
            <div style={styles.statValue}>{statusCounts.DELIVERED}</div>
            <div style={styles.statLabel}>Delivered</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div
            style={{
              ...styles.statIcon,
              backgroundColor: '#fef3c7',
              color: '#92400e'
            }}
          >
            💰
          </div>
          <div>
            <div style={styles.statValue}>
              ₹
              {orders
                .reduce((sum, o) => sum + (o.totalAmount || 0), 0)
                .toLocaleString()}
            </div>
            <div style={styles.statLabel}>Total Revenue</div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div style={styles.filterBar}>
        <input
          type="text"
          placeholder="Search by Order ID, Customer, or Product..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <div style={styles.statusFilters}>
          {[
            'ALL',
            'CONFIRMED',
            'PROCESSING',
            'SHIPPED',
            'DELIVERED',
            'CANCELLED'
          ].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{
                ...styles.filterButton,
                ...(statusFilter === status ? styles.filterButtonActive : {})
              }}
            >
              {status} ({statusCounts[status] || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid */}
      <div style={styles.ordersGrid}>
        {filteredOrders.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📭</div>
            <h3>No orders found</h3>
            <p>Orders from e-commerce will appear here automatically</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div
              key={order.orderId}
              style={styles.orderCard}
              onClick={() => setSelectedOrder(order)}
            >
              <div style={styles.orderHeader}>
                <div style={styles.orderIdSection}>
                  <span style={styles.platformBadge}>
                    {getPlatformIcon(order.platform)} {order.platform}
                  </span>
                  <span style={styles.orderId}>
                    #{order.externalOrderId || order.orderId}
                  </span>
                </div>
                <span
                  style={{
                    ...styles.statusBadge,
                    backgroundColor: getStatusColor(order.status) + '20',
                    color: getStatusColor(order.status)
                  }}
                >
                  {order.status}
                </span>
              </div>

              <div style={styles.orderContent}>
                <div style={styles.productInfo}>
                  <div style={styles.productIcon}>📱</div>
                  <div>
                    <div style={styles.productName}>{order.productName}</div>
                    <div style={styles.productQuantity}>
                      Quantity: {order.quantity}
                    </div>
                  </div>
                </div>

                <div style={styles.customerInfo}>
                  <div style={styles.infoRow}>
                    <span style={styles.infoIcon}>👤</span>
                    <span>{order.customerName}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoIcon}>📧</span>
                    <span style={styles.infoEmail}>{order.customerEmail}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoIcon}>📞</span>
                    <span>{order.customerPhone}</span>
                  </div>
                </div>

                <div style={styles.orderFooter}>
                  <div style={styles.amount}>
                    ₹{order.totalAmount?.toLocaleString()}
                  </div>
                  <div style={styles.orderDate}>
                    {order.orderDate
                      ? new Date(order.orderDate).toLocaleDateString()
                      : 'Today'}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          style={styles.modalOverlay}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            style={styles.modal}
            onClick={e => e.stopPropagation()}
          >
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                style={styles.closeButton}
              >
                ✕
              </button>
            </div>

            <div style={styles.modalContent}>
              <div style={styles.detailSection}>
                <h3 style={styles.sectionTitle}>Order Information</h3>
                <div style={styles.detailGrid}>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Order ID:</span>
                    <span style={styles.detailValue}>
                      #{selectedOrder.externalOrderId || selectedOrder.orderId}
                    </span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Platform:</span>
                    <span style={styles.detailValue}>
                      {getPlatformIcon(selectedOrder.platform)}{' '}
                      {selectedOrder.platform}
                    </span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Status:</span>
                    <span
                      style={{
                        ...styles.detailValue,
                        ...styles.statusBadge,
                        backgroundColor:
                          getStatusColor(selectedOrder.status) + '20',
                        color: getStatusColor(selectedOrder.status)
                      }}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Date:</span>
                    <span style={styles.detailValue}>
                      {selectedOrder.orderDate
                        ? new Date(
                            selectedOrder.orderDate
                          ).toLocaleString()
                        : 'Today'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={styles.detailSection}>
                <h3 style={styles.sectionTitle}>Product Details</h3>
                <div style={styles.productDetail}>
                  <div style={styles.productIcon}>📱</div>
                  <div style={{ flex: 1 }}>
                    <div style={styles.productName}>
                      {selectedOrder.productName}
                    </div>
                    <div style={styles.productQuantity}>
                      Quantity: {selectedOrder.quantity}
                    </div>
                  </div>
                  <div style={styles.amount}>
                    ₹{selectedOrder.totalAmount?.toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={styles.detailSection}>
                <h3 style={styles.sectionTitle}>Customer Information</h3>
                <div style={styles.customerDetail}>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Name:</span>
                    <span style={styles.detailValue}>
                      {selectedOrder.customerName}
                    </span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Email:</span>
                    <span style={styles.detailValue}>
                      {selectedOrder.customerEmail}
                    </span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Phone:</span>
                    <span style={styles.detailValue}>
                      {selectedOrder.customerPhone}
                    </span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Address:</span>
                    <span style={styles.detailValue}>
                      {selectedOrder.shippingAddress}
                    </span>
                  </div>
                </div>
              </div>

              <div style={styles.detailSection}>
                <h3 style={styles.sectionTitle}>Update Status</h3>
                <div style={styles.statusButtons}>
                  {[
                    'CONFIRMED',
                    'PROCESSING',
                    'SHIPPED',
                    'DELIVERED',
                    'CANCELLED'
                  ].map(status => (
                    <button
                      key={status}
                      onClick={() =>
                        updateOrderStatus(selectedOrder.orderId, status)
                      }
                      disabled={selectedOrder.status === status}
                      style={{
                        ...styles.statusButton,
                        backgroundColor: getStatusColor(status),
                        opacity: selectedOrder.status === status ? 0.5 : 1,
                        cursor:
                          selectedOrder.status === status
                            ? 'not-allowed'
                            : 'pointer'
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                onClick={() => deleteOrder(selectedOrder.orderId)}
                style={styles.deleteButton}
              >
                🗑️ Delete Order
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                style={styles.closeModalButton}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div
          style={{
            ...styles.toast,
            ...(toast.type === 'error'
              ? styles.toastError
              : styles.toastSuccess)
          }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '30px',
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  loading: {
    textAlign: 'center',
    padding: '100px 20px',
    color: '#666'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #2563eb',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '0 0 8px 0'
  },
  subtitle: {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0
  },
  refreshButton: {
    padding: '12px 24px',
    backgroundColor: 'var(--burning-flame)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(255, 86, 0, 0.25)'
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  statIcon: {
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    backgroundColor: '#e0e7ff',
    borderRadius: '10px'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937'
  },
  statLabel: {
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '4px'
  },
  filterBar: {
    marginBottom: '30px'
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '16px',
    boxSizing: 'border-box'
  },
  statusFilters: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  filterButton: {
    padding: '8px 16px',
    border: '1px solid #d1d5db',
    backgroundColor: 'white',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  filterButtonActive: {
    backgroundColor: 'var(--blue-fantastic)',
    color: 'white',
    borderColor: 'var(--blue-fantastic)'
  },
  ordersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px'
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  },
  orderIdSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  platformBadge: {
    fontSize: '12px',
    padding: '4px 8px',
    backgroundColor: '#f3f4f6',
    borderRadius: '6px',
    display: 'inline-block'
  },
  orderId: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1f2937'
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600'
  },
  orderContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  productInfo: {
    display: 'flex',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px'
  },
  productIcon: {
    fontSize: '32px'
  },
  productName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '4px'
  },
  productQuantity: {
    fontSize: '14px',
    color: '#6b7280'
  },
  customerInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#374151'
  },
  infoIcon: {
    fontSize: '16px',
    width: '20px'
  },
  infoEmail: {
    fontSize: '13px',
    color: '#6b7280'
  },
  orderFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: '1px solid #e5e7eb'
  },
  amount: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#2563eb'
  },
  orderDate: {
    fontSize: '14px',
    color: '#6b7280'
  },
  emptyState: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '60px 20px',
    color: '#9ca3af'
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px'
  },
  modalOverlay: {
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
    padding: '20px'
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    maxWidth: '700px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid #e5e7eb'
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0
  },
  closeButton: {
    width: '32px',
    height: '32px',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '20px',
    color: '#6b7280',
    cursor: 'pointer',
    borderRadius: '6px'
  },
  modalContent: {
    padding: '24px'
  },
  detailSection: {
    marginBottom: '24px'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '12px'
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px'
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  detailLabel: {
    fontSize: '12px',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  detailValue: {
    fontSize: '14px',
    color: '#1f2937',
    fontWeight: '500'
  },
  productDetail: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px'
  },
  customerDetail: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  statusButtons: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  statusButton: {
    padding: '10px 16px',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  modalFooter: {
    display: 'flex',
    gap: '12px',
    padding: '24px',
    borderTop: '1px solid #e5e7eb',
    justifyContent: 'space-between'
  },
  deleteButton: {
    padding: '10px 20px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  closeModalButton: {
    padding: '10px 20px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  toast: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    padding: '16px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    zIndex: 2000
  },
  toastSuccess: {
    backgroundColor: '#d1fae5',
    color: '#065f46'
  },
  toastError: {
    backgroundColor: '#fee2e2',
    color: '#991b1b'
  }
};