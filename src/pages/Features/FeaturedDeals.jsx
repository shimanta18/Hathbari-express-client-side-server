import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import DealCard from './DealCard';


const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '') 
  : 'http://localhost:5000';

const FeaturedDeals = () => {

  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch on-sale items from your backend on component mount
  useEffect(() => {
    const fetchFeaturedDeals = async () => {
      try {
        setLoading(true);
        
     
        const response = await fetch(`${API_BASE_URL}/api/products?onSale=true`);
        
        if (!response.ok) {
          throw new Error('Could not retrieve active deals.');
        }
        
        const data = await response.json();
        
       
        setDeals(data.slice(0, 4));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedDeals();
  }, []);


  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-400 text-sm animate-pulse">
        Loading BazarDash deals...
      </div>
    );
  }

  
  if (error || deals.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Upper Content Header Box */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#111827] tracking-tight">
          Featured Deals
        </h2>

         <Link 
            to="/shop" 
            className="text-[#00B058] font-semibold text-sm hover:underline cursor-pointer transition-all"
          >See all</Link>
                  
      </div>

      {/* Fully Configured Responsive Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {deals.map((deal) => (
         
          <DealCard key={deal._id} item={deal} />
        ))}
      </div>

    </div>
  );
};

export default FeaturedDeals;