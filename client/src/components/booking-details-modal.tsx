import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, CreditCard, Clock, X } from "lucide-react";

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
}

export default function BookingDetailsModal({ isOpen, onClose, booking }: BookingDetailsModalProps) {
  if (!booking) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b bg-white sticky top-0 z-10 shadow-sm">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <span>Booking Details</span>
              <Badge className={getStatusColor(booking.status)}>
                {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
              </Badge>
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="relative">
          <div className="overflow-y-auto max-h-[calc(90vh-120px)] px-6 pb-6 scrollbar-hide">
            <div className="space-y-6 pt-4">
          {/* Property Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-red-500" />
              Property Information
            </h3>
            <div className="space-y-2">
              <p className="font-medium">{booking.propertyTitle || `Property #${booking.propertyId}`}</p>
              <p className="text-sm text-gray-600">Property ID: {booking.propertyId}</p>
            </div>
          </div>

          {/* Booking Dates */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-red-500" />
              Booking Dates
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Check-in</p>
                <p className="font-medium">{formatDate(booking.checkIn)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Check-out</p>
                <p className="font-medium">{formatDate(booking.checkOut)}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Duration: {calculateNights(booking.checkIn, booking.checkOut)} nights
              </p>
            </div>
          </div>

          {/* Guest Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <Users className="h-5 w-5 mr-2 text-red-500" />
              Guest Information
            </h3>
            <p className="text-sm text-gray-600">Number of guests</p>
            <p className="font-medium">{booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</p>
          </div>

          {/* Payment Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-red-500" />
              Payment Information
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold text-lg text-red-600">
                  ₹{booking.total?.toLocaleString('en-IN') || '0'}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Payment Status:</span>
                <Badge className="bg-green-100 text-green-800">Paid</Badge>
              </div>
            </div>
          </div>

          {/* Booking Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-red-500" />
              Booking Information
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Booking ID:</span>
                <span className="font-mono text-sm">#{booking.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Booking Date:</span>
                <span>{booking.createdAt ? formatDate(booking.createdAt) : 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            {booking.status === 'confirmed' && (
              <Button variant="destructive" className="flex-1">
                Cancel Booking
              </Button>
            )}
          </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}