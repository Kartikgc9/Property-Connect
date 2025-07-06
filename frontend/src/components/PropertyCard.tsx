import React from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../types/property';

interface PropertyCardProps {
  property: Property;
  onSave?: (propertyId: string) => void;
  onRemove?: (propertyId: string) => void;
  isSaved?: boolean;
  showActions?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSave,
  onRemove,
  isSaved = false,
  showActions = true
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSaved && onRemove) {
      onRemove(property.id);
    } else if (!isSaved && onSave) {
      onSave(property.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/properties/${property.id}`} className="block">
        <div className="relative">
          <img
            src={property.images?.[0] || '/placeholder-property.jpg'}
            alt={property.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-sm font-semibold">
            {property.type}
          </div>
          {showActions && (
            <button
              onClick={handleSaveToggle}
              className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
            >
              <svg
                className={`w-5 h-5 ${isSaved ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                fill={isSaved ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {property.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {property.description}
          </p>

          <div className="flex items-center justify-between mb-3">
            <div className="text-2xl font-bold text-blue-600">
              {formatPrice(property.price)}
            </div>
            <div className="text-sm text-gray-500">
              {property.area} {property.areaUnit}
            </div>
          </div>

          <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
              {property.bedrooms} bed
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {property.bathrooms} bath
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {property.city}, {property.state}
            </div>
            
            {property.agent && (
              <div className="text-sm text-gray-500">
                Agent: {property.agent.user.firstName} {property.agent.user.lastName}
              </div>
            )}
          </div>

          {property.amenities && property.amenities.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex flex-wrap gap-1">
                {property.amenities.slice(0, 3).map((amenity, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                  >
                    {amenity}
                  </span>
                ))}
                {property.amenities.length > 3 && (
                  <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                    +{property.amenities.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};