import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Star, Heart } from "lucide-react";
import type { Property } from "@shared/schema";
import { Button } from "@/components/ui/button";
import BookingModal from "./booking-modal";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";

interface PropertyCardProps {
  property: Property;
  showBookButton?: boolean;
}

export default function PropertyCard({ property, showBookButton = false }: PropertyCardProps) {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [, navigate] = useLocation();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (property.id) {
      const wasInWishlist = isInWishlist(property.id);
      toggleWishlist(property.id);
      
      toast({
        title: wasInWishlist ? "Removed from wishlist" : "Added to wishlist",
        description: wasInWishlist 
          ? `${property.title} has been removed from your wishlist`
          : `${property.title} has been added to your wishlist`,
      });
    }
  };

  // Helper to get the first image URL
  const getImageUrl = () => {
    if (Array.isArray(property.images)) {
      return property.images[0] || "/images/default.jpg";
    }
    if (typeof property.images === "string") {
      const parts = (property.images as string).split(',');
      return parts[0] || "/images/default.jpg";
    }
    return "/images/default.jpg";
  };

  return (
    <>
      <div className="property-card">
        <div className="relative">
          <img
            src={getImageUrl()}
            alt={property.title}
            className="w-full h-48 object-cover"
          />
          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
          >
            <Heart
              className={`h-4 w-4 ${property.id && isInWishlist(property.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`}
            />
          </button>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <Link href={`/property/${property.id}`}>
              <h3 className="text-lg font-semibold text-gray-900 hover:text-red-600 transition-colors">
                {property.title}
              </h3>
            </Link>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm text-gray-600">{property.rating}</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">{property.city}, {property.state}</p>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-2xl font-bold text-red-500">
                ₹{typeof property.pricePerNight === 'number' ? (property.pricePerNight as number).toLocaleString("en-IN") : (typeof property.pricePerNight === 'string' ? property.pricePerNight : '')}
              </span>
              <span className="text-sm text-gray-500"> /night</span>
            </div>
            {showBookButton ? (
              <Button
                onClick={() => setShowBookingModal(true)}
                className="btn-rental"
                size="sm"
              >
                Book Now
              </Button>
            ) : (
              <Button
                className="btn-rental"
                size="sm"
                onClick={() => navigate(`/property/${property.id}`, { state: { property } })}
              >
                View Details
              </Button>
            )}
          </div>
        </div>
      </div>
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        property={property}
      />
    </>
  );
}