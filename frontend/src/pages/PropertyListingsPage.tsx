import React from 'react';
import { PropertySearch } from '../components/property/PropertySearch';

export const PropertyListingsPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <PropertySearch />
    </div>
  );
};

export default PropertyListingsPage;