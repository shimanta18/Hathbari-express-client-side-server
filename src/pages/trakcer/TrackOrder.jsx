import L from 'leaflet';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

// Create a custom icon for our moving grocery rider
const riderIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png', // Delivery Scooter Icon
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

// Helper component to smoothly center the map camera as the rider drives
function ChangeMapCenter({ center }) {
  const map = useMap();
  map.setView(center, 15);
  return null;
}

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [riderCoords, setRiderCoords] = useState([23.7937, 90.4066]); // Initial store location
  const [deliveryStatus, setDeliveryStatus] = useState('Preparing items...');

  useEffect(() => {
    // Connect to the live backend websocket server stream
    const socket = io('http://localhost:5000');

    socket.emit('join_order_tracking', orderId);

    // Listen for live coordinates pushed by the backend simulator
    socket.on('rider_update', (data) => {
      setRiderCoords(data.coordinates);
      setDeliveryStatus(data.message);
    });

    socket.on('rider_status', (data) => {
      setRiderCoords(data.coordinates);
      setDeliveryStatus(data.message);
    });

    // Cleanup connection when page closes
    return () => {
      socket.disconnect();
    };
  }, [orderId]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-left">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Track Your Delivery</h1>
          <p className="text-sm font-semibold text-gray-500">Order Reference ID: <span className="text-gray-800 font-bold">{orderId}</span></p>
        </div>
        <button 
          onClick={() => navigate('/orders')}
          className="border border-gray-200 hover:bg-gray-50 font-bold text-sm px-4 py-2 rounded-xl transition-all cursor-pointer"
        >
          Back to Orders
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Window Display Wrapper */}
        <div className="lg:col-span-2 h-[450px] rounded-2xl overflow-hidden shadow-sm border border-gray-100 z-0">
          <MapContainer center={riderCoords} zoom={15} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={riderCoords} icon={riderIcon}>
              <Popup>HaatBari Express Rider is here!</Popup>
            </Marker>
            <ChangeMapCenter center={riderCoords} />
          </MapContainer>
        </div>

        {/* Live Status Tracking Panel Cards */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-black text-gray-900 text-lg mb-4">Delivery Status</h3>
            <div className="flex items-center gap-3 bg-[#E8F8F0] text-[#00B058] p-4 rounded-xl mb-6">
              <span className="animate-ping inline-flex h-2.5 w-2.5 rounded-full bg-[#00B058]"></span>
              <p className="font-extrabold text-sm">{deliveryStatus}</p>
            </div>
            
            <div className="space-y-4 text-sm font-semibold text-gray-600">
              <div className="flex gap-3">
                <span className="text-emerald-500">✔</span>
                <p className="text-gray-900 font-bold">Order Received & Confirmed</p>
              </div>
              <div className="flex gap-3">
                <span className="text-emerald-500">✔</span>
                <p className="text-gray-900 font-bold">Items Packed at Hub</p>
              </div>
              <div className="flex gap-3">
                <span className={deliveryStatus.includes('arrived') ? "text-emerald-500" : "text-gray-300 animate-pulse"}>●</span>
                <p className={deliveryStatus.includes('arrived') ? "text-gray-900 font-bold" : "text-gray-400"}>Out for Delivery</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-50 pt-4 mt-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Rider</p>
            <p className="font-black text-gray-900 mt-1">+880 1712-XXXXXX</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;