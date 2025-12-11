import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Calendar, Home, Heart, User, Settings, Star } from "lucide-react";
import Navbar from "@/components/navbar";
import { Booking, Property } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useWishlist } from "@/contexts/WishlistContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/property-card";
import BookingDetailsModal from "@/components/booking-details-modal";

export default function UserDashboard() {
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState('bookings');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);

  const { data: bookingsResponse, isLoading: bookingsLoading } = useQuery<{ bookings: Booking[] }>({
    queryKey: ["/api/bookings/user"],
  });

  const { data: allProperties = [], isLoading: propertiesLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  // Extract bookings array from response, with fallback to empty array
  const bookings = bookingsResponse?.bookings || [];
  
  const activeBookings = bookings.filter(b => b.status === 'confirmed' && new Date(b.checkOut) > new Date());
  const pastBookings = bookings.filter(b => b.status === 'completed' || new Date(b.checkOut) < new Date());

  // Show demo bookings from localStorage
  const [myBookings, setMyBookings] = useState<any[]>([]);

  useEffect(() => {
    const storedBookings = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('myBookings') || '[]') : [];
    setMyBookings(storedBookings);
  }, []);

  // Listen for storage changes to update bookings in real-time
  useEffect(() => {
    const handleStorageChange = () => {
      const storedBookings = JSON.parse(localStorage.getItem('myBookings') || '[]');
      setMyBookings(storedBookings);
    };

    // Listen for custom event when localStorage is updated in same tab
    const handleCustomStorageChange = () => {
      const storedBookings = JSON.parse(localStorage.getItem('myBookings') || '[]');
      setMyBookings(storedBookings);
    };

    // Listen for wishlist updates
    const handleWishlistUpdate = () => {
      // Force re-render by updating a dummy state or refetching data
      console.log('Wishlist updated, refreshing dashboard');
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('bookingUpdated', handleCustomStorageChange);
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bookingUpdated', handleCustomStorageChange);
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, []);

  // Get wishlist properties
  const wishlistProperties = allProperties.filter(property => wishlist.includes(property.id!));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBookingClick = (booking: any) => {
    setSelectedBooking(booking);
    setShowBookingDetails(true);
  };

  const handleCloseBookingDetails = () => {
    setShowBookingDetails(false);
    setSelectedBooking(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm h-screen sticky top-0">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900">User Dashboard</h2>
          </div>
          <nav className="mt-6">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 ${
                activeTab === 'bookings' ? 'text-red-600 bg-red-50 border-r-2 border-red-600' : 'text-gray-600'
              }`}
            >
              <Home className="mr-3 h-5 w-5" />
              My Bookings
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 ${
                activeTab === 'wishlist' ? 'text-red-600 bg-red-50 border-r-2 border-red-600' : 'text-gray-600'
              }`}
            >
              <Heart className="mr-3 h-5 w-5" />
              Wishlist
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 ${
                activeTab === 'profile' ? 'text-red-600 bg-red-50 border-r-2 border-red-600' : 'text-gray-600'
              }`}
            >
              <User className="mr-3 h-5 w-5" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 ${
                activeTab === 'settings' ? 'text-red-600 bg-red-50 border-r-2 border-red-600' : 'text-gray-600'
              }`}
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.firstName ? `${user.firstName} ${user.lastName}` : "Guest"}!</h1>
            <p className="text-gray-600">Manage your bookings and discover new properties</p>
          </div>

          {activeTab === 'bookings' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-red-100 rounded-lg">
                        <Calendar className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">Active Bookings</p>
                        <p className="text-2xl font-semibold text-gray-900">{myBookings.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-teal-100 rounded-lg">
                        <Home className="h-6 w-6 text-teal-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">Total Bookings</p>
                        <p className="text-2xl font-semibold text-gray-900">{myBookings.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-yellow-100 rounded-lg">
                        <Heart className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">Saved Properties</p>
                        <p className="text-2xl font-semibold text-gray-900">{wishlistProperties.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Bookings */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>My Bookings</CardTitle>
                    {myBookings.length > 5 && (
                      <Button variant="outline" size="sm">
                        View All ({myBookings.length})
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {myBookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Home className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                      <p className="text-gray-500 mb-4">Start exploring properties to make your first booking!</p>
                      <Link href="/" className="btn-rental">Browse Properties</Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myBookings.slice(0, 5).reverse().map((booking: any, i: number) => (
                        <div 
                          key={i} 
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                          onClick={() => handleBookingClick(booking)}
                        >
                          <div className="flex items-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-lg flex items-center justify-center">
                              <Home className="h-8 w-8 text-white" />
                            </div>
                            <div className="ml-4">
                              <h3 className="font-semibold text-gray-900">{booking.propertyTitle || `Property #${booking.propertyId}`}</h3>
                              <p className="text-sm text-gray-600">
                                {booking.checkIn} - {booking.checkOut}
                              </p>
                              <p className="text-sm text-gray-600">{booking.guests} guests</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                            <p className="text-lg font-semibold text-gray-900 mt-1">₹{booking.total.toLocaleString('en-IN')}</p>
                            <p className="text-xs text-gray-500 mt-1">Click to view details</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === 'wishlist' && (
            <Card>
              <CardHeader>
                <CardTitle>Your Wishlist ({wishlistProperties.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {propertiesLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="property-card animate-pulse">
                        <div className="w-full h-48 bg-gray-300"></div>
                        <div className="p-6 space-y-3">
                          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : wishlistProperties.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-500 mb-4">Save properties you love to keep track of them!</p>
                    <Link href="/" className="btn-rental">Browse Properties</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistProperties.map((property) => (
                      <PropertyCard key={property.id} property={property} showBookButton />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={user?.firstName ? `${user.firstName} ${user.lastName}` : ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <input
                      type="text"
                      value={user?.role || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'settings' && (
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-500" defaultChecked />
                        <span className="ml-2 text-gray-700">Email notifications for booking updates</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-500" defaultChecked />
                        <span className="ml-2 text-gray-700">SMS notifications for important updates</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                        <span className="ml-2 text-gray-700">Marketing emails and promotions</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-500" defaultChecked />
                        <span className="ml-2 text-gray-700">Allow property owners to contact me</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-500" defaultChecked />
                        <span className="ml-2 text-gray-700">Show my profile to other users</span>
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      <BookingDetailsModal
        isOpen={showBookingDetails}
        onClose={handleCloseBookingDetails}
        booking={selectedBooking}
      />
    </div>
  );
}
