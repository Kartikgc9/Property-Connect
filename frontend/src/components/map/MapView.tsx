import React, { useMemo } from 'react';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Property } from '../../types/property';
import MapMarker from './MapMarker';

interface MapViewProps {
  properties: Property[];
  height?: number | string;
}

export const MapView: React.FC<MapViewProps> = ({ properties, height = 600 }) => {
  const center = useMemo(() => {
    if (properties.length === 0) return { lat: 37.7749, lng: -122.4194 }; // default SF
    const [first] = properties;
    return first.coordinates;
  }, [properties]);

  return (
    <div className="w-full" style={{ height }}>
      <Map
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        initialViewState={{
          latitude: center.lat,
          longitude: center.lng,
          zoom: 11,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        {properties.map((p) => (
          <Marker key={p.id} longitude={p.coordinates.lng} latitude={p.coordinates.lat} anchor="bottom">
            <MapMarker price={p.price} />
          </Marker>
        ))}
      </Map>
    </div>
  );
};

export default MapView;