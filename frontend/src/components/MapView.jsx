// MapView.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet'; // ✅ เพิ่ม Tooltip
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ฟังก์ชันสร้างไอคอนหมุดจากรูปภาพ
const getCustomIcon = (type) => {
  const filterStyle = type === 'village' 
    ? '' 
    : 'filter: hue-rotate(210deg) saturate(1.2) brightness(1.1);'; 

  return L.divIcon({
    className: 'custom-pin-icon',
    html: `
      <div style="
        width: 100%; 
        height: 100%; 
        display: flex; 
        justify-content: center; 
        align-items: flex-end;
        transition: transform 0.2s ease;
      ">
        <img 
          src="/images/pin/pinmap.webp" 
          alt="pin" 
          style="
            width: 100%; 
            height: 100%; 
            object-fit: contain; 
            filter: drop-shadow(2px 4px 4px rgba(0,0,0,0.4)) ${filterStyle};
          "
        />
      </div>
    `,
    iconSize: [40, 40], 
    iconAnchor: [20, 40], 
    popupAnchor: [0, -45], 
    tooltipAnchor: [0, -45], // ✅ เพิ่มจุดแสดง Tooltip ให้อยู่เหนือหมุด
  });
};

const MapView = ({ locations = [], onSelect }) => {
  return (
    <MapContainer
      center={[20.2950, 99.8794]}
      zoom={11}
      style={{ height: '100%', width: '100%', minHeight: '400px', zIndex: 0 }}
      scrollWheelZoom
    >
      <TileLayer 
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
      />

      {locations.map((loc) => (
        <Marker
          key={loc.id}
          position={[loc.latitude, loc.longitude]}
          icon={getCustomIcon(loc.type)}
          // ✅ แก้ไข: ใช้แค่ click อย่างเดียว (ลบ mouseover/out ออก) เพื่อให้ Popup ค้าง
          eventHandlers={{
            click: () => {
              onSelect(loc.id);
            },
          }}
        >
          {/* ✅ เพิ่ม Tooltip: เอาเมาส์ชี้แล้วขึ้นชื่อ (ไม่ต้องกด) */}
          <Tooltip direction="top" offset={[0, -50]} opacity={1}>
            <span style={{ fontFamily: 'Sarabun, sans-serif', fontSize: '0.9rem' }}>
              {loc.name}
            </span>
          </Tooltip>

          {/* ✅ Popup: กดแล้วถึงจะขึ้น และจะค้างไว้จนกว่าจะกดปิด */}
          <Popup>
            <div style={{ textAlign: 'center', fontFamily: 'Sarabun, sans-serif', minWidth: '140px' }}>
              <strong style={{ fontSize: '1.1rem', color: '#333', display: 'block', marginBottom: '4px' }}>
                {loc.name}
              </strong>
              <span 
                style={{ 
                  fontSize: '0.85rem', 
                  color: 'white', 
                  backgroundColor: loc.type === 'village' ? '#E53935' : '#1976D2',
                  padding: '2px 8px',
                  borderRadius: '12px'
                }}
              >
                {loc.type === 'village' ? 'หมู่บ้าน' : 'หน่วยงาน'}
              </span>
              <br />
              {/* <button
                className="btn btn-sm btn-success mt-2 w-100"
                style={{ borderRadius: '20px', fontSize: '0.85rem' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(loc.id);
                }}
              >
                ดูสถิติขยะ
              </button> */}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;