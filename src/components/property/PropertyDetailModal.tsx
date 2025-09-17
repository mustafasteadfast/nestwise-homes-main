import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Eye, 
  Heart,
  Phone,
  Mail,
  Send,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Property {
  id: string;
  title: string;
  description: string;
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
  amenities?: string[];
  owner_id: string;
  agent_id?: string;
}

interface PropertyDetailModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  isInWishlist?: boolean;
  onWishlistToggle?: () => void;
}

export function PropertyDetailModal({ 
  property, 
  isOpen, 
  onClose,
  isInWishlist = false,
  onWishlistToggle
}: PropertyDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [inquiryForm, setInquiryForm] = useState({
    message: '',
    contactEmail: '',
    contactPhone: ''
  });
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  if (!property) return null;

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

  const handleWishlistToggle = async () => {
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

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to send inquiries.",
      });
      return;
    }

    if (!inquiryForm.message.trim()) {
      toast({
        variant: "destructive",
        title: "Message required",
        description: "Please enter a message.",
      });
      return;
    }

    setIsSubmittingInquiry(true);

    try {
      // Mock inquiry submission - simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Store inquiry in localStorage for demo purposes
      const inquiryKey = 'mock_inquiries';
      const existingInquiries = JSON.parse(localStorage.getItem(inquiryKey) || '[]');

      const newInquiry = {
        id: `mock-inquiry-${Date.now()}`,
        property_id: property.id,
        buyer_id: user.id,
        seller_id: property.agent_id || property.owner_id,
        message: inquiryForm.message,
        contact_email: inquiryForm.contactEmail,
        contact_phone: inquiryForm.contactPhone,
        status: 'pending',
        created_at: new Date().toISOString(),
        response_message: '',
        property_title: property.title,
        property_price: property.price
      };

      existingInquiries.push(newInquiry);
      localStorage.setItem(inquiryKey, JSON.stringify(existingInquiries));

      toast({
        title: "Inquiry Sent",
        description: "Your inquiry has been sent to the property owner.",
      });

      setInquiryForm({
        message: '',
        contactEmail: '',
        contactPhone: ''
      });
      setShowInquiryForm(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send inquiry.",
      });
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

  const nextImage = () => {
    if (property.image_urls && property.image_urls.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === property.image_urls!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property.image_urls && property.image_urls.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.image_urls!.length - 1 : prev - 1
      );
    }
  };

  const images = property.image_urls?.length ? property.image_urls : ['/placeholder.svg'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{property.title}</DialogTitle>
          <DialogDescription>
            {property.address}, {property.city}, {property.state}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Gallery */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={images[currentImageIndex]}
                alt={property.title}
                className="w-full h-64 md:h-96 object-cover"
              />
              
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

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

            {images.length > 1 && (
              <div className="flex justify-center mt-2 space-x-1">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImageIndex ? 'bg-primary' : 'bg-muted'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Property Details */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-3xl font-bold text-primary">
                      {formatPrice(property.price)}
                    </p>
                    <div className="flex items-center text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{property.address}, {property.city}, {property.state}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {property.property_type}
                  </Badge>
                </div>

                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  {property.bedrooms && (
                    <div className="flex items-center space-x-1">
                      <Bed className="h-4 w-4" />
                      <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center space-x-1">
                      <Bath className="h-4 w-4" />
                      <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {property.size_sqft && (
                    <div className="flex items-center space-x-1">
                      <Square className="h-4 w-4" />
                      <span>{property.size_sqft.toLocaleString()} sqft</span>
                    </div>
                  )}
                </div>
              </div>

              {property.description && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {property.description}
                  </p>
                </div>
              )}

              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact & Inquiry */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-4">Interested in this property?</h3>
                  
                  {!showInquiryForm ? (
                    <div className="space-y-2">
                      <Button 
                        className="w-full"
                        onClick={() => setShowInquiryForm(true)}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Inquiry
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Now
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitInquiry} className="space-y-4">
                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          placeholder="I'm interested in this property..."
                          value={inquiryForm.message}
                          onChange={(e) => setInquiryForm(prev => ({ ...prev, message: e.target.value }))}
                          required
                          className="min-h-20"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="contact-email">Your Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="contact-email"
                            type="email"
                            placeholder="your@email.com"
                            className="pl-10"
                            value={inquiryForm.contactEmail}
                            onChange={(e) => setInquiryForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="contact-phone">Your Phone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="contact-phone"
                            type="tel"
                            placeholder="(555) 123-4567"
                            className="pl-10"
                            value={inquiryForm.contactPhone}
                            onChange={(e) => setInquiryForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                          />
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setShowInquiryForm(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={isSubmittingInquiry}
                          className="flex-1"
                        >
                          {isSubmittingInquiry ? 'Sending...' : 'Send'}
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}