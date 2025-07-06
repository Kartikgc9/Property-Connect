import React from 'react';

interface Props {
  price: number;
}

export const MapMarker: React.FC<Props> = ({ price }) => {
  return (
    <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded shadow-lg">
      {`$${price.toLocaleString()}`}
    </div>
  );
};

export default MapMarker;