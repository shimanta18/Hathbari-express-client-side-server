import { useNavigate } from 'react-router-dom';

const TrackRiderButton = ({ orderId, className = "" }) => {
  const navigate = useNavigate();

  // Guard clause to make sure the button doesn't break if orderId isn't loaded yet
  if (!orderId) return null;

  return (
    <button
      onClick={() => navigate(`/track/${orderId}`)}
      className={`group relative flex items-center gap-3 bg-[#00B058] hover:bg-[#008A45] text-white font-black text-sm px-6 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer overflow-hidden ${className}`}
    >
      {/* Background Sheen Effect on Hover */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />

      {/* Live Pulsing Dot */}
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
      </span>

      {/* Button Text */}
      <span className="tracking-tight">Track Live Delivery</span>

      {/* Delivery Scooter SVG Icon */}
      <svg 
        className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.665-9.973A2.25 2.25 0 0 0 19.345 6H16.5M12 18.75V11.25M12 6V4.5m0 0a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12 11.25h3.375c.621 0 1.125-.504 1.125-1.125V7.5h-4.5v3.75Zm0 0H8.25m0 0v-1.5m0 0H6.75A1.5 1.5 0 0 1 5.25 8.25V7.5H6.75" 
        />
      </svg>
    </button>
  );
};

export default TrackRiderButton;