'use client';

import { MapContainer, Marker, TileLayer, ZoomControl } from 'react-leaflet';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const mapMarker = new L.Icon({
  iconUrl: '/icons/map/icon-map-marker.png',
  iconSize: [32, 32],
  iconAnchor: [10, 23],
});

interface BgMapProps {
  lat: number;
  lng: number;
}

export default function BgMap({ lat, lng }: BgMapProps) {
  return (
    <div className='w-full h-full object-cover lg:absolute aspect-[22.375/28.125] lg:aspect-auto col-span-full left-0 top-0 rounded-3xl z-0 overflow-hidden'>
      <MapContainer
        center={[lat, lng]}
        scrollWheelZoom={false}
        zoom={17}
        zoomControl={false}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <ZoomControl position='topright' />
        <TileLayer
          attribution='Map tiles by <a href="https://carto.com/attributions">CARTO</a>, under <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>. Data by <a href="https://www.openstreetmap.org">OpenStreetMap</a>, under ODbL.'
          url='https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
        />
        <Marker position={[lat, lng]} icon={mapMarker}></Marker>
      </MapContainer>
    </div>
  );
}
