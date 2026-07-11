import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../Features/context/CartContext';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    instructions: '',
    paymentMethod: 'cod',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);

  // Fee Calculations
  const deliveryFee = cartItems.length > 0 ? 60 : 0;
  const grandTotal = cartTotal + deliveryFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault(); // Prevents page reload
    if (cartItems.length === 0) return;

    setIsSubmitting(true);

    try {
      // 📡 Send the order to your Express Backend
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems,
          totalAmount: grandTotal,
          shippingDetails: formData,
          paymentMethod: formData.paymentMethod,
          status: 'Processing',
          createdAt: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Order saved:", data);
      
      setIsOrderSuccess(true);
      clearCart(); // Clear cart after success
    } catch (error) {
      console.error("Order processing failed:", error);
      alert("Failed to place order. Check your console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🟢 CASE 1: SUCCESS VIEW
  if (isOrderSuccess) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <div className="w-20 h-20 bg-[#E8F8F0] text-[#00B058] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order Placed!</h1>
        <button
          onClick={() => navigate('/')}
          className="mt-8 w-full bg-[#00B058] hover:bg-[#008A45] text-white font-bold py-3 rounded-xl transition-all"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  // 🟢 CASE 2: EMPTY BASKET VIEW
  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto text-center py-24 px-4">
        <h2 className="text-2xl font-extrabold text-gray-800">Your basket is empty</h2>
        <Link to="/" className="inline-block mt-6 bg-[#00B058] text-white font-bold px-6 py-2.5 rounded-full text-sm">
          Browse Shop
        </Link>
      </div>
    );
  }

  // 🟢 CASE 3: CHECKOUT INTERFACE
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 text-left">
      <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-8">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: FORM */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold text-gray-900 border-b border-gray-50 pb-2">Delivery Details</h2>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Recipient Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full bg-[#F3F4F6] p-3 rounded-xl outline-none" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mobile Phone</label>
              <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full bg-[#F3F4F6] p-3 rounded-xl outline-none" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Address</label>
              <textarea name="address" required rows={3} value={formData.address} onChange={handleInputChange} className="w-full bg-[#F3F4F6] p-3 rounded-xl outline-none resize-none" />
            </div>
          </div>
        </div>

        {/* RIGHT: SUMMARY */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-gray-900 mb-4">Order Summary</h2>
            
            {/* Total Section */}
            <div className="border-t border-gray-100 pt-4 space-y-3">
              <div className="flex justify-between"><span>Subtotal</span><span>৳{cartTotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span>৳{deliveryFee}</span></div>
              <div className="flex justify-between text-lg font-black text-[#00B058]">
                <span>Total</span><span>৳{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full mt-6 text-white font-extrabold py-3.5 rounded-xl ${
                isSubmitting ? 'bg-gray-400' : 'bg-[#00B058] hover:bg-[#008A45]'
              }`}
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;