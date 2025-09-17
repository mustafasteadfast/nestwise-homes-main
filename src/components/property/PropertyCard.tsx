import React from 'react';
import { Heart, MapPin, Bed, Bath, Square, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    price: number;
    property_type: string;
    size_sqft?: number;
    bedrooms?: number;
    bathrooms?: number;
    address: string;
    city: string;
    state: string;
    status: string;
    image_urls?: string[];
    is_featured?: boolean;
    views_count?: number;
  };
  isInWishlist?: boolean;
  onWishlistToggle?: () => void;
  onClick?: () => void;
}

export function PropertyCard({ 
  property, 
  isInWishlist = false, 
  onWishlistToggle,
  onClick 
}: PropertyCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price).replace('BDT', '৳');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'sold':
        return 'bg-destructive text-destructive-foreground';
      case 'rented':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to save properties to your wishlist.",
      });
      return;
    }

    try {
      // Mock wishlist toggle - use localStorage
      const wishlistKey = 'mock_wishlist';
      let wishlist = JSON.parse(localStorage.getItem(wishlistKey) || '[]');

      if (isInWishlist) {
        wishlist = wishlist.filter((id: string) => id !== property.id);
        toast({
          title: "Removed from wishlist",
          description: "Property removed from your wishlist.",
        });
      } else {
        wishlist.push(property.id);
        toast({
          title: "Added to wishlist",
          description: "Property saved to your wishlist.",
        });
      }

      localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
      onWishlistToggle?.();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Something went wrong.",
      });
    }
  };

  const primaryImage = property.image_urls?.[0] || '/placeholder.svg';

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={primaryImage}
          alt={property.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        <div className="absolute top-3 left-3 flex gap-2">
          {property.is_featured && (
            <Badge variant="premium" className="text-xs font-semibold">
              Featured
            </Badge>
          )}
          <Badge className={`text-xs font-semibold capitalize ${getStatusColor(property.status)}`}>
            {property.status}
          </Badge>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm transition-colors ${
            isInWishlist ? 'text-destructive hover:text-destructive' : 'text-muted-foreground hover:text-destructive'
          }`}
          onClick={handleWishlistToggle}
        >
          <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
        </Button>

        {property.views_count && property.views_count > 0 && (
          <div className="absolute bottom-3 right-3 flex items-center space-x-1 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1">
            <Eye className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{property.views_count}</span>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {property.title}
            </h3>
            <p className="text-2xl font-bold text-primary">
              {formatPrice(property.price)}
            </p>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="line-clamp-1">{property.address}, {property.city}, {property.state}</span>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              {property.bedrooms && (
                <div className="flex items-center space-x-1">
                  <Bed className="h-4 w-4" />
                  <span>{property.bedrooms}</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center space-x-1">
                  <Bath className="h-4 w-4" />
                  <span>{property.bathrooms}</span>
                </div>
              )}
              {property.size_sqft && (
                <div className="flex items-center space-x-1">
                  <Square className="h-4 w-4" />
                  <span>{property.size_sqft.toLocaleString()} sqft</span>
                </div>
              )}
            </div>
            <Badge variant="outline" className="text-xs capitalize">
              {property.property_type}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}