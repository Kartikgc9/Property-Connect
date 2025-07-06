import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, Search, Bell, MapPin, Filter, Bookmark, 
  TrendingUp, Clock, Star, MessageCircle, Home, Eye
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useGetSavedPropertiesQuery, useGetRecommendationsQuery } from '../store/api/propertyApi';
import { PropertyCard } from '../components/property/PropertyCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const BuyerDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'saved' | 'recommendations' | 'searches'>('overview');
  const user = useSelector((state: RootState) => state.auth.user);

  const { data: savedProperties, isLoading: savedLoading } = useGetSavedPropertiesQuery();
  const { data: recommendations, isLoading: recommendationsLoading } = useGetRecommendationsQuery(
    user?.buyer?.id!,
    { skip: !user?.buyer?.id }
  );

  if (!user || user.role !== 'BUYER') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">This page is only accessible to property buyers.</p>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const recentSearches = [
    { query: 'Downtown apartments', filters: '2+ bed, $200k-$400k', timestamp: '2 hours ago' },
    { query: 'Family homes', filters: '3+ bed, garage', timestamp: '1 day ago' },
    { query: 'Condos near park', filters: 'Under $300k', timestamp: '3 days ago' },
  ];

  const marketInsights = [
    {
      title: 'Market Trend',
      value: '+2.5%',
      description: 'Average price increase this month',
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      title: 'New Listings',
      value: '234',
      description: 'Properties added this week',
      icon: Home,
      color: 'text-blue-600',
    },
    {
      title: 'Price Drop',
      value: '12',
      description: 'Properties with reduced prices',
      icon: TrendingUp,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user.firstName}!
              </h1>
              <p className="text-gray-600 mt-1">
                Find your perfect home with personalized recommendations
              </p>
            </div>
            <div className="flex space-x-3">
              <Link
                to="/properties"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Search className="h-5 w-5 mr-2" />
                Search Properties
              </Link>
              <button className="bg-white border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center">
                <Bell className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-red-50 p-3 rounded-lg">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Saved Properties</p>
                <p className="text-2xl font-bold text-gray-900">
                  {savedProperties?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-50 p-3 rounded-lg">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recent Searches</p>
                <p className="text-2xl font-bold text-gray-900">{recentSearches.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-50 p-3 rounded-lg">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recommendations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {recommendations?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Market Insights */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Market Insights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {marketInsights.map((insight, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <insight.icon className={`h-8 w-8 ${insight.color}`} />
                </div>
                <div className={`text-2xl font-bold ${insight.color} mb-1`}>
                  {insight.value}
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{insight.title}</h3>
                <p className="text-sm text-gray-500">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: Home },
                { id: 'saved', label: 'Saved Properties', icon: Heart },
                { id: 'recommendations', label: 'For You', icon: Star },
                { id: 'searches', label: 'Search History', icon: Clock },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Recent Activity */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Eye className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          You viewed "Modern Downtown Loft" 
                        </p>
                        <p className="text-sm text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className="bg-red-100 p-2 rounded-full">
                        <Heart className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          You saved "Family Home in Suburbs"
                        </p>
                        <p className="text-sm text-gray-500">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Search className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          You searched for "3 bedroom houses under $400k"
                        </p>
                        <p className="text-sm text-gray-500">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                      to="/properties"
                      className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <Search className="h-8 w-8 text-gray-400 mb-2" />
                      <h3 className="font-medium text-gray-900">Search Properties</h3>
                      <p className="text-sm text-gray-500">Find your dream home</p>
                    </Link>
                    <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left">
                      <MapPin className="h-8 w-8 text-gray-400 mb-2" />
                      <h3 className="font-medium text-gray-900">Set Preferences</h3>
                      <p className="text-sm text-gray-500">Update your search criteria</p>
                    </button>
                    <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-left">
                      <MessageCircle className="h-8 w-8 text-gray-400 mb-2" />
                      <h3 className="font-medium text-gray-900">Contact Agents</h3>
                      <p className="text-sm text-gray-500">Get expert assistance</p>
                    </button>
                  </div>
                </div>

                {/* Recent Recommendations */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Recommended for You</h2>
                    <Link to="#" className="text-blue-600 hover:text-blue-700 text-sm">
                      View all
                    </Link>
                  </div>
                  {recommendationsLoading ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recommendations?.slice(0, 3).map((property: any) => (
                        <PropertyCard key={property.id} property={property} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Saved Properties Tab */}
            {activeTab === 'saved' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Saved Properties</h2>
                  <div className="flex space-x-2">
                    <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                      <option>All Types</option>
                      <option>House</option>
                      <option>Apartment</option>
                      <option>Condo</option>
                    </select>
                    <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                      <option>Any Price</option>
                      <option>Under $200k</option>
                      <option>$200k - $400k</option>
                      <option>Over $400k</option>
                    </select>
                  </div>
                </div>

                {savedLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : savedProperties && savedProperties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedProperties.map((property: any) => (
                      <PropertyCard key={property.id} property={property} showSaveButton />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No saved properties yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Start exploring properties and save your favorites
                    </p>
                    <Link
                      to="/properties"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Browse Properties
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Recommendations Tab */}
            {activeTab === 'recommendations' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Personalized Recommendations</h2>
                  <p className="text-gray-600">
                    Based on your preferences and search history, here are properties you might like
                  </p>
                </div>

                {recommendationsLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : recommendations && recommendations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.map((property: any) => (
                      <PropertyCard key={property.id} property={property} showSaveButton />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Building your recommendations
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Search and save properties to get personalized recommendations
                    </p>
                    <Link
                      to="/properties"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Start Exploring
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Search History Tab */}
            {activeTab === 'searches' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Search History</h2>
                  <p className="text-gray-600">Your recent property searches</p>
                </div>

                <div className="space-y-4">
                  {recentSearches.map((search, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">{search.query}</h3>
                          <p className="text-sm text-gray-600 mb-2">{search.filters}</p>
                          <p className="text-sm text-gray-500">{search.timestamp}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                            Search Again
                          </button>
                          <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                            Save Search
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {recentSearches.length === 0 && (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No search history
                    </h3>
                    <p className="text-gray-600">
                      Your recent searches will appear here
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};