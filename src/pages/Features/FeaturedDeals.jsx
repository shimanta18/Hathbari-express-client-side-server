import { useEffect, useState } from "react"; // 🚀 1. Import hooks
import { Link } from 'react-router-dom';
import DealCard from './DealCard';
const FeaturedDeals = () => {
  // 🚀 2. Establish dynamic state handlers
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🚀 3. Fetch on-sale items from your backend on component mount
  useEffect(() => {
    const fetchFeaturedDeals = async () => {
      try {
        setLoading(true);
        // Using the ?onSale=true query filter we configured in server.js
        const response = await fetch('http://localhost:5000/api/products?onSale=true');
        
        if (!response.ok) {
          throw new Error('Could not retrieve active deals.');
        }
        
        const data = await response.json();
        
        // Optional: Slice the array to show a maximum of 4 items (1 clean row)
        setDeals(data.slice(0, 4));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedDeals();
  }, []);

  // 🚀 4. Quietly hide the section or show a subtle skeleton state while loading
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-400 text-sm animate-pulse">
        Loading BazarDash deals...
      </div>
    );
  }

  // If there's an error or no active deals exist in MongoDB, skip rendering this section entirely
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
          // 🚀 5. Crucial: Changed deal.id to deal._id to match MongoDB's key formatting
          <DealCard key={deal._id} item={deal} />
        ))}
      </div>

    </div>
  );
};

export default FeaturedDeals;