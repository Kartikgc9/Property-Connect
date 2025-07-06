import React from 'react';
import { Property } from '../../types/property';
import VirtualTour from './VirtualTour';

interface Props {
  property: Property;
}

export const PropertyDetails: React.FC<Props> = ({ property }) => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{property.title}</h1>
      <p className="text-gray-700">{property.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <img
            src={property.images?.[0] || 'https://via.placeholder.com/800x600'}
            alt={property.title}
            className="w-full rounded-lg"
          />
        </div>
        <div className="space-y-2">
          <div>Price: ${property.price.toLocaleString()} {property.currency}</div>
          <div>Bedrooms: {property.bedrooms}</div>
          <div>Bathrooms: {property.bathrooms}</div>
          <div>Area: {property.area} {property.areaUnit}</div>
          <div>Address: {property.address}, {property.city}, {property.state}</div>
        </div>
      </div>

      {property.virtualTourUrl && <VirtualTour tourUrl={property.virtualTourUrl} />}
    </div>
  );
};

export default PropertyDetails;