import { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Read initialization directly from storage
  const [liveAddress, setLiveAddress] = useState(() => 
    localStorage.getItem('latestDeliveryAddress') || ''
  );

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    oldPrice: '',
    category: '',
    description: '',
    image: '',
  });

  // Automatically keeps tabs synced if changed elsewhere in the browser
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'latestDeliveryAddress') {
        setLiveAddress(e.newValue || 'No recent delivery address found.');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fetch data dynamically based on active tab focus
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (activeTab === 'inventory') {
          const res = await fetch(`${API_BASE}/api/products`);
          if (!res.ok) throw new Error('Failed to fetch products');
          const data = await res.json();
          setProducts(data);
        } else if (activeTab === 'orders') {
          const res = await fetch(`${API_BASE}/api/admin/orders`);
          if (!res.ok) throw new Error('Failed to fetch orders');
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const payload = {
      ...formData,
      price: Number(formData.price),
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : undefined,
    };

    try {
      const res = await fetch(`${API_BASE}/api/admin/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to add product');
      
      const newProduct = await res.json();
      setProducts((prev) => [newProduct, ...prev]);
      
      setFormData({
        name: '',
        price: '',
        oldPrice: '',
        category: '',
        description: '',
        image: '',
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMarkAsDelivered = async (orderId) => {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Delivered' }),
      });

      if (!res.ok) throw new Error('Failed to update status on the server');

      const targetOrder = orders.find(order => (order._id || order.id) === orderId);
      const deliveryAddressValue = targetOrder?.shippingAddress || targetOrder?.shippingDetails?.address || 'Dhaka, Bangladesh';

      // Save to localStorage and update state directly
      localStorage.setItem('latestDeliveryAddress', deliveryAddressValue);
      setLiveAddress(deliveryAddressValue);

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          (order._id || order.id) === orderId ? { ...order, status: 'Delivered' } : order
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Direct manual sync hook reads current actual localStorage state
  const triggerAddressSync = () => {
    const currentStorageAddress = localStorage.getItem('latestDeliveryAddress');
    setLiveAddress(currentStorageAddress || 'No recent delivery address found.');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Control Bar */}
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-5">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Control Panel</h1>
          <button 
            onClick={triggerAddressSync}
            className="btn btn-outline btn-sm normal-case text-gray-600 hover:bg-gray-100"
          >
            Sync Live Address Feed
          </button>
        </div>

        {/* Real-time Synced Address Feed Display Box */}
        {liveAddress && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 flex items-center justify-between shadow-xs transition-all">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">Latest Delivered Destination Feed</span>
              <span className="text-sm font-semibold text-emerald-900">{liveAddress}</span>
            </div>
            <span className="badge badge-success text-white font-bold text-xs uppercase px-2 py-1">Live Connected</span>
          </div>
        )}

        {/* Tab Switchers */}
        <div className="tabs tabs-boxed mb-6 bg-white p-2 shadow-sm inline-flex border border-gray-100">
          <button
            className={`tab tab-lg font-medium transition-all ${activeTab === 'inventory' ? 'tab-active bg-green-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setActiveTab('inventory')}
          >
            Inventory Management
          </button>
          <button
            className={`tab tab-lg font-medium transition-all ${activeTab === 'orders' ? 'tab-active bg-green-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setActiveTab('orders')}
          >
            Order Feeds
          </button>
        </div>

        {error && (
          <div className="alert alert-error mb-6 shadow-xs rounded-xl">
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : activeTab === 'inventory' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Create Product Form Card */}
            <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-100 h-fit">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Stock</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control w-full">
                  <label className="label"><span className="label-text font-medium text-gray-700">Product Title</span></label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Ergonomic Keyboard"
                    className="input input-bordered w-full focus:input-primary text-gray-800"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control w-full">
                    <label className="label"><span className="label-text font-medium text-gray-700">Sale Price (৳)</span></label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="2500"
                      className="input input-bordered w-full focus:input-primary text-gray-800"
                      required
                    />
                  </div>
                  <div className="form-control w-full">
                    <label className="label"><span className="label-text font-medium text-gray-700">Old Price (৳)</span></label>
                    <input
                      type="number"
                      name="oldPrice"
                      value={formData.oldPrice}
                      onChange={handleInputChange}
                      placeholder="3200"
                      className="input input-bordered w-full focus:input-primary text-gray-800"
                    />
                  </div>
                </div>

                <div className="form-control w-full">
                  <label className="label"><span className="label-text font-medium text-gray-700">Category Tag</span></label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="Peripherals"
                    className="input input-bordered w-full focus:input-primary text-gray-800"
                    required
                  />
                </div>

                <div className="form-control w-full">
                  <label className="label"><span className="label-text font-medium text-gray-700">Image Asset URL</span></label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://assets.site.com/image.png"
                    className="input input-bordered w-full focus:input-primary text-gray-800"
                  />
                </div>

                <div className="form-control w-full">
                  <label className="label"><span className="label-text font-medium text-gray-700">Item Specifications</span></label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe materials, warranty, options..."
                    className="textarea textarea-bordered w-full h-24 focus:textarea-primary text-gray-800"
                  ></textarea>
                </div>

                <button type="submit" className="btn bg-green-600 w-full text-white mt-2">
                  Push to Live Catalog
                </button>
              </form>
            </div>

            {/* Inventory List Card */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">Current Stock List ({products.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="table w-full table-zebra">
                  <thead>
                    <tr className="text-gray-600 bg-gray-50">
                      <th>Product Info</th>
                      <th>Category</th>
                      <th>Price Metrics</th>
                      <th>Status Flags</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-12 text-gray-400 font-medium">No live inventory entries found.</td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product._id || product.id}>
                          <td>
                            <div className="flex items-center space-x-3">
                              {product.image && (
                                <div className="avatar">
                                  <div className="mask mask-squircle w-12 h-12 bg-gray-100">
                                    <img src={product.image} alt={product.name} />
                                  </div>
                                </div>
                              )}
                              <div>
                                <div className="font-bold text-gray-800">{product.name}</div>
                                <div className="text-xs text-gray-400 max-w-xs truncate">{product.description}</div>
                              </div>
                            </div>
                          </td>
                          <td><span className="badge badge-neutral badge-sm font-semibold">{product.category}</span></td>
                          <td>
                            <div className="font-semibold text-gray-900">৳{(product.price || 0).toLocaleString()}</div>
                            {product.oldPrice && (
                              <div className="text-xs text-gray-400 line-through">৳{product.oldPrice.toLocaleString()}</div>
                            )}
                          </td>
                          <td><span className="badge badge-success badge-xs py-2 px-3 text-white font-medium">Active</span></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
            {/* Order Feed Card Panel */}
            <h2 className="text-xl font-bold text-gray-800 mb-6">Real-Time Order Streams ({orders.length})</h2>
            {orders.length === 0 ? (
              <div className="text-center py-20 text-gray-400 font-medium">Waiting for incoming checkouts...</div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order._id || order.id} className="border border-gray-200 rounded-xl p-5 bg-gray-50 hover:bg-white transition-all shadow-2xs">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4 pb-4 border-b border-gray-200">
                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Reference</span>
                        <span className="font-mono text-sm text-gray-700">{order._id || order.id}</span>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Buyer Profile</span>
                        <span className="text-sm font-semibold text-gray-800">{order.customerName || 'Guest checkout'}</span>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Routing Node</span>
                        <span className="text-sm text-gray-600 font-medium">
                          {order.shippingAddress || order.shippingDetails?.address || 'Digital Product'}
                        </span>
                      </div>
                      
                      {/* Dynamic Order Action Node */}
                      <div className="flex items-center gap-2">
                        {order.status === 'Delivered' ? (
                          <span className="badge badge-success text-white font-bold px-3 py-2.5 rounded-md">
                            Delivered
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="badge badge-warning text-gray-800 font-bold px-3 py-2.5 rounded-md">
                              {order.status || 'Processing'}
                            </span>
                            <button
                              onClick={() => handleMarkAsDelivered(order._id || order.id)}
                              className="btn btn-success btn-xs normal-case font-bold text-white px-3 h-8 shadow-xs rounded-md"
                            >
                              Mark Delivered
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Packing Line Items Section */}
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Manifest Verification List</h4>
                      <ul className="space-y-2">
                        {order.items?.map((item, index) => (
                          <li key={index} className="flex justify-between text-sm bg-white p-3 rounded-lg border border-gray-100 shadow-3xs">
                            <span className="text-gray-700 font-medium">
                              {item.name} <span className="text-gray-400 font-bold px-1">× {item.quantity || 1}</span>
                            </span>
                            <span className="font-bold text-gray-900">
                              ৳{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                            </span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="flex justify-between items-center mt-5 pt-4 border-t border-dashed border-gray-200">
                        <span className="text-sm font-bold text-gray-500">Gross Processed Value:</span>
                        <span className="text-xl font-black text-primary">
                          ৳{(order.totalAmount || 0).toLocaleString()}
                        </span>
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
}