import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  // State to store dashboard data
  const [ordersToday, setOrdersToday] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch data when component loads
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Function to fetch all dashboard data
  async function fetchDashboardData() {
    try {
      // Fetch all orders
      const ordersResponse = await fetch('http://localhost:8080/api/orders');
      const ordersData = await ordersResponse.json();
      
      // Fetch all products for low stock count
      const productsResponse = await fetch('http://localhost:8080/api/products');
      const productsData = await productsResponse.json();

      // Calculate total orders
      setTotalOrders(ordersData.length);

      // Calculate orders today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayOrders = ordersData.filter(order => {
        const orderDate = new Date(order.orderDate);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === today.getTime();
      });
      setOrdersToday(todayOrders.length);

      // Calculate pending orders
      const pending = ordersData.filter(order => 
        order.status === 'PENDING' || order.status === 'CONFIRMED'
      );
      setPendingOrders(pending.length);

      // Calculate low stock items (less than 50)
      const lowStock = productsData.filter(product => 
        product.stockQuantity < 50
      );
      setLowStockItems(lowStock.length);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1>Dashboard</h1>
            <p className="page-subtitle">Overview of your system</p>
          </div>
        </div>
        <div className="card">
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">Overview of your system</p>
        </div>
      </div>

      <div className="card">
        <h3>Welcome</h3>
        <p>Your Order Management System is ready!</p>
      </div>

      <div className="card-grid">
        <div className="card">
          <h4>Total Orders</h4>
          <p className="stat-number">{totalOrders}</p>
        </div>
        
        <div className="card">
          <h4>Orders Today</h4>
          <p className="stat-number">{ordersToday}</p>
        </div>
        
        <div className="card">
          <h4>Pending Orders</h4>
          <p className="stat-number">{pendingOrders}</p>
        </div>
        
        <div className="card">
          <h4>Low Stock Items</h4>
          <p className="stat-number">{lowStockItems}</p>
        </div>
      </div>

      <button 
        onClick={fetchDashboardData}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          background: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Refresh Data
      </button>
    </div>
  );
}