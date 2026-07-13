import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../pages/Features/context/CartContext';


const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '') 
  : 'http://localhost:5000';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { addToCart } = useCart();


  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('best-sellers');
  const [onSaleOnly, setOnSaleOnly] = useState(false);

  const categoriesList = ['All', 'Fruits', 'Vegetables', 'Drinks', 'Snacks', 'Meat', 'Dairy'];

 
  useEffect(() => {
    setLoading(true);
    const queryParams = new URLSearchParams({
      category: activeCategory,
      search: searchQuery,
      sortBy: sortBy,
      onSale: onSaleOnly
    });

    
    fetch(`${API_BASE_URL}/api/products?${queryParams}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed fetching live inventory arrays:", err);
        setLoading(false);
      });
  }, [activeCategory, searchQuery, sortBy, onSaleOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 text-left">
      {/* TOP LAYER BLOCK: HEADLINE TITLE DISPLAY META */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight">Shop</h1>
        <p className="text-sm font-semibold text-gray-400 mt-1">{products.length} products available</p>
      </div>

      {/* SEARCH BAR ENVELOPE INPUT PILL */}
      <div className="w-full relative mb-6">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.604 10.604Z" />
          </svg>
        </div>
        <input 
          type="text" 
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#F3F4F6] border border-transparent font-medium text-sm text-[#111827] pl-11 pr-4 py-3 rounded-xl outline-none focus:bg-white focus:border-[#00B058] transition-all"
        />
      </div>

      {/* HORIZONTAL CATEGORIES PILL SLIDER BAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide mb-8">
        {categoriesList.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category.toUpperCase())}
            className={`px-5 py-2 rounded-full font-bold text-sm tracking-tight transition-all shrink-0 cursor-pointer ${
              (activeCategory === category.toUpperCase() || (category === 'All' && activeCategory === 'ALL'))
                ? 'bg-[#00B058] text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* SPLIT TWO-COLUMN MAIN WORKSPACE INTERFACE */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        
        {/* LEFT COLUMN PANEL BLOCK: FILTERS CONTROL COLUMN */}
        <aside className="space-y-8 sticky top-24 hidden md:block">
          <div>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21.75l3.75-3.75" />
              </svg>
              Sort By
            </h3>
            <div className="flex flex-col gap-3 font-bold text-sm text-gray-600">
              {[
                { label: 'Best Sellers', value: 'best-sellers' },
                { label: 'Price: Low → High', value: 'low-high' },
                { label: 'Price: High → Low', value: 'high-low' },
                { label: 'Top Rated', value: 'top-rated' }
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="sortBy" 
                    value={option.value}
                    checked={sortBy === option.value}
                    onChange={() => setSortBy(option.value)}
                    className="w-4 h-4 accent-[#00B058] cursor-pointer"
                  />
                  <span className="group-hover:text-gray-900 transition-colors">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          <div>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Offers</h3>
            <label className="flex items-center gap-3 font-bold text-sm text-gray-600 cursor-pointer group">
              <input 
                type="checkbox"
                checked={onSaleOnly}
                onChange={(e) => setOnSaleOnly(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#00B058] accent-[#00B058] cursor-pointer focus:ring-0"
              />
              <span className="group-hover:text-gray-900 transition-colors">On sale only</span>
            </label>
          </div>
        </aside>

        {/* RIGHT COLUMN GRID PANEL BLOCK: PRODUCTS STREAM TILES VIEWPORT */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="text-center py-24 font-bold text-gray-400 text-sm">
              Loading fresh products matrix...
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24 border-2 border-dashed border-gray-100 rounded-2xl p-8">
              <h3 className="font-bold text-gray-700 text-lg">No matches found</h3>
              <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">Try checking your spelling variations or resetting applied sidebar parameters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((item) => (
                <div key={item._id} className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col relative hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-all group">
                  
                  {item.discount && (
                    <span className="absolute top-4 left-4 bg-[#FF1E46] text-white font-black text-[9px] px-2 py-0.5 rounded uppercase tracking-wider z-10">
                      {item.discount}
                    </span>
                  )}

                  <Link to={`/product/${item._id}`} className="block text-left flex-grow">
                    <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3.5">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                    </div>
                    
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">
                      {item.category}
                    </span>
                    
                    <h3 className="font-bold text-gray-800 text-base leading-tight line-clamp-1 group-hover:text-[#00B058] transition-colors">
                      {item.name}
                    </h3>

                    <div className="flex items-center gap-1.5 mt-1 mb-3 text-xs font-bold text-gray-400">
                      <span>{item.weight}</span>
                      <span>•</span>
                      <div className="flex items-center gap-0.5 text-[#FBBF24]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 font-extrabold">{item.rating || 4.5}</span>
                      </div>
                    </div>
                  </Link>

                  <div className="flex items-center justify-between pt-1 mt-auto">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-gray-900">৳{item.price}</span>
                      {item.oldPrice && (
                        <span className="text-xs font-bold text-gray-300 line-through">৳{item.oldPrice}</span>
                      )}
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.preventDefault(); 
                        addToCart(item);     
                      }}
                      className="w-8 h-8 rounded-full bg-[#00B058] hover:bg-[#008A45] text-white flex items-center justify-center font-bold shadow-sm cursor-pointer transition-all active:scale-95"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ShopPage;