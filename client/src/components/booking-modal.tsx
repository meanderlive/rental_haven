import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Property } from "@shared/schema";

const bookingSchema = z.object({
  checkIn: z.date({ required_error: "Check-in date is required" }),
  checkOut: z.date({ required_error: "Check-out date is required" }),
  guests: z.number().min(1, "At least 1 guest is required"),
  totalAmount: z.number(),
});

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
}

export default function BookingModal({ isOpen, onClose, property }: BookingModalProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      checkIn: undefined,
      checkOut: undefined,
      guests: 1,
      totalAmount: 0,
    },
  });

  const checkInDate = form.watch("checkIn");
  const checkOutDate = form.watch("checkOut");
  const guests = form.watch("guests");

  // Calculate total amount
  const calculateTotal = () => {
    if (checkInDate && checkOutDate) {
      const days = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      const total = days * property.pricePerNight;
      form.setValue("totalAmount", total);
      return total;
    }
    return 0;
  };

  const bookingMutation = useMutation({
    mutationFn: async (data: z.infer<typeof bookingSchema>) => {
      if (!isAuthenticated || !user) {
        throw new Error("Please login to book a property");
      }

      const response = await apiRequest("POST", "/api/bookings", {
        ...data,
        propertyId: property.id,
        userId: user.id,
      });
      return response.json();
    },
    onSuccess: (data, variables) => {
      // Save to localStorage for immediate display
      const bookingData = {
        id: Date.now(), // temporary ID
        propertyId: property.id,
        propertyTitle: property.title,
        checkIn: format(variables.checkIn, 'yyyy-MM-dd'),
        checkOut: format(variables.checkOut, 'yyyy-MM-dd'),
        guests: variables.guests,
        total: variables.totalAmount,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      const existingBookings = JSON.parse(localStorage.getItem('myBookings') || '[]');
      existingBookings.push(bookingData);
      localStorage.setItem('myBookings', JSON.stringify(existingBookings));
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('bookingUpdated'));

      toast({
        title: "Booking Successful",
        description: "Your booking has been confirmed!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      onClose();
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to create booking",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: z.infer<typeof bookingSchema>) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to book a property",
        variant: "destructive",
      });
      return;
    }

    bookingMutation.mutate(data);
  };

  const totalAmount = calculateTotal();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Book {property.title}</DialogTitle>
          <DialogDescription>
            ${property.pricePerNight} per night
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="checkIn"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Check-in</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="checkOut"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Check-out</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date() || (checkInDate && date <= checkInDate)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="guests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guests</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={property.maxGuests}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {totalAmount > 0 && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Amount:</span>
                  <span className="text-xl font-bold text-red-600">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
                {checkInDate && checkOutDate && (
                  <div className="text-sm text-gray-600 mt-1">
                    {Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))} nights × ${property.pricePerNight}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={bookingMutation.isPending || !totalAmount}
              >
                {bookingMutation.isPending ? "Booking..." : `Book for $${totalAmount.toFixed(2)}`}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}