import React from 'react';
import { Property } from '../../types/property';
import PropertyCard from './PropertyCard';

interface Props {
  properties: Property[];
}

export const PropertyList: React.FC<Props> = ({ properties }) => {
  if (properties.length === 0) {
    return <div className="text-center text-gray-600">No properties found.</div>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  );
};

export default PropertyList;