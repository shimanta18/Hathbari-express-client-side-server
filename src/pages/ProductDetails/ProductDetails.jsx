import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../../Features/context/CartContext"; // 🎯 Wired up to your cart state provider

// 🎯 Environment-aware base URL: Bridges local development and live production channels seamlessly
const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '') 
  : 'http://localhost:5000';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart(); // 🎯 Hook in the add-to-cart action dispatcher
  
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product specific document from the Express/MongoDB layer on mount or ID shift
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 🚀 FIXED: Swapped out hardcoded localhost string for the dynamic environment config
        const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
        
        if (!response.ok) {
          throw new Error("This grocery item could not be found in our inventory.");
        }
        
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const handleQuantityChange = (type) => {
    if (type === 'dec' && quantity > 1) setQuantity(quantity - 1);
    if (type === 'inc') setQuantity(quantity + 1);
  };

  // 🟢 CASE 1: SKELETON LOADER STATE
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#00B058] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Checking BazarDash inventory channels...</p>
      </div>
    );
  }

  // 🟢 CASE 2: NOT FOUND / DISCONNECTED EDGE STATE
  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
        <p className="text-gray-500 mt-2">{error || "The item you're looking for does not exist."}</p>
        <button 
          onClick={() => navigate('/')}
          className="inline-block mt-6 bg-[#00B058] text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-[#008A45] transition-all cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    );
  }

  // 🟢 CASE 3: ACTIVE PRODUCT DISPLAY SURFACE
  return (
    <div className="w-full bg-white min-h-screen text-left">
      {/* Top Action Nav Bar - "Back to shop" */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm font-bold text-[#6B7280] hover:text-[#111827] transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to shop
        </button>
      </div>

      {/* Main Product Core Display Container */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Image Showcase */}
        <div className="relative rounded-3xl overflow-hidden w-full aspect-[4/3] bg-[#F9FAFB] flex items-center justify-center">
          {product.discount && (
            <span className="absolute top-6 left-6 bg-[#FF1E46] text-white font-black text-xs tracking-wide uppercase px-2.5 py-1 rounded-md z-10">
              {product.discount}
            </span>
          )}
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover rounded-3xl"
          />
        </div>

        {/* Right Side: Product Metadata & Purchasing Controls */}
        <div className="flex flex-col justify-start">
          
          <span className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-1">
            {product.category}
          </span>
          
          <h1 className="text-4xl font-extrabold text-[#111827] tracking-tight leading-tight mb-3">
            {product.name}
          </h1>

          {/* Rating, Weight & Status Metrics Row */}
          <div className="flex items-center gap-2 text-sm font-medium text-[#6B7280] mb-6 text-left">
            <div className="flex items-center gap-1 font-extrabold text-[#111827]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FBBF24" className="w-4 h-4">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
              </svg>
              {product.rating}
            </div>
            <span className="text-[#E5E7EB] font-light">•</span>
            <span>{product.weight}</span>
            <span className="text-[#E5E7EB] font-light">•</span>
            <span className="text-[#00B058] font-bold">In stock</span>
          </div>

          <p className="text-[#6B7280] text-sm leading-relaxed mb-8 max-w-lg">
            {product.description || `Fresh organic ${product.name?.toLowerCase()}, safely packed and locally sourced from local neighborhood markets.`}
          </p>

          {/* Large Interactive Pricing Section */}
          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-4xl font-extrabold text-[#111827]">
              ৳{product.price}
            </span>
            {product.oldPrice && (
              <span className="text-sm font-bold text-[#9CA3AF] line-through">
                ৳{product.oldPrice}
              </span>
            )}
          </div>

          {/* Quantity Controls & Dynamic Context Push Trigger */}
          <div className="flex items-center gap-4 w-full max-w-md">
            
            {/* Quantity Stepper Component */}
            <div className="flex items-center justify-between border border-[#E5E7EB] bg-white rounded-xl py-2 px-3 w-32 shadow-sm">
              <button 
                onClick={() => handleQuantityChange('dec')}
                className="font-semibold text-[#6B7280] hover:text-[#111827] active:scale-90 text-lg transition-all cursor-pointer px-1"
              >
                −
              </button>
              <span className="font-extrabold text-[#111827] text-sm">
                {quantity}
              </span>
              <button 
                onClick={() => handleQuantityChange('inc')}
                className="font-semibold text-[#6B7280] hover:text-[#111827] active:scale-90 text-lg transition-all cursor-pointer px-1"
              >
                +
              </button>
            </div>

            {/* Core Action Button: Direct Integration with Context Provider Dispatcher */}
            <button 
              onClick={() => {
                addToCart(product, quantity); // 🚀 Directly appends data to global state tree
                // Optional: You could use a sleek toast notification framework here instead of a crude alert alert
              }}
              className="flex-grow bg-[#00B058] hover:bg-[#008A45] active:scale-[0.98] text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              Add to Cart
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;