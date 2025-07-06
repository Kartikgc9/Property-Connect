import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, Bed, Bath, Square, Calendar, Shield, Heart, Share2, 
  Phone, Mail, MessageCircle, Star, ChevronLeft, ChevronRight,
  Home, Car, Wifi, Pool, Dumbbell, TreePine 
} from 'lucide-react';
import { useGetPropertyQuery } from '../store/api/propertyApi';
import { useGetAgentQuery } from '../store/api/agentApi';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { PropertyMap } from '../components/map/PropertyMap';
import { ChatModal } from '../components/chat/ChatModal';

export const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showFullMap, setShowFullMap] = useState(false);

  const { data: property, isLoading: propertyLoading, error: propertyError } = useGetPropertyQuery(id!);
  const { data: agent, isLoading: agentLoading } = useGetAgentQuery(property?.agentId, {
    skip: !property?.agentId
  });

  if (propertyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (propertyError || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property not found</h2>
          <p className="text-gray-600 mb-4">The property you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/properties')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  const images = property.images || [];
  const amenityIcons: { [key: string]: any } = {
    'Parking': Car,
    'WiFi': Wifi,
    'Pool': Pool,
    'Gym': Dumbbell,
    'Garden': TreePine,
    'Garage': Home,
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Gallery */}
      <div className="relative h-96 bg-gray-900">
        {images.length > 0 ? (
          <>
            <img
              src={images[currentImageIndex]}
              alt={`Property image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            <Home className="h-16 w-16" />
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button className="bg-white/80 hover:bg-white rounded-full p-2 transition-colors">
            <Heart className="h-6 w-6" />
          </button>
          <button className="bg-white/80 hover:bg-white rounded-full p-2 transition-colors">
            <Share2 className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Header */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
                  <div className="flex items-center text-gray-600 mt-2">
                    <MapPin className="h-5 w-5 mr-1" />
                    <span>{property.address}, {property.city}, {property.state} {property.zipCode}</span>
                  </div>
                </div>
                {property.isVerified && (
                  <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    <Shield className="h-5 w-5 mr-1" />
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                )}
              </div>

              <div className="text-4xl font-bold text-blue-600 mb-4">
                {formatPrice(property.price)}
              </div>

              {/* Property Stats */}
              <div className="flex flex-wrap gap-6 text-gray-600">
                {property.bedrooms && (
                  <div className="flex items-center">
                    <Bed className="h-5 w-5 mr-2" />
                    <span>{property.bedrooms} Bedrooms</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center">
                    <Bath className="h-5 w-5 mr-2" />
                    <span>{property.bathrooms} Bathrooms</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Square className="h-5 w-5 mr-2" />
                  <span>{property.area.toLocaleString()} {property.areaUnit}</span>
                </div>
                {property.yearBuilt && (
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>Built in {property.yearBuilt}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity: string, index: number) => {
                    const IconComponent = amenityIcons[amenity] || Home;
                    return (
                      <div key={index} className="flex items-center text-gray-700">
                        <IconComponent className="h-5 w-5 mr-3 text-blue-600" />
                        <span>{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Map */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Location</h2>
              <div className="relative h-64 rounded-lg overflow-hidden">
                <PropertyMap 
                  properties={[property]} 
                  center={property.coordinates}
                  zoom={15}
                />
                <button
                  onClick={() => setShowFullMap(true)}
                  className="absolute top-4 right-4 bg-white px-3 py-1 rounded shadow-lg text-sm hover:bg-gray-50"
                >
                  View larger map
                </button>
              </div>
            </div>

            {/* Virtual Tour */}
            {property.virtualTourUrl && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Virtual Tour</h2>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={property.virtualTourUrl}
                    className="w-full h-full"
                    allowFullScreen
                    title="Virtual Tour"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Card */}
            {agent && !agentLoading && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Listed by</h3>
                <div className="flex items-start space-x-4">
                  <img
                    src={agent.user.avatar || '/default-avatar.png'}
                    alt={`${agent.user.firstName} ${agent.user.lastName}`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {agent.user.firstName} {agent.user.lastName}
                    </h4>
                    <p className="text-gray-600 text-sm">{agent.agency}</p>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">
                        {agent.rating.toFixed(1)} ({agent.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <button
                    onClick={() => setShowChatModal(true)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Send Message
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 flex items-center justify-center">
                    <Phone className="h-5 w-5 mr-2" />
                    Call {agent.user.phone}
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 flex items-center justify-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Email Agent
                  </button>
                </div>
              </div>
            )}

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Property Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Type</span>
                  <span className="font-medium">{property.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-medium ${
                    property.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {property.status}
                  </span>
                </div>
                {property.lotSize && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lot Size</span>
                    <span className="font-medium">{property.lotSize.toLocaleString()} sqft</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Listed Date</span>
                  <span className="font-medium">{formatDate(property.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">MLS ID</span>
                  <span className="font-medium">{property.id.slice(-8).toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Similar Properties */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Similar Properties</h3>
              <p className="text-gray-600 text-sm">
                View other properties in {property.city} with similar features and price range.
              </p>
              <button className="mt-3 w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50">
                View Similar Properties
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {showChatModal && agent && (
        <ChatModal
          isOpen={showChatModal}
          onClose={() => setShowChatModal(false)}
          recipient={agent.user}
          propertyId={property.id}
        />
      )}
    </div>
  );
};