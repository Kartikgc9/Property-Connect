// frontend/src/components/property/PropertySearch.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, MapPin, Filter, SlidersHorizontal } from 'lucide-react';
import { setFilters, searchProperties } from '../../store/slices/propertySlice';
import { RootState } from '../../store';
import { PropertyFilters } from './PropertyFilters';
import { MapView } from '../map/MapView';
import PropertyCard from './PropertyCard';

export const PropertySearch: React.FC = () => {
  const dispatch = useDispatch();
  const { filters, isLoading, properties } = useSelector((state: RootState) => state.property);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    dispatch(searchProperties({ ...filters, searchTerm }));
  }, [filters, searchTerm, dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(searchProperties({ ...filters, searchTerm }));
  };

  const handleFilterChange = (newFilters: any) => {
    dispatch(setFilters(newFilters));
  };

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by location, property type, or keywords..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <SlidersHorizontal className="h-5 w-5" />
            Filters
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 border-t pt-4">
            <PropertyFilters
              filters={filters}
              onFiltersChange={handleFilterChange}
            />
          </div>
        )}
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-600">
            {properties.length} properties found
          </span>
        </div>
        <div className="flex rounded-lg border border-gray-300 overflow-hidden">
          <button
            className={`px-4 py-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
            onClick={() => setViewMode('list')}
          >
            List
          </button>
          <button
            className={`px-4 py-2 ${viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
            onClick={() => setViewMode('map')}
          >
            Map
          </button>
        </div>
      </div>

      {/* Results */}
      {viewMode === 'map' ? (
        <MapView properties={properties} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
};