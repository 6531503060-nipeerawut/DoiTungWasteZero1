import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const getCustomIcon = (type) =>
    L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="
        background-color: ${type === 'village' ? '#E53935' : '#1E88E5'};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 6px rgba(0,0,0,0.5);
        "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10],
    });

const MapView = ({ locations, onSelect }) => {
    return (
        <MapContainer center={[20.2950, 99.8794]} zoom={11} style={{ height: '400px' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {locations.map(loc => (
                <Marker
                key={loc.id}
                position={[loc.latitude, loc.longitude]}
                icon={getCustomIcon(loc.type)}
                >
                <Popup>
                    <strong>{loc.name}</strong> <br />
                    <button
                    className="btn btn-sm btn-primary mt-2"
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect(loc.id);
                    }}
                    >
                    ดูข้อมูล
                    </button>
                </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapView;