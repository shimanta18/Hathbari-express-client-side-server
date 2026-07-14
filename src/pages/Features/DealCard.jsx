import { useState } from "react";
import { Link } from "react-router-dom";

import { useCart } from "../Features/context/CartContext";

const DealCard = ({ item }) => {
  
  const { addToCart } = useCart(); 
  

  const [showToast, setShowToast] = useState(false);

  if (!item) return null; 

  return (
    <div className="bg-white border border-[#F3F4F6] rounded-2xl p-4 flex flex-col justify-between relative hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-all duration-200 group">
      
      {/* Top Banner Discount Badge (Only renders if discount exists) */}
      {item.discount && (
        <span className="absolute top-6 left-6 bg-[#FF1E46] text-white font-black text-[10px] tracking-wide uppercase px-2 py-1 rounded-md z-10">
          {item.discount}
        </span>
      )}

      <Link to={`/product/${item._id}`} className="block cursor-pointer flex-grow text-left">
        {/* Product Image Wrapper */}
        <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#F9FAFB] mb-4">
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Item Meta & Headers */}
        <div className="flex flex-col flex-grow text-left">
          <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1">
            {item.category}
          </span>
          <h3 className="text-base font-bold text-[#111827] line-clamp-2 leading-snug min-h-[44px]">
            {item.name}
          </h3>
          
          {/* Quantity/Weight & Star Ratings Info */}
          <div className="flex items-center gap-2 mt-1 mb-4 text-xs font-medium text-[#6B7280]">
            <span>{item.weight}</span>
            <span className="text-[#E5E7EB]">|</span>
            <div className="flex items-center gap-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FBBF24" className="w-3.5 h-3.5">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
              </svg>
              <span className="font-bold text-[#111827]">{item.rating}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Footer Base Action Segment (Price block + Add Button) */}
      <div className="flex items-center justify-between mt-auto pt-2">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-[#111827]">
            ৳{item.price}
          </span>
          {item.oldPrice && (
            <span className="text-xs font-semibold text-[#9CA3AF] line-through">
              ৳{item.oldPrice}
            </span>
          )}
        </div>

        {/* Dynamic Interactive Green Add Circle Trigger */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            
            // 3. Fire the context function to update global state
            if (typeof addToCart === "function") {
              addToCart(item);
              
              // 4. Show custom UI toast and set auto-dismiss timer
              setShowToast(true);
              setTimeout(() => {
                setShowToast(false);
              }, 2500);

            } else {
              console.error("addToCart function is missing from useCart context!");
            }
          }} 
          className="w-8 h-8 rounded-full bg-[#00B058] hover:bg-[#008A45] active:scale-95 text-white flex items-center justify-center font-bold transition-all cursor-pointer shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>

      {/* 5. Custom Floating Toast Notification UI Element */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-[#111827] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 border border-gray-800 text-sm font-semibold transition-all duration-300 transform translate-y-0">
          <div className="bg-[#00B058] p-0.5 rounded-full text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <span>Added {item.name} to cart!</span>
        </div>
      )}

    </div>
  );
};

export default DealCard;