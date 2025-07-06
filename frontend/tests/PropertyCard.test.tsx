import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PropertyCard from '../src/components/property/PropertyCard';
import { PropertyStatus, PropertyType } from '../src/types/property';

const mockProperty = {
  id: '1',
  title: 'Test House',
  description: 'Nice house',
  type: PropertyType.HOUSE,
  status: PropertyStatus.ACTIVE,
  price: 450000,
  currency: 'USD',
  bedrooms: 3,
  bathrooms: 2,
  area: 1800,
  areaUnit: 'sqft',
  address: '123 Main St',
  city: 'Sample',
  state: 'CA',
  zipCode: '90001',
  country: 'US',
  coordinates: { lat: 0, lng: 0 },
  images: [],
  amenities: [],
  isVerified: false,
  agentId: 'a1',
  agent: {
    id: 'a1',
    user: { firstName: 'John', lastName: 'Doe' },
    agency: 'XYZ',
    rating: 4.5,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('PropertyCard', () => {
  it('renders property title and price', () => {
    render(<PropertyCard property={mockProperty as any} />);
    expect(screen.getByText(/Test House/)).toBeInTheDocument();
    expect(screen.getByText(/\$450,000/)).toBeInTheDocument();
  });
});