import React from 'react';
import { Property } from '../../types/property';
import { MapPin } from 'lucide-react';

interface Props {
  property: Property;
}

export const PropertyCard: React.FC<Props> = ({ property }) => {
  const mainImage = property.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image';

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: property.currency || 'USD',
    maximumFractionDigits: 0,
  }).format(property.price);

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden cursor-pointer">
      <div className="h-48 w-full bg-gray-200 overflow-hidden">
        <img src={mainImage} alt={property.title} className="object-cover w-full h-full" />
      </div>
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 leading-snug truncate">
          {property.title}
        </h3>
        <div className="text-blue-600 font-bold text-xl">{formattedPrice}</div>
        <div className="flex items-center text-gray-500 text-sm gap-1">
          <MapPin className="h-4 w-4" />
          <span>
            {property.city}, {property.state}
          </span>
        </div>
        <div className="flex gap-2 text-gray-600 text-sm">
          {property.bedrooms !== undefined && (
            <span>{property.bedrooms} bd</span>
          )}
          {property.bathrooms !== undefined && (
            <span>{property.bathrooms} ba</span>
          )}
          <span>
            {property.area} {property.areaUnit}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;