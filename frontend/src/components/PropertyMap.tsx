import React, { useEffect, useRef, useState } from 'react';
import { Property } from '../types/property';

interface PropertyMapProps {
  properties: Property[];
  selectedProperty?: Property;
  onPropertySelect?: (property: Property) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  selectedProperty,
  onPropertySelect,
  center = { lat: 40.7128, lng: -74.0060 }, // Default to NYC
  zoom = 10,
  height = '400px'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    const infoWindowInstance = new window.google.maps.InfoWindow();
    
    setMap(mapInstance);
    setInfoWindow(infoWindowInstance);

    return () => {
      if (infoWindowInstance) {
        infoWindowInstance.close();
      }
    };
  }, [center.lat, center.lng, zoom]);

  // Create markers for properties
  useEffect(() => {
    if (!map || !properties.length) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));

    const newMarkers = properties
      .filter(property => property.coordinates)
      .map(property => {
        const marker = new window.google.maps.Marker({
          position: {
            lat: property.coordinates!.lat,
            lng: property.coordinates!.lng
          },
          map,
          title: property.title,
          icon: {
            url: selectedProperty?.id === property.id 
              ? '/marker-selected.png' 
              : '/marker-default.png',
            scaledSize: new window.google.maps.Size(30, 30)
          }
        });

        marker.addListener('click', () => {
          if (onPropertySelect) {
            onPropertySelect(property);
          }

          if (infoWindow) {
            const content = `
              <div class="p-3 max-w-xs">
                <img src="${property.images?.[0] || '/placeholder-property.jpg'}" 
                     alt="${property.title}" 
                     class="w-full h-32 object-cover rounded mb-2" />
                <h3 class="font-semibold text-gray-900 mb-1">${property.title}</h3>
                <p class="text-sm text-gray-600 mb-2">${property.city}, ${property.state}</p>
                <div class="flex justify-between items-center">
                  <span class="text-lg font-bold text-blue-600">
                    $${property.price.toLocaleString()}
                  </span>
                  <span class="text-sm text-gray-500">
                    ${property.bedrooms} bed, ${property.bathrooms} bath
                  </span>
                </div>
                <a href="/properties/${property.id}" 
                   class="block mt-2 text-center bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                  View Details
                </a>
              </div>
            `;
            
            infoWindow.setContent(content);
            infoWindow.open(map, marker);
          }
        });

        return marker;
      });

    setMarkers(newMarkers);

    // Fit map to show all markers
    if (newMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      newMarkers.forEach(marker => {
        bounds.extend(marker.getPosition()!);
      });
      map.fitBounds(bounds);
    }

    return () => {
      newMarkers.forEach(marker => marker.setMap(null));
    };
  }, [map, properties, selectedProperty, onPropertySelect, infoWindow]);

  // Handle loading Google Maps API
  useEffect(() => {
    if (window.google) return;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      // Map will be initialized in the first useEffect
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        style={{ height }} 
        className="w-full rounded-lg"
      />
      
      {!window.google && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg"
          style={{ height }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Extend Window interface to include google
declare global {
  interface Window {
    google: typeof google;
  }
}