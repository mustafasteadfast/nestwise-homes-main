import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Home as HomeIcon, TrendingUp, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PropertyCard } from '@/components/property/PropertyCard';
import { useAuth } from '@/contexts/AuthContext';
import heroImage from '@/assets/hero-real-estate.jpg';

interface Property {
  id: string;
  title: string;
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
  amenities?: string[];
}

// Mock featured properties
const mockFeaturedProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Downtown Apartment',
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
    title: 'Luxury Condo with View',
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
  },
  {
    id: '3',
    title: 'Spacious Family House',
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
    is_featured: true,
    views_count: 32,
    owner_id: 'owner-2',
    amenities: ['Garden', 'Garage', 'Fireplace']
  }
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>(mockFeaturedProperties);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    if (!user) return;

    // Mock wishlist - load from localStorage
    const storedWishlist = localStorage.getItem('mock_wishlist');
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  };

  const handleWishlistToggle = () => {
    fetchWishlist();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to properties page with search term
    window.location.href = `/properties?search=${encodeURIComponent(searchTerm)}`;
  };

  const features = [
    {
      icon: Search,
      title: 'Smart Property Search',
      description: 'Find your perfect property with our advanced search and filtering system.'
    },
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'All transactions are secured and verified for your peace of mind.'
    },
    {
      icon: Users,
      title: 'Expert Agents',
      description: 'Connect with verified real estate professionals in your area.'
    },
    {
      icon: TrendingUp,
      title: 'Market Insights',
      description: 'Get access to real-time market data and property value trends.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Find Your Dream Home
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Discover the perfect property with NestWise Homes - your trusted real estate platform
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-2xl">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search by location, property type, or features..."
                  className="pl-12 h-12 border-0 text-foreground placeholder:text-muted-foreground"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit" variant="hero" size="lg" className="h-12 px-8">
                Search Properties
              </Button>
            </div>
          </form>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/properties">
              <Button variant="outline" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                Browse All Properties
              </Button>
            </Link>
            {!user && (
              <Link to="/auth">
                <Button variant="premium" size="lg">
                  Get Started Today
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Choose NestWise Homes?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We provide a comprehensive platform that makes buying, selling, and renting properties simple and secure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      {featuredProperties.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Featured Properties
              </h2>
              <p className="text-xl text-muted-foreground">
                Discover our handpicked selection of premium properties
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isInWishlist={wishlist.includes(property.id)}
                  onWishlistToggle={handleWishlistToggle}
                />
              ))}
            </div>

            <div className="text-center">
              <Link to="/properties">
                <Button variant="outline" size="lg">
                  View All Properties
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-hover">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-primary-foreground mb-6">
            Ready to Find Your Next Home?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Join thousands of satisfied customers who found their perfect property through our platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/properties">
              <Button variant="outline" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                Start Searching
              </Button>
            </Link>
            {!user && (
              <Link to="/auth">
                <Button variant="premium" size="lg">
                  Create Account
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-muted-foreground">Properties Listed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Expert Agents</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Customer Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}