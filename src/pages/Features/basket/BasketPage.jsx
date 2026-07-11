import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const BasketPage = () => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-black text-gray-800 mb-4">Your basket is empty</h2>
        <p className="text-gray-500 mb-8 text-sm font-medium">Add some fresh grocery items to get started!</p>
        <button 
          onClick={() => navigate('/shop')}
          className="bg-[#00B058] hover:bg-[#008A45] text-white font-bold px-6 py-3 rounded-full text-sm transition-all cursor-pointer"
        >
          Go to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 antialiased">
      <h1 className="text-3xl font-black text-[#111827] tracking-tight mb-8 text-left">
        Your Basket
      </h1>

      {/* Two-Column Responsive Grid Layout (Matches image_846582.png structural footprint) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Hand: Shopping Basket Selected Product Cards List container */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {cartItems.map((item) => (
            <div 
              key={item._id}
              className="relative bg-white border border-[#E5E7EB] rounded-[20px] p-4 flex gap-4 items-center shadow-sm"
            >
              {/* Product Thumbnail Image box */}
              <img 
                src={item.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200"} 
                alt={item.name} 
                className="w-20 h-20 rounded-xl object-cover shrink-0"
              />

              {/* Product Content Specifications Block layout */}
              <div className="flex-1 text-left flex flex-col justify-between h-20 py-0.5">
                <div>
                  <h3 className="font-extrabold text-base text-[#111827] leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-xs font-bold text-gray-400 mt-0.5">
                    {item.unit || 'Standard'}
                  </p>
                </div>

                {/* Counter Control Modifier Selector Box Pill */}
                <div className="flex items-center gap-3 border border-[#E5E7EB] rounded-full w-fit px-3 py-1 bg-[#F9FAFB]">
                  <button 
                    onClick={() => updateQuantity(item._id, -1)}
                    className="text-gray-400 hover:text-black font-extrabold text-sm px-1 cursor-pointer"
                  >
                    —
                  </button>
                  <span className="text-sm font-black text-[#111827] w-4 text-center">
                    {item.quantity}
                  </span>
                  <button 
                    onClick={() => updateQuantity(item._id, 1)}
                    className="text-gray-400 hover:text-[#00B058] font-extrabold text-sm px-1 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Top-Right Absolute Position Trash Remove Handler Button */}
              <button 
                onClick={() => removeFromCart(item._id)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>

              {/* Bottom Right Absolute Total Price calculations element row */}
              <div className="absolute bottom-4 right-4 text-right">
                <span className="text-base font-black text-[#111827]">
                  ৳{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>

            </div>
          ))}

          {/* Wipe Entire Array Actions Clear Trigger */}
          <button 
            onClick={clearCart}
            className="text-left text-sm font-bold text-gray-400 hover:text-red-500 transition-colors mt-2 w-fit px-1 cursor-pointer"
          >
            Clear basket
          </button>
        </div>

        {/* Right Hand: Sticky Order Summary Card Box (Matches image_846582.png exactly) */}
        <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-6 shadow-sm sticky top-24 text-left">
          <h2 className="text-lg font-black text-[#111827] mb-6">
            Order Summary
          </h2>

          <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 mb-5">
            {/* Subtotal row */}
            <div className="flex justify-between items-center text-sm font-semibold text-gray-400">
              <span>Subtotal</span>
              <span className="text-gray-800 font-bold">৳{cartTotal.toLocaleString()}</span>
            </div>
            
            {/* Delivery row */}
            <div className="flex justify-between items-center text-sm font-semibold text-gray-400">
              <span>Delivery fee</span>
              <span className="text-[#00B058] font-extrabold">Free</span>
            </div>
          </div>

          {/* Primary calculations balance row */}
          <div className="flex justify-between items-baseline mb-6">
            <span className="text-sm font-black text-[#111827]">Total</span>
            <span className="text-2xl font-black text-[#111827]">
              ৳{cartTotal.toLocaleString()}
            </span>
          </div>

          {/* Signature Brand Primary Green Checkout Execution Button CTA */}
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-[#00B058] hover:bg-[#008A45] active:scale-[0.98] text-white font-extrabold text-sm py-4 rounded-xl shadow-[0_4px_16px_rgba(0,176,88,0.2)] transition-all cursor-pointer text-center flex items-center justify-center"
          >
            Checkout • ৳{cartTotal.toLocaleString()}
          </button>
        </div>

      </div>
    </div>
  );
};

export default BasketPage;