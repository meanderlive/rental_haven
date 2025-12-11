import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navbar from "@/components/navbar";
import SearchBar from "@/components/search-bar";
import PropertyCard from "@/components/property-card";
import { Property } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { getQueryFn } from "@/lib/queryClient";

type SearchFilters = {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
};

type SortOption = 'rating' | 'price-low' | 'price-high' | 'newest';

export default function Home() {
  const { user } = useAuth();
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [sortBy, setSortBy] = useState<SortOption>('rating');

  const { data: properties = [], isLoading, error } = useQuery<Property[]>({
    queryKey: ["/api/properties", JSON.stringify(searchFilters)],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Sort and filter properties
  const sortedAndFilteredProperties = useMemo(() => {
    let filtered = [...properties];

    // Apply search filters
    if (searchFilters.location) {
      filtered = filtered.filter(property => 
        property.city.toLowerCase().includes(searchFilters.location!.toLowerCase()) ||
        property.state.toLowerCase().includes(searchFilters.location!.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.pricePerNight || 0) - (b.pricePerNight || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.pricePerNight || 0) - (a.pricePerNight || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        // Assuming newer properties have higher IDs
        filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [properties, searchFilters, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Welcome Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.firstName ? `${user.firstName} ${user.lastName}` : "Guest"}!
              </h1>
              <p className="text-gray-600 mt-1">Discover amazing properties for your next stay</p>
            </div>
            <Link href="/dashboard" className="btn-rental">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
      <SearchBar onSearch={setSearchFilters} />
      {/* Properties Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Available Properties</h2>
            <div className="flex items-center space-x-4">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="rating">Sort by Rating</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedAndFilteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} showBookButton />
              ))}
            </div>
          )}
          {!isLoading && sortedAndFilteredProperties.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl text-gray-300 mb-4">🏠</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No properties found</h3>
              <p className="text-gray-500">Try adjusting your search filters or check back later.</p>
            </div>
          )}
          {error && (
            <div className="text-center py-12">
              <div className="text-6xl text-red-300 mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-red-600 mb-2">Failed to load properties</h3>
              <p className="text-red-500">{error.message || "Please try again later."}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
