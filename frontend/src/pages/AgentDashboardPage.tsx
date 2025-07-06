import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Home, TrendingUp, Users, MessageCircle, Calendar, 
  DollarSign, Eye, Edit, Trash2, BarChart3, Star, Award
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useGetAgentPropertiesQuery, useGetAgentMetricsQuery } from '../store/api/agentApi';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const AgentDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'analytics' | 'messages'>('overview');
  const user = useSelector((state: RootState) => state.auth.user);

  const { data: properties, isLoading: propertiesLoading } = useGetAgentPropertiesQuery({
    page: 1,
    limit: 10
  });

  const { data: metrics, isLoading: metricsLoading } = useGetAgentMetricsQuery(user?.agent?.id!, {
    skip: !user?.agent?.id
  });

  if (!user || user.role !== 'AGENT') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">This page is only accessible to real estate agents.</p>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Active Listings',
      value: properties?.properties?.filter((p: any) => p.status === 'ACTIVE').length || 0,
      icon: Home,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Views',
      value: '2,543',
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Properties Sold',
      value: metrics?.propertiesSold || 0,
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Total Revenue',
      value: `$${(metrics?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  ];

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
      month: 'short',
      day: 'numeric',
    });
  };

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
                Manage your properties and track your performance
              </p>
            </div>
            <Link
              to="/properties/new"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Property
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'properties', label: 'My Properties', icon: Home },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp },
                { id: 'messages', label: 'Messages', icon: MessageCircle },
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
                      <div className="bg-green-100 p-2 rounded-full">
                        <Eye className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          Your property "Luxury Downtown Condo" received 15 new views
                        </p>
                        <p className="text-sm text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <MessageCircle className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          New message from potential buyer about "Modern Family Home"
                        </p>
                        <p className="text-sm text-gray-500">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <Star className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          You received a 5-star review from John Smith
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
                      to="/properties/new"
                      className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <Plus className="h-8 w-8 text-gray-400 mb-2" />
                      <h3 className="font-medium text-gray-900">Add New Property</h3>
                      <p className="text-sm text-gray-500">List a new property for sale</p>
                    </Link>
                    <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left">
                      <Calendar className="h-8 w-8 text-gray-400 mb-2" />
                      <h3 className="font-medium text-gray-900">Schedule Showing</h3>
                      <p className="text-sm text-gray-500">Book property viewings</p>
                    </button>
                    <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-left">
                      <Users className="h-8 w-8 text-gray-400 mb-2" />
                      <h3 className="font-medium text-gray-900">Manage Clients</h3>
                      <p className="text-sm text-gray-500">View and contact clients</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Properties Tab */}
            {activeTab === 'properties' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">My Properties</h2>
                  <div className="flex space-x-2">
                    <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                      <option>All Status</option>
                      <option>Active</option>
                      <option>Pending</option>
                      <option>Sold</option>
                    </select>
                    <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                      <option>All Types</option>
                      <option>House</option>
                      <option>Apartment</option>
                      <option>Condo</option>
                    </select>
                  </div>
                </div>

                {propertiesLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {properties?.properties?.map((property: any) => (
                      <div key={property.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex space-x-4">
                            <img
                              src={property.images[0] || '/placeholder-property.jpg'}
                              alt={property.title}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {property.title}
                              </h3>
                              <p className="text-gray-600 mb-2">{property.address}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>{property.bedrooms} bed</span>
                                <span>{property.bathrooms} bath</span>
                                <span>{property.area} sqft</span>
                              </div>
                              <div className="mt-2">
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                  property.status === 'ACTIVE' 
                                    ? 'bg-green-100 text-green-800'
                                    : property.status === 'PENDING'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {property.status}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900 mb-2">
                              {formatPrice(property.price)}
                            </p>
                            <p className="text-sm text-gray-500 mb-4">
                              Listed {formatDate(property.createdAt)}
                            </p>
                            <div className="flex space-x-2">
                              <Link
                                to={`/properties/${property.id}`}
                                className="p-2 text-gray-400 hover:text-blue-600"
                              >
                                <Eye className="h-5 w-5" />
                              </Link>
                              <Link
                                to={`/properties/${property.id}/edit`}
                                className="p-2 text-gray-400 hover:text-green-600"
                              >
                                <Edit className="h-5 w-5" />
                              </Link>
                              <button className="p-2 text-gray-400 hover:text-red-600">
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Performance Analytics</h2>
                
                {metricsLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <>
                    {/* Performance Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                        <h3 className="text-lg font-semibold mb-2">This Month</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Properties Listed</span>
                            <span className="font-bold">{metrics?.propertiesListed || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Properties Sold</span>
                            <span className="font-bold">{metrics?.propertiesSold || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Revenue</span>
                            <span className="font-bold">${(metrics?.totalRevenue || 0).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Time</h3>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600 mb-1">
                            {metrics?.avgResponseTime || 0}h
                          </div>
                          <p className="text-sm text-gray-500">Average response time</p>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Rating</h3>
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Star className="h-8 w-8 text-yellow-400 fill-current" />
                            <span className="text-3xl font-bold text-gray-900 ml-2">
                              {user.agent?.rating?.toFixed(1) || '0.0'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {user.agent?.reviewCount || 0} reviews
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Chart Placeholder */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
                      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                        <div className="text-center">
                          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">Chart visualization will be displayed here</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Messages</h2>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex space-x-3">
                          <img
                            src={`/avatar-${i}.jpg`}
                            alt="User"
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/default-avatar.png';
                            }}
                          />
                          <div>
                            <h3 className="font-medium text-gray-900">John Smith</h3>
                            <p className="text-sm text-gray-600">
                              Interested in the downtown property...
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">2h ago</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};