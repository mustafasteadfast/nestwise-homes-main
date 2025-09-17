import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import { SearchWithSuggestions } from '@/components/SearchWithSuggestions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PropertyCard } from '@/components/property/PropertyCard';
import { PropertyDetailModal } from '@/components/property/PropertyDetailModal';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  property_type: string;
  size_sqft: number;
  bedrooms: number;
  bathrooms: number;
  address: string;
  city: string;
  state: string;
  status: string;
  image_urls: string[];
  is_featured: boolean;
  views_count: number;
  owner_id: string;
  agent_id?: string;
  amenities?: string[];
}

// Mock property data
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Downtown Apartment',
    description: 'Beautiful modern apartment in the heart of downtown with stunning city views.',
    price: 250000,
    property_type: 'apartment',
    size_sqft: 1200,
    bedrooms: 2,
    bathrooms: 2,
    address: '123 Main St',
    city: 'Dhaka',
    state: 'Dhaka',
    status: 'available',
    image_urls: ['/placeholder.svg'],
    is_featured: true,
    views_count: 45,
    owner_id: 'owner-1',
    amenities: ['Pool', 'Gym', 'Parking']
  },
  {
    id: '2',
    title: 'Spacious Family House',
    description: 'Perfect family home with large backyard and modern amenities.',
    price: 450000,
    property_type: 'house',
    size_sqft: 2500,
    bedrooms: 4,
    bathrooms: 3,
    address: '456 Oak Ave',
    city: 'Dhaka',
    state: 'Dhaka',
    status: 'available',
    image_urls: ['/placeholder.svg'],
    is_featured: false,
    views_count: 32,
    owner_id: 'owner-2',
    amenities: ['Garden', 'Garage', 'Fireplace']
  },
  {
    id: '3',
    title: 'Luxury Condo with View',
    description: 'High-end condo with panoramic city views and premium finishes.',
    price: 380000,
    property_type: 'condo',
    size_sqft: 1800,
    bedrooms: 3,
    bathrooms: 2,
    address: '789 Sky Tower',
    city: 'Dhaka',
    state: 'Dhaka',
    status: 'available',
    image_urls: ['/placeholder.svg'],
    is_featured: true,
    views_count: 67,
    owner_id: 'owner-3',
    amenities: ['Concierge', 'Rooftop', 'Security']
  }
];

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    propertyType: 'any',
    city: '',
    bedrooms: 'any',
    bathrooms: 'any'
  });

  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProperties = async () => {
    try {
      setLoading(true);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      let filteredProperties = [...mockProperties];

      // Apply filters
      if (filters.minPrice) {
        filteredProperties = filteredProperties.filter(p => p.price >= parseFloat(filters.minPrice));
      }
      if (filters.maxPrice) {
        filteredProperties = filteredProperties.filter(p => p.price <= parseFloat(filters.maxPrice));
      }
      if (filters.propertyType && filters.propertyType !== 'any') {
        filteredProperties = filteredProperties.filter(p => p.property_type === filters.propertyType);
      }
      if (filters.city) {
        filteredProperties = filteredProperties.filter(p =>
          p.city.toLowerCase().includes(filters.city.toLowerCase())
        );
      }
      if (filters.bedrooms && filters.bedrooms !== 'any') {
        filteredProperties = filteredProperties.filter(p => p.bedrooms === parseInt(filters.bedrooms));
      }
      if (filters.bathrooms && filters.bathrooms !== 'any') {
        filteredProperties = filteredProperties.filter(p => p.bathrooms === parseFloat(filters.bathrooms));
      }

      // Apply search
      if (searchTerm) {
        filteredProperties = filteredProperties.filter(p =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.address.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setProperties(filteredProperties);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load properties. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    if (!user) return;

    // Mock wishlist - load from localStorage
    const storedWishlist = localStorage.getItem('mock_wishlist');
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filters, searchTerm]);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const handleWishlistToggle = () => {
    fetchWishlist(); // Refresh wishlist after toggle
  };

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setShowPropertyModal(true);

    // Mock view count increment
    const updatedProperty = {
      ...property,
      views_count: (property.views_count || 0) + 1
    };

    // Update the property in the list
    setProperties(prev =>
      prev.map(p => p.id === property.id ? updatedProperty : p)
    );
  };

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      propertyType: 'any',
      city: '',
      bedrooms: 'any',
      bathrooms: 'any'
    });
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Find Your Perfect Property</h1>
          <p className="text-muted-foreground">
            Discover amazing properties that match your needs and budget.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Search & Filter Properties</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Bar */}
            <SearchWithSuggestions
              onSearch={setSearchTerm}
              onSelectProperty={(property) => {
                // Convert the suggestion property to match our Property interface
                const fullProperty: Property = {
                  ...property,
                  description: '',
                  size_sqft: 0,
                  address: '',
                  status: 'available',
                  image_urls: [],
                  is_featured: false,
                  views_count: 0,
                  owner_id: '',
                  agent_id: '',
                  amenities: [],
                  bedrooms: 0,
                  bathrooms: 0
                };
                setSelectedProperty(fullProperty);
                setShowPropertyModal(true);
              }}
              placeholder="Search by title, location, or description..."
              className="h-12"
            />

            {/* Filters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">
                  Min Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground">৳</span>
                  <Input
                    type="number"
                    placeholder="Min"
                    className="pl-10"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">
                  Max Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground">৳</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    className="pl-10"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">
                  Property Type
                </label>
                <Select value={filters.propertyType} onValueChange={(value) => setFilters({ ...filters, propertyType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any type</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">
                  City
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="City"
                    className="pl-10"
                    value={filters.city}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">
                  Bedrooms
                </label>
                <Select value={filters.bedrooms} onValueChange={(value) => setFilters({ ...filters, bedrooms: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">
                  Bathrooms
                </label>
                <Select value={filters.bathrooms} onValueChange={(value) => setFilters({ ...filters, bathrooms: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="1.5">1.5</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="2.5">2.5</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="3.5">3.5</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {loading ? 'Loading...' : `${properties.length} properties found`}
          </p>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-48 mb-4"></div>
                <div className="space-y-2">
                  <div className="bg-muted rounded h-4 w-3/4"></div>
                  <div className="bg-muted rounded h-4 w-1/2"></div>
                  <div className="bg-muted rounded h-4 w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg mb-4">No properties found</div>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search criteria or clearing the filters.
            </p>
            <Button onClick={clearFilters}>Clear All Filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isInWishlist={wishlist.includes(property.id)}
                onWishlistToggle={handleWishlistToggle}
                onClick={() => handlePropertyClick(property)}
              />
            ))}
          </div>
        )}
        
        <PropertyDetailModal
          property={selectedProperty}
          isOpen={showPropertyModal}
          onClose={() => setShowPropertyModal(false)}
          isInWishlist={selectedProperty ? wishlist.includes(selectedProperty.id) : false}
          onWishlistToggle={handleWishlistToggle}
        />
      </div>
    </div>
  );
}