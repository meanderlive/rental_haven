import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Home, Calendar, TrendingUp, DollarSign, Plus, Star, Edit, Eye } from "lucide-react";
import Navbar from "@/components/navbar";
import PropertyForm from "@/components/property-form";
import { Property, Booking } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('properties');
  const [showPropertyForm, setShowPropertyForm] = useState(false);

  const { data: properties = [], isLoading: propertiesLoading } = useQuery<Property[]>({
    queryKey: ["/api/owner/properties"],
  });

  const { data: bookingsResponse, isLoading: bookingsLoading } = useQuery<{ bookings: Booking[] }>({
    queryKey: ["/api/bookings/owner"],
  });

  // Extract bookings array from response, with fallback to empty array
  const bookings = bookingsResponse?.bookings || [];

  const activeProperties = properties.filter(p => p.status === 'approved');
  const pendingProperties = properties.filter(p => p.status === 'pending');
  const activeBookings = bookings.filter(b => b.status === 'confirmed');
  const monthlyRevenue = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + parseFloat(b.totalAmount), 0);
  const avgRating = properties.length > 0 
    ? properties.reduce((sum, p) => sum + parseFloat(p.rating || '0'), 0) / properties.length 
    : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm h-screen sticky top-0">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900">Owner Dashboard</h2>
          </div>
          <nav className="mt-6">
            <button
              onClick={() => setActiveTab('properties')}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 ${
                activeTab === 'properties' ? 'text-red-600 bg-red-50 border-r-2 border-red-600' : 'text-gray-600'
              }`}
            >
              <Home className="mr-3 h-5 w-5" />
              My Properties
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 ${
                activeTab === 'bookings' ? 'text-red-600 bg-red-50 border-r-2 border-red-600' : 'text-gray-600'
              }`}
            >
              <Calendar className="mr-3 h-5 w-5" />
              Bookings
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 ${
                activeTab === 'analytics' ? 'text-red-600 bg-red-50 border-r-2 border-red-600' : 'text-gray-600'
              }`}
            >
              <TrendingUp className="mr-3 h-5 w-5" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('earnings')}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 ${
                activeTab === 'earnings' ? 'text-red-600 bg-red-50 border-r-2 border-red-600' : 'text-gray-600'
              }`}
            >
              <DollarSign className="mr-3 h-5 w-5" />
              Earnings
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Property Management</h1>
              <p className="text-gray-600">Manage your properties and track bookings</p>
            </div>
            <Button onClick={() => setShowPropertyForm(true)} className="btn-rental">
              <Plus className="mr-2 h-4 w-4" />
              Add New Property
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <Home className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Properties</p>
                    <p className="text-2xl font-semibold text-gray-900">{properties.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-teal-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-teal-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Active Bookings</p>
                    <p className="text-2xl font-semibold text-gray-900">{activeBookings.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Monthly Revenue</p>
                    <p className="text-2xl font-semibold text-gray-900">${monthlyRevenue.toFixed(0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Avg Rating</p>
                    <p className="text-2xl font-semibold text-gray-900">{avgRating.toFixed(1)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {activeTab === 'properties' && (
            <Card>
              <CardHeader>
                <CardTitle>Your Properties</CardTitle>
              </CardHeader>
              <CardContent>
                {propertiesLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center p-4 bg-gray-50 rounded-lg animate-pulse">
                        <div className="w-16 h-12 bg-gray-300 rounded-lg"></div>
                        <div className="ml-4 flex-1 space-y-2">
                          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                        </div>
                        <div className="h-6 bg-gray-300 rounded w-20"></div>
                      </div>
                    ))}
                  </div>
                ) : properties.length === 0 ? (
                  <div className="text-center py-8">
                    <Home className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No properties yet</h3>
                    <p className="text-gray-500 mb-4">Start by adding your first property to begin earning!</p>
                    <Button onClick={() => setShowPropertyForm(true)} className="btn-rental">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Property
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Property
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price/Night
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {properties.map((property) => (
                          <tr key={property.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-16 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-lg flex items-center justify-center">
                                  <Home className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{property.title}</div>
                                  <div className="text-sm text-gray-500">{property.type}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {property.city}, {property.state}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${property.pricePerNight}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={getStatusColor(property.status)}>
                                {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button className="text-red-600 hover:text-red-900">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="text-gray-600 hover:text-gray-900">
                                <Eye className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'bookings' && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {bookingsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center p-4 bg-gray-50 rounded-lg animate-pulse">
                        <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
                        <div className="ml-4 flex-1 space-y-2">
                          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                        </div>
                        <div className="h-6 bg-gray-300 rounded w-20"></div>
                      </div>
                    ))}
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                    <p className="text-gray-500">Bookings will appear here once guests start booking your properties.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-blue-500 rounded-lg flex items-center justify-center">
                            <Calendar className="h-8 w-8 text-white" />
                          </div>
                          <div className="ml-4">
                            <h3 className="font-semibold text-gray-900">Property #{booking.propertyId}</h3>
                            <p className="text-sm text-gray-600">
                              {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600">{booking.guests} guests</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                          <p className="text-lg font-semibold text-gray-900 mt-1">${booking.totalAmount}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'analytics' && (
            <Card>
              <CardHeader>
                <CardTitle>Analytics Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Property Performance</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Active Properties</span>
                        <span className="font-semibold">{activeProperties.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Pending Approval</span>
                        <span className="font-semibold">{pendingProperties.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Average Rating</span>
                        <span className="font-semibold">{avgRating.toFixed(1)}/5</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Booking Trends</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Bookings</span>
                        <span className="font-semibold">{bookings.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Active Bookings</span>
                        <span className="font-semibold">{activeBookings.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Occupancy Rate</span>
                        <span className="font-semibold">
                          {properties.length > 0 ? ((activeBookings.length / properties.length) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'earnings' && (
            <Card>
              <CardHeader>
                <CardTitle>Earnings Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">${monthlyRevenue.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Total Earnings</p>
                  </div>
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">{properties.length > 0 ? (monthlyRevenue / properties.length).toFixed(2) : '0.00'}</p>
                    <p className="text-sm text-gray-600">Avg per Property</p>
                  </div>
                  <div className="text-center p-6 bg-purple-50 rounded-lg">
                    <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-600">{bookings.length}</p>
                    <p className="text-sm text-gray-600">Total Bookings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <PropertyForm 
        isOpen={showPropertyForm}
        onClose={() => setShowPropertyForm(false)}
      />
    </div>
  );
}
