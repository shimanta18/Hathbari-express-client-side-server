import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TrackRiderButton from '../../pages/trakcer/TrackRiderButton';
import { useAuth } from '../../providers/AuthProvider';

// 🎯 Automatically adapts to production or local development environments
const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '') 
  : 'http://localhost:5000';

const OrdersPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user?.email) {
      setOrders([]);
      setLoading(false);
      return;
    }

    // 🎯 Swapped the hardcoded string out for your dynamic environment variable
    fetch(`${API_BASE_URL}/api/orders?email=${user.email}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded with status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // Defensive Check: Handles direct arrays OR wrapped objects cleanly
        const parsedOrders = Array.isArray(data) ? data : (data.orders || []);
        setOrders(parsedOrders);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error reading backend orders:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [user?.email, authLoading]);

  if (authLoading || loading) {
    return <div className="text-center py-24 font-bold text-gray-400">Loading order history...</div>;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <div className="border border-red-200 rounded-2xl p-8 bg-red-50 text-red-700 font-semibold">
          ⚠️ Backend Connection Error: {error}.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 text-left">
      <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-8">Your orders</h1>
      
      {orders.length === 0 ? (
        <div className="border border-gray-100 rounded-2xl p-8 bg-white text-center shadow-sm">
          <h3 className="font-bold text-gray-700 text-lg">No orders yet</h3>
          
          <button 
            onClick={() => navigate('/')} 
            className="mt-6 bg-[#00B058] hover:bg-[#008A45] text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all"
          >
            Start shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id || order.orderId} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-[#F9FAFB] px-6 py-4 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-700">ID: {order.orderId || order._id}</span>
                  <span className="text-[#00B058] font-black uppercase text-xs">● {order.status || 'Processing'}</span>
                </div>
                {order.status !== 'Delivered' ? (
                  <TrackRiderButton orderId={order.orderId || order._id} className="px-4 py-2 text-xs" />
                ) : (
                  <span className="text-xs font-bold text-gray-400 uppercase italic">Delivered</span>
                )}
              </div>
              <div className="p-6 divide-y divide-gray-50">
                {order.items?.map((item) => (
                  <div key={item._id} className="flex justify-between py-2 text-sm font-semibold">
                    <span className="text-gray-800">{item.name} (x{item.quantity})</span>
                    <span className="text-gray-900">৳{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="pt-3 text-right font-black text-base text-gray-900">
                  Total: <span className="text-[#00B058]">৳{(order.totalAmount || order.total).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;