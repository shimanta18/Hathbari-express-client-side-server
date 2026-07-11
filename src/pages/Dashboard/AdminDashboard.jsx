import { useEffect, useState } from 'react';

const AdminDashboard = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' or 'orders'

  // Data States
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    name: '', category: 'VEGETABLES', weight: '', price: '', oldPrice: '', discount: '', image: ''
  });

  // 📡 Fetch live product counts from database
  const fetchInventory = () => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error updating inventory:", err));
  };

  // 📡 Fetch live consumer orders from database
  const fetchOrders = () => {
    fetch('http://localhost:5000/api/admin/orders')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error("Error fetching admin orders:", err));
  };

  useEffect(() => { 
    fetchInventory(); 
    fetchOrders();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit product form handler
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(() => {
      alert("Product synced live to MongoDB Atlas!");
      setFormData({ name: '', category: 'VEGETABLES', weight: '', price: '', oldPrice: '', discount: '', image: '' });
      fetchInventory(); 
    })
    .catch(err => alert("Error posting document: " + err));
  };

  // Delete product document handler
  const handleDeleteProduct = (id) => {
    if(window.confirm("Are you sure you want to completely remove this product?")) {
      fetch(`http://localhost:5000/api/admin/products/${id}`, { method: 'DELETE' })
        .then(() => {
          fetchInventory();
        });
    }
  };

  // 🟢 Update order status handler (Processing -> Delivered)
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    fetch(`http://localhost:5000/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    .then((res) => {
      if (res.ok) {
        fetchOrders(); // Live reload orders list to update UI
      } else {
        alert("Failed to update order status.");
      }
    })
    .catch((err) => console.error("Error updating order status:", err));
  };

  // Count active pending/processing orders
  const pendingOrdersCount = orders.filter(o => o.status !== 'Delivered').length;

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      
      {/* Sidebar Panel Layout */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col gap-6">
        <h1 className="text-2xl font-black text-[#00B058] tracking-tight"> Admin Panel</h1>
        <nav className="flex flex-col gap-2 font-bold text-gray-500 text-sm">
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`p-3 rounded-xl text-left transition-colors cursor-pointer w-full ${
              activeTab === 'inventory' ? 'bg-green-50 text-[#00B058]' : 'hover:bg-gray-50'
            }`}
          >
             Product Inventory
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`p-3 rounded-xl text-left transition-colors cursor-pointer w-full flex justify-between items-center ${
              activeTab === 'orders' ? 'bg-green-50 text-[#00B058]' : 'hover:bg-gray-50'
            }`}
          >
            <span> User Orders</span>
            {pendingOrdersCount > 0 && (
              <span className="bg-[#00B058] text-white text-xs px-2 py-0.5 rounded-full font-black">
                {pendingOrdersCount}
              </span>
            )}
          </button>
          <span className="p-3 hover:bg-gray-50 rounded-xl cursor-not-allowed text-gray-300 transition-colors">
             Live Traffic Logs
          </span>
        </nav>
      </div>

      {/* Main Core View Area */}
      <div className="flex-1 p-10 max-w-6xl">
        
        {/* Dynamic Top Header Stats */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left">
            <span className="text-xs font-bold text-gray-400 uppercase">Live Database SKU Count</span>
            <h2 className="text-3xl font-extrabold text-gray-800 mt-1">{products.length} Items</h2>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left">
            <span className="text-xs font-bold text-gray-400 uppercase">Pending Deliveries</span>
            <h2 className="text-3xl font-extrabold text-amber-500 mt-1">{pendingOrdersCount} Active</h2>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left">
            <span className="text-xs font-bold text-gray-400 uppercase">Connection Status</span>
            <h2 className="text-3xl font-extrabold text-[#00B058] mt-1">Healthy</h2>
          </div>
        </div>

        {/* 🟢 VIEW 1: PRODUCT INVENTORY MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add New Product Box */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left h-fit">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Add Database Document</h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-sm font-semibold text-gray-600">
                <div>
                  <label className="block mb-1">Product Title</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:border-[#00B058]" placeholder="Organic Red Apples"/>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block mb-1">Category</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg p-2.5 outline-none">
                      <option value="VEGETABLES">Vegetables</option>
                      <option value="FRUITS">Fruits</option>
                      <option value="DAIRY">Dairy</option>
                      <option value="SNACKS">Snacks</option>
                      <option value="DRINKS">Drinks</option>
                      <option value="MEAT">Meat</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1">Weight Bundle</label>
                    <input type="text" name="weight" value={formData.weight} onChange={handleInputChange} required className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:border-[#00B058]" placeholder="1kg or 500g"/>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block mb-1">Price (৳)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} required className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:border-[#00B058]" placeholder="120"/>
                  </div>
                  <div>
                    <label className="block mb-1">Old Price (Optional)</label>
                    <input type="number" name="oldPrice" value={formData.oldPrice} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:border-[#00B058]" placeholder="150"/>
                  </div>
                </div>
                <div>
                  <label className="block mb-1">Discount Tag (Optional)</label>
                  <input type="text" name="discount" value={formData.discount} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:border-[#00B058]" placeholder="-20% OFF"/>
                </div>
                <div>
                  <label className="block mb-1">Image URL Address</label>
                  <input type="url" name="image" value={formData.image} onChange={handleInputChange} required className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:border-[#00B058]" placeholder="https://unsplash.com/..."/>
                </div>
                <button type="submit" className="w-full bg-[#00B058] hover:bg-[#008A45] text-white font-bold py-3 rounded-xl transition-all mt-2 cursor-pointer shadow-sm text-center">
                  Add to Database
                </button>
              </form>
            </div>

            {/* Live Inventory Records Box */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Active Database Records</h3>
              <div className="flex flex-col gap-3 max-h-[520px] overflow-y-auto pr-2">
                {products.map((item) => (
                  <div key={item._id} className="flex items-center justify-between border border-gray-100 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg bg-gray-100"/>
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm leading-tight">{item.name}</h4>
                        <span className="text-[10px] bg-gray-100 text-gray-500 font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider mt-1 inline-block">
                          {item.category} • {item.weight}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-black text-gray-800 text-sm">৳{item.price}</span>
                      <button 
                        onClick={() => handleDeleteProduct(item._id)}
                        className="text-xs bg-red-50 hover:bg-red-100 text-red-600 font-bold px-3 py-2 rounded-lg cursor-pointer transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 🟢 VIEW 2: ORDER MANAGEMENT PANEL */}
        {activeTab === 'orders' && (
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Live Customer Order Feed</h3>
            
            {orders.length === 0 ? (
              <div className="text-center py-12 text-gray-400 font-bold">No orders found in database history.</div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order._id || order.orderId} className="border border-gray-100 rounded-xl overflow-hidden shadow-xs bg-[#FAFBFB]">
                    
                    {/* Top bar header inside order card */}
                    <div className="bg-white px-5 py-3 border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-sm text-gray-800">Order ID: {order.orderId || order._id}</span>
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                          order.status === 'Delivered' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          ● {order.status || 'Processing'}
                        </span>
                      </div>
                      
                      {/* Action buttons matching state patterns */}
                      {order.status !== 'Delivered' ? (
                        <button
                          onClick={() => handleUpdateOrderStatus(order._id || order.orderId, 'Delivered')}
                          className="bg-[#00B058] hover:bg-[#008A45] text-white text-xs font-black px-4 py-2 rounded-lg transition-all shadow-xs cursor-pointer"
                        >
                          Mark as Delivered ✅
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-gray-400 italic">Fulfillment Complete</span>
                      )}
                    </div>

                    {/* Mid body: customer breakdown & weight arrays checklist */}
                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-semibold">
                      <div className="space-y-1 text-gray-600">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Shipping Details</p>
                        <p><span className="text-gray-900 font-bold">Name:</span> {order.shippingDetails?.name}</p>
                        <p><span className="text-gray-900 font-bold">Phone:</span> {order.shippingDetails?.phone}</p>
                        <p><span className="text-gray-900 font-bold">Address:</span> {order.shippingDetails?.address}</p>
                      </div>

                      <div className="bg-white border border-gray-50 rounded-xl p-4">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Basket Packing List</p>
                        <div className="space-y-1 text-gray-800">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs">
                              <span>🛒 {item.name} <span className="text-gray-400 font-medium">(x{item.quantity})</span></span>
                              <span className="font-bold text-gray-900">৳{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                          <div className="border-t border-gray-100 pt-2 mt-2 flex justify-between text-sm font-black text-gray-900">
                            <span>Total Earnings:</span>
                            <span className="text-[#00B058]">৳{(order.totalAmount || order.total).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;