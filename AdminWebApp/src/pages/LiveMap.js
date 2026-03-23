import React, { useState, useEffect, useRef } from 'react';
import { FiMapPin, FiRefreshCw } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { trackingAPI } from '../services/api';
import socketService from '../services/socket';

// Fix default marker icons for webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const busIcon = new L.DivIcon({
  className: 'bus-marker',
  html: '<div style="background:#1a5276;color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:16px;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)">🚌</div>',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -20],
});

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => { if (center) map.setView(center, map.getZoom()); }, [center, map]);
  return null;
}

export default function LiveMap() {
  const [activeBuses, setActiveBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [center] = useState([14.6091, 120.9892]); // Manila default
  const [selectedBus, setSelectedBus] = useState(null);

  useEffect(() => {
    loadActiveBuses();
    const interval = setInterval(loadActiveBuses, 30000);

    socketService.on('location:update', handleLocationUpdate);
    socketService.on('sos:alert', handleSOS);

    return () => {
      clearInterval(interval);
      socketService.off('location:update', handleLocationUpdate);
      socketService.off('sos:alert', handleSOS);
    };
  }, []);

  const handleLocationUpdate = (data) => {
    setActiveBuses(prev => prev.map(b =>
      b.trip_id === data.tripId ? { ...b, latitude: data.latitude, longitude: data.longitude, speed: data.speed, updated_at: new Date() } : b
    ));
  };

  const handleSOS = (data) => {
    setActiveBuses(prev => prev.map(b =>
      b.trip_id === data.tripId ? { ...b, sos: true } : b
    ));
  };

  const loadActiveBuses = async () => {
    try {
      const { data } = await trackingAPI.getActiveBuses();
      setActiveBuses(data.buses || data || []);
    } catch (err) { console.error('Failed to load active buses:', err); }
    finally { setLoading(false); }
  };

  // Demo data if no real data
  const buses = activeBuses.length > 0 ? activeBuses : [
    { id: 1, bus_number: 'MNL-001', latitude: 14.6091, longitude: 120.9892, route_name: 'Manila → Tuguegarao', speed: 65, status: 'in_transit', driver: 'Juan Cruz', passengers: 38 },
    { id: 2, bus_number: 'MNL-003', latitude: 15.4826, longitude: 120.9738, route_name: 'Manila → Santiago', speed: 80, status: 'in_transit', driver: 'Pedro Reyes', passengers: 42 },
    { id: 3, bus_number: 'MNL-007', latitude: 16.0292, longitude: 121.2453, route_name: 'Manila → Ilagan', speed: 72, status: 'in_transit', driver: 'Jose Santos', passengers: 35 },
    { id: 4, bus_number: 'MNL-012', latitude: 17.0, longitude: 121.7, route_name: 'Manila → Tuguegarao', speed: 55, status: 'in_transit', driver: 'Carlo Mendoza', passengers: 40 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2"><FiMapPin /> Live Tracking</h1>
          <p className="text-sm text-gray-500 mt-1">{buses.length} buses in transit</p>
        </div>
        <button onClick={loadActiveBuses} className="btn-secondary flex items-center gap-2"><FiRefreshCw size={14} /> Refresh</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Bus List */}
        <div className="card max-h-[600px] overflow-y-auto space-y-2">
          <h3 className="section-title mb-3">Active Buses</h3>
          {buses.map(bus => (
            <div key={bus.id} onClick={() => setSelectedBus(bus)}
              className={`p-3 rounded-lg cursor-pointer border transition-all ${selectedBus?.id === bus.id ? 'border-primary-500 bg-primary-50' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'} ${bus.sos ? 'border-red-500 bg-red-50 animate-pulse' : ''}`}>
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{bus.bus_number}</span>
                {bus.sos && <span className="badge-danger">SOS</span>}
                <span className="text-xs text-gray-400">{bus.speed} km/h</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{bus.route_name}</p>
              <p className="text-xs text-gray-400">Driver: {bus.driver}</p>
              <p className="text-xs text-gray-400">{bus.passengers} passengers</p>
            </div>
          ))}
        </div>

        {/* Map */}
        <div className="card lg:col-span-3 p-0 overflow-hidden" style={{ height: '600px' }}>
          {loading ? (
            <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div></div>
          ) : (
            <MapContainer center={center} zoom={8} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
              <MapUpdater center={selectedBus ? [selectedBus.latitude, selectedBus.longitude] : null} />
              {buses.map(bus => (
                <Marker key={bus.id} position={[bus.latitude, bus.longitude]} icon={busIcon}>
                  <Popup>
                    <div className="text-sm">
                      <p className="font-bold">{bus.bus_number}</p>
                      <p>{bus.route_name}</p>
                      <p>Driver: {bus.driver}</p>
                      <p>Speed: {bus.speed} km/h</p>
                      <p>Passengers: {bus.passengers}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
      </div>
    </div>
  );
}
