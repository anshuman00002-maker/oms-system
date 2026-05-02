import React, { useState, useEffect } from 'react';

export default function Reports() {
  // State for all report data
  const [loading, setLoading] = useState(true);
  
  // Sales statistics
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  const [salesByPlatform, setSalesByPlatform] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  
  // Inventory statistics
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [stockByCategory, setStockByCategory] = useState([]);

  // Fetch data when component loads
  useEffect(() => {
    // Function to fetch all data and calculate statistics
    async function fetchReportData() {
      try {
        setLoading(true);

        // Fetch orders and products
        const [ordersRes, productsRes] = await Promise.all([
          fetch('http://localhost:8080/api/orders'),
          fetch('http://localhost:8080/api/products')
        ]);

        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();

        // Calculate Sales Report
        calculateSalesReport(ordersData);
        
        // Calculate Inventory Report
        calculateInventoryReport(productsData, ordersData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching report data:', error);
        setLoading(false);
      }
    }

    fetchReportData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to manually refresh data
  function refreshReports() {
    async function fetchData() {
      try {
        setLoading(true);

        const [ordersRes, productsRes] = await Promise.all([
          fetch('http://localhost:8080/api/orders'),
          fetch('http://localhost:8080/api/products')
        ]);

        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();

        calculateSalesReport(ordersData);
        calculateInventoryReport(productsData, ordersData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching report data:', error);
        setLoading(false);
      }
    }
    fetchData();
  }

  // Calculate sales statistics
  function calculateSalesReport(ordersData) {
    // Total sales amount
    const total = ordersData.reduce((sum, order) => sum + order.totalAmount, 0);
    setTotalSales(total);

    // Total orders
    setTotalOrders(ordersData.length);

    // Average order value
    const avg = ordersData.length > 0 ? total / ordersData.length : 0;
    setAverageOrderValue(avg);

    // Sales by platform
    const platformSales = {};
    ordersData.forEach(order => {
      const platform = order.platform || 'UNKNOWN';
      if (!platformSales[platform]) {
        platformSales[platform] = { count: 0, amount: 0 };
      }
      platformSales[platform].count++;
      platformSales[platform].amount += order.totalAmount;
    });
    
    const platformArray = Object.keys(platformSales).map(platform => ({
      platform,
      orders: platformSales[platform].count,
      sales: platformSales[platform].amount
    }));
    setSalesByPlatform(platformArray);

    // Top products by order quantity
    const productSales = {};
    ordersData.forEach(order => {
      const productName = order.productName;
      if (!productSales[productName]) {
        productSales[productName] = { quantity: 0, revenue: 0 };
      }
      productSales[productName].quantity += order.quantity;
      productSales[productName].revenue += order.totalAmount;
    });

    const topProductsArray = Object.keys(productSales)
      .map(name => ({
        name,
        quantity: productSales[name].quantity,
        revenue: productSales[name].revenue
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    
    setTopProducts(topProductsArray);
  }

  // Calculate inventory statistics
  function calculateInventoryReport(productsData, ordersData) {
    // Total products
    setTotalProducts(productsData.length);

    // Total stock
    const stock = productsData.reduce((sum, p) => sum + p.stockQuantity, 0);
    setTotalStock(stock);

    // Low stock products (less than 50)
    const lowStock = productsData
      .filter(p => p.stockQuantity < 50)
      .sort((a, b) => a.stockQuantity - b.stockQuantity)
      .slice(0, 10);
    setLowStockProducts(lowStock);

    // Stock by category
    const categoryStock = {};
    productsData.forEach(product => {
      const category = product.category || 'Uncategorized';
      if (!categoryStock[category]) {
        categoryStock[category] = { count: 0, stock: 0 };
      }
      categoryStock[category].count++;
      categoryStock[category].stock += product.stockQuantity;
    });

    const categoryArray = Object.keys(categoryStock).map(category => ({
      category,
      products: categoryStock[category].count,
      stock: categoryStock[category].stock
    }));
    setStockByCategory(categoryArray);
  }

  // Loading state
  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Reports</h1>
          <p className="page-subtitle">View analytics and reports</p>
        </div>
        <div className="card">
          <p>Loading report data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Reports</h1>
          <p className="page-subtitle">View analytics and reports</p>
        </div>
        <button 
          onClick={refreshReports}
          style={{
            padding: '10px 20px',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Refresh Reports
        </button>
      </div>

      {/* SALES REPORT */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h2 style={{ marginBottom: '20px', color: '#2563eb' }}>📊 Sales Report</h2>
        
        {/* Sales Summary Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px',
          marginBottom: '30px'
        }}>
          <div style={{ 
            background: '#f0f9ff', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #bae6fd'
          }}>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Total Sales</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#0369a1' }}>
              ₹{totalSales.toLocaleString()}
            </p>
          </div>
          
          <div style={{ 
            background: '#f0fdf4', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #bbf7d0'
          }}>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Total Orders</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#15803d' }}>
              {totalOrders}
            </p>
          </div>
          
          <div style={{ 
            background: '#fef3c7', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #fde68a'
          }}>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Avg Order Value</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#ca8a04' }}>
              ₹{Math.round(averageOrderValue).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Sales by Platform */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px' }}>Sales by Platform</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Platform</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Orders</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Total Sales</th>
                </tr>
              </thead>
              <tbody>
                {salesByPlatform.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px' }}>{item.platform}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>{item.orders}</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>
                      ₹{item.sales.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div>
          <h3 style={{ marginBottom: '15px' }}>Top 5 Products by Revenue</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Product</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Quantity Sold</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px' }}>{product.name}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>{product.quantity}</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#10b981' }}>
                      ₹{product.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* INVENTORY REPORT */}
      <div className="card">
        <h2 style={{ marginBottom: '20px', color: '#2563eb' }}>📦 Inventory Report</h2>
        
        {/* Inventory Summary Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px',
          marginBottom: '30px'
        }}>
          <div style={{ 
            background: '#faf5ff', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #e9d5ff'
          }}>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Total Products</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#7c3aed' }}>
              {totalProducts}
            </p>
          </div>
          
          <div style={{ 
            background: '#fef2f2', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #fecaca'
          }}>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Total Stock Units</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#dc2626' }}>
              {totalStock}
            </p>
          </div>
          
          <div style={{ 
            background: '#fff7ed', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #fed7aa'
          }}>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Low Stock Items</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#ea580c' }}>
              {lowStockProducts.length}
            </p>
          </div>
        </div>

        {/* Stock by Category */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px' }}>Stock by Category</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Category</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Products</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Total Stock</th>
                </tr>
              </thead>
              <tbody>
                {stockByCategory.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px' }}>{item.category}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>{item.products}</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>
                      {item.stock}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Products */}
        {lowStockProducts.length > 0 && (
          <div>
            <h3 style={{ marginBottom: '15px', color: '#dc2626' }}>⚠️ Low Stock Alert</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#fef2f2', borderBottom: '2px solid #fecaca' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Product</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>SKU</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Stock</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.map((product, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px' }}>{product.productName}</td>
                      <td style={{ padding: '12px' }}>{product.productCode}</td>
                      <td style={{ 
                        padding: '12px', 
                        textAlign: 'right', 
                        fontWeight: 'bold',
                        color: product.stockQuantity < 20 ? '#dc2626' : '#ea580c'
                      }}>
                        {product.stockQuantity}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        ₹{product.price.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}