import React, { useState, useCallback } from 'react';
import { Loader2, ExternalLink, AlertCircle } from 'lucide-react';

interface VirtualTourProps {
  tourUrl: string;
  height?: number | string;
  title?: string;
}

export const VirtualTour: React.FC<VirtualTourProps> = ({ 
  tourUrl, 
  height = 500, 
  title = "Virtual Tour" 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  const openInNewTab = useCallback(() => {
    window.open(tourUrl, '_blank', 'noopener,noreferrer');
  }, [tourUrl]);

  if (!tourUrl) {
    return (
      <div className="w-full bg-gray-100 rounded-lg p-8 text-center">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No virtual tour available for this property</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <button
          onClick={openInNewTab}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
        >
          <ExternalLink className="h-4 w-4" />
          Open in new tab
        </button>
      </div>
      
      <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-gray-600">Loading virtual tour...</p>
            </div>
          </div>
        )}
        
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-gray-600 mb-4">Failed to load virtual tour</p>
              <button
                onClick={() => {
                  setHasError(false);
                  setIsLoading(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}
        
        <iframe
          src={tourUrl}
          title={title}
          width="100%"
          height="100%"
          allowFullScreen
          className="rounded-lg"
          onLoad={handleLoad}
          onError={handleError}
          style={{ display: hasError ? 'none' : 'block' }}
        />
      </div>
      
      <div className="mt-2 text-sm text-gray-500">
        <p>Use mouse to navigate • Click and drag to look around • Scroll to zoom</p>
      </div>
    </div>
  );
};

export default VirtualTour;