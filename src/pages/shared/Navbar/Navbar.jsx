import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase/firebase'; // Adjust based on your config file tree location
import { useCart } from '../../Features/context/CartContext'; // 🚀 Hook up your newly created cart context file

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // 🚀 Dynamically extract live totals and item counts from global context state
  const { cartTotal, cartCount } = useCart();
  
  // Authentication and dropdown component states
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // 🔑 State to track if the user is an admin
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // 🎯 1. DYNAMIC DELIVERY ADDRESS STATE (Pulls last saved or defaults to Gulshan 2)
  const [deliveryAddress, setDeliveryAddress] = useState(
    localStorage.getItem('latestDeliveryAddress') || 'Gulshan 2, Dhaka'
  );

  // 🎯 2. EVENT LISTENER FOR LIVE ADMIN UPDATES
  useEffect(() => {
    const handleGlobalAddressChange = () => {
      const updatedAddress = localStorage.getItem('latestDeliveryAddress');
      if (updatedAddress) {
        setDeliveryAddress(updatedAddress);
      }
    };

    // Intercept custom event sent when an order is flagged as delivered
    window.addEventListener('liveAddressUpdate', handleGlobalAddressChange);
    
    // Clean up event subscription on component unmount
    return () => {
      window.removeEventListener('liveAddressUpdate', handleGlobalAddressChange);
    };
  }, []);

  // Listen for changes to the active session in real-time
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Clean up subscription on unmount
  }, []);

  // 📡 Fetch admin status from backend when the user logs in
  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:5000/api/users/admin/${user.email}`)
        .then((res) => res.json())
        .then((data) => {
          setIsAdmin(data.admin);
        })
        .catch((err) => console.error("Error verifying admin status:", err));
    } else {
      setIsAdmin(false);
    }
  }, [user?.email]);

  // Close dropdown if user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Account termination pipeline
  const handleLogOut = async () => {
    try {
      await signOut(auth);
      
      setShowDropdown(false);
      navigate('/');
    } catch (error) {
      console.error("Logout error code pipeline:", error);
    }
  };

  // Helper utility to grab name initials for the avatar placeholder image
  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 px-4 md:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* 🟢 1. LOGO SEGMENT */}
        <Link to="/" className="flex items-center shrink-0">
          <span className="text-2xl font-black text-[#00B058] tracking-tight hover:opacity-90 transition-opacity">
            HaatBari express
          </span>
        </Link>

        {/* 🟢 2. DELIVERY ADDRESS BADGE (Now dynamically listening to state!) */}
        <div className="hidden md:flex items-center gap-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] transition-colors px-4 py-2 rounded-full text-sm font-semibold text-[#374151] max-w-[240px] truncate cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-[#6B7280] shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          <span className="truncate">Deliver to: <span className="text-[#111827] font-bold">{deliveryAddress}</span></span>
        </div>

        {/* 🟢 3. CENTRALIZED SEARCH PILL INPUT */}
        <div className="flex-1 max-w-xl relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#9CA3AF] group-focus-within:text-[#00B058] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.604 10.604Z" />
            </svg>
          </div>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for fresh mangoes, rice, vegetables..."
            className="w-full bg-[#F3F4F6] border border-transparent font-medium text-sm text-[#111827] placeholder-[#6B7280] pl-11 pr-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-[#00B058] transition-all"
          />
        </div>

        {/* 🟢 4. AUTHENTICATION & SHOPPING CART CONTROL ACTION BLOCK */}
        <div className="flex items-center gap-5 shrink-0">
          
          {/* Dynamic Conditional Auth State Profile Area */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              {/* Profile Avatar Badge Trigger */}
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 focus:outline-none group cursor-pointer transition-all"
              >
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="Shopper profile avatar" 
                    className="w-9 h-9 rounded-full object-cover border-2 border-transparent group-hover:border-[#00B058] transition-all"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#E8F8F0] text-[#00B058] border border-[#00B058]/20 flex items-center justify-center font-bold text-sm tracking-tight group-hover:bg-[#00B058] group-hover:text-white transition-all">
                    {getInitials(user.displayName || user.email)}
                  </div>
                )}
                <span className="hidden sm:inline text-sm font-bold text-[#374151] group-hover:text-[#111827] max-w-[90px] truncate">
                  {user.displayName ? user.displayName.split(' ')[0] : 'Account'}
                </span>
              </button>

              {/* Secure Context Action Overlay Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-3 w-48 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-gray-100 text-left">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Logged in as</p>
                    <p className="text-sm font-bold text-gray-800 truncate">{user.displayName || 'BazarShopper'}</p>
                  </div>
                  
                  {/* 🛠️ MUTUALLY EXCLUSIVE LINKS: Admin gets Dashboard, User gets My Orders */}
                  {isAdmin ? (
                    <Link 
                      to="/admin/dashboard" 
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-[#00B058] bg-[#00B058]/5 hover:bg-[#00B058]/10 transition-all text-left w-full"
                    >
                      ⚙️ Admin Dashboard
                    </Link>
                  ) : (
                    <Link 
                      to="/orders" 
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-[#F9FAFB] hover:text-[#00B058] transition-all text-left w-full"
                    >
                      My Orders
                    </Link>
                  )}

                  <button 
                    onClick={handleLogOut}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-[#FF1E46] hover:bg-[#FFF1F2] transition-all text-left w-full cursor-pointer"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* User Sign In Link if context returns guest */
            <Link  
              to="/Login"
              className='text-base font-bold text-[#111827] hover:text-[#00B058] transition-colors cursor-pointer'
            >
              Login
            </Link>
          )}

          {/* 🚀 Dynamic Shopping Basket Pill Button Component */}
          <button 
            onClick={() => navigate('/basket')}
            className="bg-[#00B058] hover:bg-[#008A45] active:scale-98 text-white font-bold text-sm px-5 py-2.5 rounded-full flex items-center gap-2 shadow-[0_4px_12px_rgba(0,176,88,0.16)] transition-all cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <span className="font-extrabold tracking-tight">
              Cart • ৳{cartTotal.toLocaleString()} ({cartCount})
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;