import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Property } from '../types/property';
import PropertyDetails from '../components/property/PropertyDetails';

export const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/properties/${id}`);
        setProperty(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading || !property) return <div className="p-6">Loading...</div>;

  return (
    <div className="container mx-auto py-6">
      <PropertyDetails property={property} />
    </div>
  );
};

export default PropertyDetailsPage;