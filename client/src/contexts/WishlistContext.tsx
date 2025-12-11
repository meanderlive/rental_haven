import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';

interface WishlistContextType {
  wishlist: number[];
  addToWishlist: (propertyId: number) => void;
  removeFromWishlist: (propertyId: number) => void;
  toggleWishlist: (propertyId: number) => void;
  isInWishlist: (propertyId: number) => boolean;
  isLoaded: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    if (user?.email) {
      const savedWishlist = localStorage.getItem(`wishlist_${user.email}`);
      if (savedWishlist) {
        try {
          const parsedWishlist = JSON.parse(savedWishlist);
          setWishlist(parsedWishlist);
        } catch (error) {
          console.error('WishlistContext: Error parsing wishlist from localStorage:', error);
          setWishlist([]);
        }
      } else {
        setWishlist([]);
      }
      setIsLoaded(true);
    }
  }, [user?.email]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (user?.email && isLoaded) {
      localStorage.setItem(`wishlist_${user.email}`, JSON.stringify(wishlist));
    }
  }, [wishlist, user?.email, isLoaded]);

  const addToWishlist = useCallback((propertyId: number) => {
    if (!wishlist.includes(propertyId)) {
      setWishlist(prev => [...prev, propertyId]);
    }
  }, [wishlist]);

  const removeFromWishlist = useCallback((propertyId: number) => {
    setWishlist(prev => prev.filter(id => id !== propertyId));
  }, [wishlist]);

  const toggleWishlist = useCallback((propertyId: number) => {
    if (wishlist.includes(propertyId)) {
      removeFromWishlist(propertyId);
    } else {
      addToWishlist(propertyId);
    }
  }, [wishlist, addToWishlist, removeFromWishlist]);

  const isInWishlist = useCallback((propertyId: number) => {
    return wishlist.includes(propertyId);
  }, [wishlist]);

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    isLoaded,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}