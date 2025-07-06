import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, MapPin, Bed, Bath, Square, Heart, Eye } from 'lucide-react';
import { useGetPropertiesQuery } from '../store/api/propertyApi';
import { PropertyCard } from '../components/property/PropertyCard';
import { PropertyMap } from '../components/map/PropertyMap';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

interface PropertyFilters {
  query?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  city?: string;
  state?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const PropertyListingsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<PropertyFilters>({
    query: searchParams.get('query') || '',
    type: searchParams.get('type') || '',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    minBedrooms: searchParams.get('minBedrooms') ? Number(searchParams.get('minBedrooms')) : undefined,
    maxBedrooms: searchParams.get('maxBedrooms') ? Number(searchParams.get('maxBedrooms')) : undefined,
    minBathrooms: searchParams.get('minBathrooms') ? Number(searchParams.get('minBathrooms')) : undefined,
    maxBathrooms: searchParams.get('maxBathrooms') ? Number(searchParams.get('maxBathrooms')) : undefined,
    city: searchParams.get('city') || '',
    state: searchParams.get('state') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
  });

  const { data, isLoading, error } = useGetPropertiesQuery({
    ...filters,
    page,
    limit: 12,
  });

  const properties = data?.properties || [];
  const pagination = data?.pagination;

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.set(key, value.toString());
      }
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleFilterChange = (key: keyof PropertyFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error loading properties</h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={handleSearch} className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by location, property type, or keywords..."
                value={filters.query}
                onChange={(e) => handleFilterChange('query', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-5 w-5" />
              Filters
            </button>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
              >
                Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 ${viewMode === 'map' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
              >
                Map
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="HOUSE">House</option>
                  <option value="APARTMENT">Apartment</option>
                  <option value="CONDO">Condo</option>
                  <option value="TOWNHOUSE">Townhouse</option>
                  <option value="LAND">Land</option>
                  <option value="COMMERCIAL">Commercial</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice || ''}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice || ''}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms
                </label>
                <div className="flex gap-2">
                  <select
                    value={filters.minBedrooms || ''}
                    onChange={(e) => handleFilterChange('minBedrooms', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Min</option>
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}+</option>
                    ))}
                  </select>
                  <select
                    value={filters.maxBedrooms || ''}
                    onChange={(e) => handleFilterChange('maxBedrooms', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Max</option>
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    handleFilterChange('sortBy', sortBy);
                    handleFilterChange('sortOrder', sortOrder);
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="area-desc">Largest First</option>
                  <option value="area-asc">Smallest First</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {pagination?.total || 0} Properties Found
            </h1>
            {filters.query && (
              <p className="text-gray-600 mt-1">
                Search results for "{filters.query}"
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        {viewMode === 'grid' ? (
          <>
            {/* Property Grid */}
            {properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {properties.map((property: any) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No properties found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria or filters
                </p>
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-1">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        page === pageNum
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === pagination.pages}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          /* Map View */
          <div className="h-96 rounded-lg overflow-hidden">
            <PropertyMap properties={properties} />
          </div>
        )}
      </div>
    </div>
  );
};