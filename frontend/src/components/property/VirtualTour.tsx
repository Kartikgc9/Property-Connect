import React from 'react';

interface Props {
  tourUrl: string;
  height?: number | string;
}

export const VirtualTour: React.FC<Props> = ({ tourUrl, height = 500 }) => {
  if (!tourUrl) return null;
  return (
    <div className="w-full">
      <iframe
        src={tourUrl}
        title="Virtual Tour"
        width="100%"
        height={height}
        allowFullScreen
        className="rounded-lg shadow"
      />
    </div>
  );
};

export default VirtualTour;