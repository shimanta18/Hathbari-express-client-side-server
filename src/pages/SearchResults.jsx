import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:5000';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/api/products/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Search error:", err);
        setError("Something went wrong while searching. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 min-h-[60vh]">
      <h2 className="text-2xl font-black text-gray-800 mb-2">
        Results for "{query}"
      </h2>
      <p className="text-gray-500 mb-8 text-sm font-semibold">
        Found {products.length} {products.length === 1 ? 'product' : 'products'} matching your criteria
      </p>

      {/*  Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#00B058]"></div>
        </div>
      )}

      {/*  Error State */}
      {!loading && error && (
        <div className="text-center py-12 text-red-500 font-bold">{error}</div>
      )}

      {/*  Empty State */}
      {!loading && !error && products.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500 font-bold text-lg mb-2">No products found matching your search.</p>
          <p className="text-gray-400 text-sm">Try checking your spelling or search for something else like "mangoes" or "rice".</p>
        </div>
      )}

      {/*  Product Grid Display */}
      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <img 
                  src={product.image || 'https://via.placeholder.com/150'} 
                  alt={product.name} 
                  className="w-full h-40 object-contain rounded-xl mb-4 bg-gray-50"
                />
                <span className="text-xs font-bold bg-[#E8F8F0] text-[#00B058] px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {product.category || 'Grocery'}
                </span>
                <h3 className="font-bold text-gray-800 text-base mt-2 line-clamp-2 min-h-[3rem]">
                  {product.name}
                </h3>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 font-semibold line-through">
                    {product.oldPrice ? `৳${product.oldPrice}` : ''}
                  </p>
                  <p className="text-lg font-black text-gray-800">
                    ৳{product.price}
                  </p>
                </div>
                <Link 
                  to={`/product/${product._id}`} 
                  className="bg-[#F3F4F6] hover:bg-[#00B058]/10 text-gray-700 hover:text-[#00B058] font-bold text-xs px-4 py-2 rounded-xl transition-all"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;