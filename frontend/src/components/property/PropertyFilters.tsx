import React, { useState } from 'react';
import { PropertyFilters as FiltersType, PropertyType } from '../../types/property';

interface PropertyFiltersProps {
  filters: FiltersType;
  onFiltersChange: (filters: FiltersType) => void;
}

export const PropertyFilters: React.FC<PropertyFiltersProps> = ({ filters, onFiltersChange }) => {
  const [localFilters, setLocalFilters] = useState<FiltersType>(filters);

  const handleChange = <K extends keyof FiltersType>(field: K, value: FiltersType[K]) => {
    const updated = { ...localFilters, [field]: value };
    setLocalFilters(updated);
    onFiltersChange(updated);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Price Min</label>
        <input
          type="number"
          value={localFilters.priceMin || ''}
          onChange={(e) => handleChange('priceMin', Number((e as React.ChangeEvent<HTMLInputElement>).target.value))}
          className="w-full border px-3 py-2 rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Price Max</label>
        <input
          type="number"
          value={localFilters.priceMax || ''}
          onChange={(e) => handleChange('priceMax', Number((e as React.ChangeEvent<HTMLInputElement>).target.value))}
          className="w-full border px-3 py-2 rounded-lg"
        />
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
        <select
          multiple
          value={(localFilters.propertyType ?? []) as PropertyType[]}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            const options = Array.from(e.target.selectedOptions).map((o) => o.value as PropertyType);
            handleChange('propertyType', options);
          }}
          className="w-full border px-3 py-2 rounded-lg h-32"
        >
          {Object.values(PropertyType).map((pt) => (
            <option key={pt} value={pt}>{pt}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PropertyFilters;