import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Star, Wifi, Car, Coffee, Users, Bed, Bath, MapPin, CreditCard, Lock, CheckCircle } from "lucide-react";
import Navbar from "@/components/navbar";
import BookingModal from "@/components/booking-modal";
import { Property } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import AuthModal from "@/components/auth-modal";

export default function PropertyDetails() {
  const { id } = useParams();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [location] = useLocation();
  // Booking state (move up)
  const [checkIn, setCheckIn] = useState<string>("");
  const [checkOut, setCheckOut] = useState<string>("");
  const [guests, setGuests] = useState<number>(1);
  
  // Payment modal state - MUST be before any early returns
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [paymentError, setPaymentError] = useState("");
  
  // Auth state - MUST be before any early returns
  const { user, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Try to get property from navigation state
  const stateProperty = (location && (location as any).state && (location as any).state.property) || null;

  const { data: fetchedProperty, isLoading } = useQuery<Property>({
    queryKey: ["/api/properties", id],
    enabled: !!id && !stateProperty,
  });

  const property = stateProperty || fetchedProperty;

  if (isLoading && !property) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-300 rounded-xl mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-20 bg-gray-300 rounded"></div>
              </div>
              <div className="h-64 bg-gray-300 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Property not found</h1>
            <p className="text-gray-600 mt-2">The property you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const amenityIcons = {
    wifi: Wifi,
    parking: Car,
    coffee: Coffee,
  };

  // Helper to get all image URLs
  const getImageUrls = () => {
    if (Array.isArray(property.images)) {
      return property.images.length > 0 ? property.images : ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"];
    }
    if (typeof property.images === "string") {
      const parts = (property.images as string).split(',').map((s: string) => s.trim()).filter((s: string) => !!s);
      return parts.length > 0 ? parts : ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"];
    }
    return ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"];
  };
  const imageUrls: string[] = getImageUrls();
  const currency = (property as any).currency || 'INR';
  const price = typeof property.pricePerNight === 'number' ? (property.pricePerNight as number).toLocaleString('en-IN') : property.pricePerNight;
  const reviewCount = typeof property.reviewCount === 'number' && property.reviewCount > 0 ? property.reviewCount : 0;

  // Helper to get a safe description
  const getDescription = () => {
    if (property.description && typeof property.description === 'string') {
      return property.description;
    }
    return 'No description available for this property.';
  };
  // Helper to get a safe price
  const getPrice = () => {
    if (typeof property.pricePerNight === 'number') {
      return `₹${property.pricePerNight.toLocaleString('en-IN')}`;
    }
    if (typeof property.pricePerNight === 'string' && property.pricePerNight.trim() !== '') {
      return `₹${property.pricePerNight}`;
    }
    return 'Price not available';
  };
  // Helper to get a safe monthly price
  const getMonthlyPrice = () => {
    if (typeof property.price === 'number') {
      return `₹${property.price.toLocaleString('en-IN')}`;
    }
    if (typeof property.price === 'string' && property.price.trim() !== '') {
      return `₹${property.price}`;
    }
    return 'Monthly price not available';
  };
  // Helper to get a safe address
  const getAddress = () => {
    const parts = [property.location, property.city, property.state, property.country].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Address not available';
  };

  // Calculate nights
  let nights = 1;
  if (checkIn && checkOut) {
    try {
      nights = Math.max(1, differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn)));
    } catch {}
  }

  // Calculate total and service fee
  const nightly = typeof property.pricePerNight === 'number' ? property.pricePerNight : parseFloat(property.pricePerNight || '0');
  const subtotal = nightly * nights * guests;
  const serviceFee = subtotal * 0.1;
  const total = subtotal + serviceFee;



  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError("");
    // Simple validation
    if (cardNumber.length < 16 || expiry.length < 4 || cvv.length < 3) {
      setPaymentError("Please enter valid card details.");
      return;
    }
    setTimeout(() => {
      setPaymentSuccess(true);
      // Save booking to localStorage (demo)
      const booking = {
        propertyId: property.id,
        propertyTitle: property.title,
        checkIn,
        checkOut,
        guests,
        total,
        date: new Date().toISOString(),
      };
      const bookings = JSON.parse(localStorage.getItem("myBookings") || "[]");
      bookings.push(booking);
      localStorage.setItem("myBookings", JSON.stringify(bookings));
      setTimeout(() => {
        setShowPaymentModal(false);
        setPaymentSuccess(false);
        setCardNumber("");
        setExpiry("");
        setCvv("");
      }, 2000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Gallery */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="aspect-video rounded-xl overflow-hidden">
              <img
                src={imageUrls[0]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {imageUrls.slice(1, 5).map((img: string, index: number) => (
                <div key={index} className="aspect-video rounded-xl overflow-hidden">
                  <img
                    src={img}
                    alt={`${property.title} ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
                  <div className="flex items-center mt-2 text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{getAddress()}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-semibold">{property.rating ?? 'N/A'}</span>
                  <span className="ml-1 text-gray-600">({property.reviewCount ?? 0} reviews)</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center space-x-6 text-gray-600 mb-2">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-1" />
                  <span>{property.maxGuests ?? 1} guests</span>
                </div>
                <div className="flex items-center">
                  <Bed className="h-5 w-5 mr-1" />
                  <span>{property.bedrooms ?? 1} bedrooms</span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-5 w-5 mr-1" />
                  <span>{property.bathrooms ?? 1} bathrooms</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-lg text-red-500 ml-2">{getPrice()}</span>
                  <span className="text-gray-500 ml-1">/night</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-md text-green-600 ml-2">{getMonthlyPrice()}</span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">About this place</h2>
              <p className="text-gray-600 leading-relaxed">{getDescription()}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">What this place offers</h2>
              <div className="grid grid-cols-2 gap-4">
                {property.amenities && property.amenities.length > 0 ? (
                  property.amenities.map((amenity: string, index: number) => {
                    const IconComponent = amenityIcons[amenity.toLowerCase() as keyof typeof amenityIcons] || Coffee;
                    return (
                      <div key={index} className="flex items-center">
                        <IconComponent className="h-5 w-5 mr-3 text-gray-600" />
                        <span className="text-gray-700 capitalize">{amenity}</span>
                      </div>
                    );
                  })
                ) : (
                  <span className="text-gray-500">No amenities listed.</span>
                )}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div>
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-3xl font-bold text-gray-900">{getPrice()}</span>
                    <span className="text-gray-600 ml-1">/night</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm">{property.rating ?? 'N/A'}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                        value={checkIn}
                        onChange={e => setCheckIn(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                        value={checkOut}
                        onChange={e => setCheckOut(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                      value={guests}
                      onChange={e => setGuests(Number(e.target.value))}
                    >
                      {[1,2,3,4,5,6,7,8].map(n => (
                        <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <Button 
                  onClick={() => {
                    if (!isAuthenticated) {
                      setShowAuthModal(true);
                    } else {
                      setShowPaymentModal(true);
                    }
                  }}
                  className="w-full btn-rental"
                >
                  Reserve
                </Button>

                <p className="text-center text-sm text-gray-600 mt-4">You won't be charged yet</p>

                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">₹{nightly.toLocaleString('en-IN')} x {nights} night{nights > 1 ? 's' : ''} x {guests} guest{guests > 1 ? 's' : ''}</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Service fee</span>
                    <span>₹{serviceFee.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t font-semibold">
                    <span>Total</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <div className="flex items-center mb-6">
            <Star className="h-6 w-6 text-yellow-400 fill-current mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">{property.rating} · {property.reviewCount} reviews</h2>
          </div>

          {reviewCount === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No reviews yet. Be the first to leave a review!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(Math.max(0, Math.min(6, reviewCount)))].map((_, index: number) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">U{index + 1}</span>
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">Guest {index + 1}</p>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, starIndex) => (
                            <Star 
                              key={starIndex}
                              className={`h-4 w-4 ${starIndex < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Great place to stay! Very clean and comfortable with excellent amenities. 
                      The location is perfect and the host was very responsive.
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        property={property}
      />
      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Secure Payment</DialogTitle>
            <DialogDescription>
              <span className="flex items-center gap-2 text-green-700 font-semibold">
                <Lock className="h-4 w-4" />
                Your payment is encrypted and secure
              </span>
            </DialogDescription>
          </DialogHeader>
          {paymentSuccess ? (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <div className="text-xl font-bold text-green-700 mb-2">Payment Successful!</div>
              <div className="text-gray-600 mb-2">Your reservation is confirmed.</div>
            </div>
          ) : (
            <>
              <div className="mb-4 bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Service Fee:</span>
                  <span>₹{serviceFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <form className="space-y-4" onSubmit={handlePayment}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg tracking-widest pr-10"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value.replace(/[^0-9 ]/g, ''))}
                    />
                    <CreditCard className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={expiry}
                      onChange={e => setExpiry(e.target.value.replace(/[^0-9/]/g, ''))}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
                      placeholder="123"
                      maxLength={4}
                      value={cvv}
                      onChange={e => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                    />
                  </div>
                </div>
                {paymentError && <div className="text-red-600 text-sm text-center">{paymentError}</div>}
                <Button type="submit" className="w-full btn-rental text-lg py-3">
                  Pay ₹{total.toLocaleString('en-IN')}
                </Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
      {/* Auth Modal for login/signup */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} mode="login" onToggleMode={() => {}} />
    </div>
  );
}
