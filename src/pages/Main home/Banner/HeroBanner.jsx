// 🚀 1. Import Link from react-router-dom
import { Link } from 'react-router-dom';

const HeroBanner = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Main Container Banner */}
      <div className="bg-[#E2F6E9] rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 items-center min-h-[380px] lg:min-h-[440px]">
        
        {/* Left Side: Content */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center items-start text-left">
          
          {/* Badge */}
          <span className="bg-[#CBEFDB] text-[#008A45] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md mb-6">
            Dhaka's Freshest
          </span>
          
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#111827] leading-[1.1] mb-6 tracking-tight">
            Fresh groceries <br /> 
            delivered in <span className="text-[#00B058]">20 mins</span>
          </h1>
          
          {/* Subtext */}
          <p className="text-[#6B7280] text-base sm:text-lg max-w-md mb-8 leading-relaxed">
            Get the best prices on seasonal fruits, local vegetables, and daily essentials from your neighborhood markets.
          </p>
          
          {/* 🚀 2. Changed from <button> to <Link to="/shop"> */}
          <Link 
            to="/shop" 
            className="bg-[#111827] text-white font-medium px-6 py-3.5 rounded-xl flex items-center gap-2 hover:bg-black transition-colors shadow-sm cursor-pointer inline-flex"
          >
            <span>Shop Now</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={2} 
              stroke="currentColor" 
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Right Side: Basket Image */}
        <div className="w-full h-full min-h-[300px] md:min-h-auto relative">
          <img 
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000" 
            alt="Basket of fresh fruits and vegetables" 
            className="w-full h-full object-cover object-center"
          />
        </div>

      </div>
    </div>
  );
};

export default HeroBanner;