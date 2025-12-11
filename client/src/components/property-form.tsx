import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Upload, Images, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const propertySchema = z.object({
  title: z.string().min(1, "Property title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: z.enum(["apartment", "house", "villa", "condo"], {
    required_error: "Please select a property type",
  }),
  location: z.string().min(1, "Location is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  pricePerNight: z.number().min(1, "Price must be at least $1"),
  bedrooms: z.number().min(1, "At least 1 bedroom is required"),
  bathrooms: z.number().min(1, "At least 1 bathroom is required"),
  maxGuests: z.number().min(1, "At least 1 guest capacity is required"),
  amenities: z.array(z.string()).optional(),
});

interface PropertyFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const AMENITY_OPTIONS = [
  "Wifi",
  "Parking",
  "Kitchen",
  "Washer",
  "Dryer",
  "Air conditioning",
  "Heating",
  "TV",
  "Pool",
  "Gym",
  "Pet friendly",
  "Smoking allowed",
];

export default function PropertyForm({ isOpen, onClose }: PropertyFormProps) {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      description: "",
      type: "apartment" as const,
      location: "",
      city: "",
      state: "",
      country: "United States",
      pricePerNight: 0,
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      amenities: [],
    },
  });

  const propertyMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest("POST", "/api/properties", formData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Property added!",
        description: "Your property has been submitted for approval.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/owner/properties"] });
      handleClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add property",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length < 5) {
      toast({
        title: "Minimum 5 images required",
        description: "Please upload at least 5 property photos.",
        variant: "destructive",
      });
      return;
    }

    if (files.length > 10) {
      toast({
        title: "Too many images",
        description: "Please upload no more than 10 images.",
        variant: "destructive",
      });
      return;
    }

    // Check file sizes
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast({
        title: "Files too large",
        description: "Each image must be smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedImages(files);
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setSelectedAmenities(prev => [...prev, amenity]);
    } else {
      setSelectedAmenities(prev => prev.filter(a => a !== amenity));
    }
  };

  const handleClose = () => {
    form.reset();
    setSelectedImages([]);
    setSelectedAmenities([]);
    onClose();
  };

  const handleSubmit = async (data: z.infer<typeof propertySchema>) => {
    if (selectedImages.length < 5) {
      toast({
        title: "Images required",
        description: "Please upload at least 5 property photos.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    
    // Append form data
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'amenities') {
        formData.append(key, value.toString());
      }
    });

    // Append amenities as JSON string
    formData.append('amenities', JSON.stringify(selectedAmenities));

    // Append images
    selectedImages.forEach(image => {
      formData.append('images', image);
    });

    propertyMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Add New Property
            </DialogTitle>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Property Title</Label>
              <Input
                id="title"
                placeholder="Beautiful downtown apartment"
                {...form.register("title")}
                className="focus:ring-red-500 focus:border-red-500"
              />
              {form.formState.errors.title && (
                <p className="text-red-600 text-sm mt-1">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="type">Property Type</Label>
              <Select 
                value={form.watch("type")} 
                onValueChange={(value) => form.setValue("type", value as "apartment" | "house" | "villa" | "condo")}
              >
                <SelectTrigger className="focus:ring-red-500 focus:border-red-500">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.type && (
                <p className="text-red-600 text-sm mt-1">
                  {form.formState.errors.type.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your property..."
              rows={3}
              {...form.register("description")}
              className="focus:ring-red-500 focus:border-red-500"
            />
            {form.formState.errors.description && (
              <p className="text-red-600 text-sm mt-1">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Street Address</Label>
              <div className="relative">
                <Input
                  id="location"
                  placeholder="123 Main Street"
                  {...form.register("location")}
                  className="focus:ring-red-500 focus:border-red-500 pl-8"
                />
                <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {form.formState.errors.location && (
                <p className="text-red-600 text-sm mt-1">
                  {form.formState.errors.location.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="New York"
                {...form.register("city")}
                className="focus:ring-red-500 focus:border-red-500"
              />
              {form.formState.errors.city && (
                <p className="text-red-600 text-sm mt-1">
                  {form.formState.errors.city.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                placeholder="NY"
                {...form.register("state")}
                className="focus:ring-red-500 focus:border-red-500"
              />
              {form.formState.errors.state && (
                <p className="text-red-600 text-sm mt-1">
                  {form.formState.errors.state.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                {...form.register("country")}
                className="focus:ring-red-500 focus:border-red-500"
              />
              {form.formState.errors.country && (
                <p className="text-red-600 text-sm mt-1">
                  {form.formState.errors.country.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="pricePerNight">Price per Night ($)</Label>
              <Input
                id="pricePerNight"
                type="number"
                min="1"
                placeholder="150"
                {...form.register("pricePerNight", { valueAsNumber: true })}
                className="focus:ring-red-500 focus:border-red-500"
              />
              {form.formState.errors.pricePerNight && (
                <p className="text-red-600 text-sm mt-1">
                  {form.formState.errors.pricePerNight.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Select 
                value={form.watch("bedrooms").toString()} 
                onValueChange={(value) => form.setValue("bedrooms", parseInt(value))}
              >
                <SelectTrigger className="focus:ring-red-500 focus:border-red-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Select 
                value={form.watch("bathrooms").toString()} 
                onValueChange={(value) => form.setValue("bathrooms", parseInt(value))}
              >
                <SelectTrigger className="focus:ring-red-500 focus:border-red-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="maxGuests">Max Guests</Label>
              <Select 
                value={form.watch("maxGuests").toString()} 
                onValueChange={(value) => form.setValue("maxGuests", parseInt(value))}
              >
                <SelectTrigger className="focus:ring-red-500 focus:border-red-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Amenities</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {AMENITY_OPTIONS.map((amenity) => (
                <label key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedAmenities.includes(amenity)}
                    onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                    className="text-red-500 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="images">Property Images (minimum 5)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition duration-200">
              <input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="images"
                className="cursor-pointer flex flex-col items-center"
              >
                <Images className="h-12 w-12 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  {selectedImages.length > 0 
                    ? `${selectedImages.length} image${selectedImages.length > 1 ? 's' : ''} selected`
                    : "Upload property photos (minimum 5 images)"
                  }
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Drag and drop or click to browse
                </p>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="btn-rental"
              disabled={propertyMutation.isPending}
            >
              {propertyMutation.isPending ? "Adding..." : "Add Property"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
