import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase/firebase';
import { useCart } from '../../Features/context/CartContext';

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:5000';
const DELIVERY_STORAGE_KEY = 'latestDeliveryAddress';

const Navbar = () => {
  const navigate = useNavigate();
  const { cartTotal, cartCount } = useCart();
  
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState(() => 
    localStorage.getItem(DELIVERY_STORAGE_KEY) || 'No recent deliveries'
  );
  
  const dropdownRef = useRef(null);

  
  const updateAddressState = useCallback((newAddress) => {
    setDeliveryAddress(newAddress || 'No recent deliveries');
  }, []);

  useEffect(() => {
    const handleAddressEvent = (e) => updateAddressState(e.detail?.address);
    const handleStorageEvent = (e) => {
      if (e.key === DELIVERY_STORAGE_KEY) updateAddressState(e.newValue);
    };

    window.addEventListener('liveAddressUpdate', handleAddressEvent);
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('liveAddressUpdate', handleAddressEvent);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [updateAddressState]);

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setIsAdmin(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user?.email) {
      fetch(`${API_BASE_URL}/api/users/admin/${user.email}`)
        .then((res) => res.json())
        .then((data) => setIsAdmin(!!data.admin))
        .catch(() => setIsAdmin(false));
      
     
      if (!isAdmin) {
        fetch(`${API_BASE_URL}/api/orders/latest-delivered-address/${user.email}`)
          .then((res) => res.ok ? res.json() : { address: null })
          .then((data) => {
            if (data?.address) {
              localStorage.setItem(DELIVERY_STORAGE_KEY, data.address);
              updateAddressState(data.address);
            }
          })
          .catch(console.error);
      }
    }
  }, [user?.email, isAdmin, updateAddressState]);

  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      setShowDropdown(false);
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevents page reload
    if (searchQuery.trim()) {
    
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(''); 
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 px-4 md:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0">
          <span className="text-2xl font-black text-[#00B058] tracking-tight">HaatBari express</span>
        </Link>

        {/* Address Badge */}
        <div className="hidden md:flex items-center gap-2 bg-[#F3F4F6] px-4 py-2 rounded-full text-sm font-semibold text-[#374151] max-w-[240px] truncate">
          <svg className="w-4 h-4 text-[#6B7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
          <span className="truncate">Deliver to: <span className="text-[#111827] font-bold">{deliveryAddress}</span></span>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl relative">
          <div className="absolute inset-y-0 left-4 flex items-center text-[#9CA3AF]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.604 10.604Z" /></svg>
          </div>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for fresh mangoes, rice, vegetables..."
            className="w-full bg-[#F3F4F6] text-sm pl-11 pr-4 py-2.5 rounded-xl outline-none focus:bg-white focus:border-[#00B058] border transition-all"
          />
        </form>

        {/* User Auth */}
        <div className="flex items-center gap-5 shrink-0">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-2">
                {user.photoURL ? (
                  <img src={user.photoURL} className="w-9 h-9 rounded-full object-cover" alt="Profile" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#E8F8F0] text-[#00B058] flex items-center justify-center font-bold text-sm">
                    {user.displayName?.[0] || user.email?.[0] || 'U'}
                  </div>
                )}
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-3 w-48 bg-white border rounded-2xl shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b text-left">
                    <p className="text-xs font-bold text-gray-400 uppercase">Logged in as</p>
                    <p className="text-sm font-bold text-gray-800 truncate">{user.displayName || 'BazarShopper'}</p>
                  </div>
                  {isAdmin ? (
                    <Link to="/admin/dashboard" onClick={() => setShowDropdown(false)} className="block px-4 py-2.5 text-sm font-bold text-[#00B058] hover:bg-[#00B058]/5">Admin Dashboard</Link>
                  ) : (
                    <Link to="/orders" onClick={() => setShowDropdown(false)} className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-[#F9FAFB]">My Orders</Link>
                  )}
                  <button onClick={handleLogOut} className="block w-full text-left px-4 py-2.5 text-sm font-bold text-[#FF1E46] hover:bg-[#FFF1F2]">Log out</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/Login" className='text-base font-bold text-[#111827] hover:text-[#00B058]'>Login</Link>
          )}

          {/* Cart Button */}
          <button onClick={() => navigate('/basket')} className="bg-[#00B058] hover:bg-[#008A45] text-white font-bold text-sm px-5 py-2.5 rounded-full flex items-center gap-2 transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
            <span>Cart • ৳{cartTotal.toLocaleString()} ({cartCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;