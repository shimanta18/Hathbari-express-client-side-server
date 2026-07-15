import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-[#4B5563] text-sm border-t border-[#F3F4F6] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Segment */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 border-b border-[#F3F4F6] gap-4">
          <div className="flex items-center gap-2">
            {/* Brand Logo Icon */}
            <div className="w-6 h-6 rounded-md bg-[#00B058] flex items-center justify-center text-white font-black text-xs">
              H
            </div>
            <span className="text-lg font-bold text-[#111827] tracking-tight">
              HaatBari <span className="text-[#00B058]">Express</span>
            </span>
          </div>
          <p className="text-xs font-medium text-[#9CA3AF] tracking-wide uppercase">
            Freshness delivered directly to your doorstep.
          </p>
        </div>

        {/* Middle Main Navigation Directory links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 py-12">
          
          {/* Column 1: Corporate Details */}
          <div className="md:col-span-1 text-left flex flex-col justify-between min-h-[140px]">
            <div className="space-y-1 text-xs">
              <p className="font-bold text-[#111827] text-sm mb-2">HaatBari Express Ltd.</p>
              <p>Gulshan, Dhaka</p>
              <p> Bangladesh</p>
            </div>
            
            <div className="space-y-1 text-xs mt-4">
              <p className="hover:text-[#00B058] transition-colors cursor-pointer">info@haatbariexpress.com</p>
              <p className="font-medium text-[#111827]">+880 1812 345678</p>
            </div>

            
          </div>

          {/* Column 2: Shop Links */}
          <div className="text-left">
            <h4 className="font-bold text-[#111827] mb-4 text-[13px] tracking-wide uppercase">Shop</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link to="/shop" className="hover:text-[#00B058] transition-colors">Organic Vegetables</Link></li>
              <li><Link to="/shop" className="hover:text-[#00B058] transition-colors">Fresh Fruits</Link></li>
              <li><Link to="/shop" className="hover:text-[#00B058] transition-colors">Dairy & Eggs</Link></li>
              <li><Link to="/shop" className="hover:text-[#00B058] transition-colors">Cooking Essentials</Link></li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="text-left">
            <h4 className="font-bold text-[#111827] mb-4 text-[13px] tracking-wide uppercase">Categories</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link to="/shop" className="hover:text-[#00B058] transition-colors">Beverages</Link></li>
              <li><Link to="/shop" className="hover:text-[#00B058] transition-colors">Snacks & Sweets</Link></li>
              <li><Link to="/shop" className="hover:text-[#00B058] transition-colors">Frozen Foods</Link></li>
              <li><Link to="/shop" className="hover:text-[#00B058] transition-colors">Baby Care</Link></li>
            </ul>
          </div>

          {/* Column 4: Customer Services */}
          <div className="text-left">
            <h4 className="font-bold text-[#111827] mb-4 text-[13px] tracking-wide uppercase">Customer Care</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link to="/help" className="hover:text-[#00B058] transition-colors">Help Center</Link></li>
              <li><Link to="/track" className="hover:text-[#00B058] transition-colors">Track Order</Link></li>
              <li><Link to="/returns" className="hover:text-[#00B058] transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/delivery" className="hover:text-[#00B058] transition-colors">Delivery Options</Link></li>
            </ul>
          </div>

          {/* Column 5: Language Selection Control Box */}
          <div className="text-left md:text-right flex flex-col items-start md:items-end justify-start">
            <h4 className="font-bold text-[#111827] mb-4 text-[13px] tracking-wide uppercase hidden md:block">&nbsp;</h4>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#E5E7EB] rounded-lg bg-white text-xs font-semibold text-[#111827] cursor-pointer hover:bg-[#F9FAFB] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[#6B7280]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9m0 0a9.004 9.004 0 0 1 8.716 2.253M12 3a9.004 9.004 0 0 0-8.716 2.253m0 0A9.003 9.003 0 0 1 12 12c0 2.485-2.015 4.5-4.5 4.5S3 14.485 3 12c0-.708.082-1.397.238-2.062M12 12c0-2.485 2.015-4.5 4.5-4.5S21 9.515 21 12c0 .708-.082 1.397-.238 2.062M21 12c0 2.485-2.015 4.5-4.5 4.5S12 14.485 12 12Z" />
              </svg>
              <span>English (BD)</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 text-[#9CA3AF]">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>

        </div>

        {/* Bottom Metadata & Legal Row */}
        <div className="flex flex-col md:flex-row justify-between items-center py-6 border-t border-[#F3F4F6] gap-4">
          
          {/* Copyright Info */}
          <div className="text-xs text-[#9CA3AF] font-medium order-3 md:order-1">
            &copy; {currentYear} HaatBari Express. All rights reserved.
          </div>

          {/* Central Block: Social Media Platform Grid Shortcuts */}
          <div className="flex items-center gap-2 order-1 md:order-2">
            {['linkedin', 'facebook', 'instagram', 'twitter'].map((platform) => (
              <a 
                key={platform}
                href={`https://${platform}.com`} 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-[#F3F4F6] hover:bg-[#E5E7EB] active:scale-95 text-[#4B5563] hover:text-[#00B058] flex items-center justify-center transition-all duration-150"
              >
                <span className="capitalize text-[10px] font-bold tracking-tight px-1">
                  {platform.slice(0, 2)}
                </span>
              </a>
            ))}
          </div>

          {/* Legal Documents Directory Options */}
          <div className="flex items-center gap-4 text-xs font-semibold text-[#6B7280] order-2 md:order-3">
            <Link to="/terms" className="hover:text-[#00B058] transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-[#00B058] transition-colors">Privacy</Link>
            <Link to="/cookies" className="hover:text-[#00B058] transition-colors">Cookies</Link>
            <Link to="/sitemap" className="hover:text-[#00B058] transition-colors">Sitemap</Link>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;