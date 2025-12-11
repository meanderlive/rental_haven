import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SearchBarProps {
  onSearch?: (filters: any) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const handleSearch = () => {
    const filters = {
      location: location || undefined,
      checkIn: checkIn ? new Date(checkIn) : undefined,
      checkOut: checkOut ? new Date(checkOut) : undefined,
      guests: guests > 1 ? guests : undefined,
    };
    onSearch?.(filters);
  };

  return (
    <div className="search-card max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Label className="block text-sm font-medium text-gray-700 mb-1">Location</Label>
          <Input 
            type="text" 
            placeholder="Where are you going?" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="focus:ring-red-500 focus:border-red-500"
          />
        </div>
        <div className="relative">
          <Label className="block text-sm font-medium text-gray-700 mb-1">Check-in</Label>
          <Input 
            type="date" 
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="focus:ring-red-500 focus:border-red-500"
          />
        </div>
        <div className="relative">
          <Label className="block text-sm font-medium text-gray-700 mb-1">Check-out</Label>
          <Input 
            type="date" 
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="focus:ring-red-500 focus:border-red-500"
          />
        </div>
        <div className="flex items-end">
          <Button onClick={handleSearch} className="w-full btn-rental">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
