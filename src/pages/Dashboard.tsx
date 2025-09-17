import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Users, 
  MessageSquare,
  Heart,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { PropertyCard } from '@/components/property/PropertyCard';

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
  is_approved: boolean;
  views_count: number;
  created_at: string;
}

interface Inquiry {
  id: string;
  property_id: string;
  buyer_id: string;
  message: string;
  contact_email: string;
  contact_phone: string;
  status: string;
  created_at: string;
  response_message: string;
  properties: {
    title: string;
    price: number;
  };
  profiles: {
    full_name: string;
    email: string;
  };
}

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

// Mock data
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
    is_approved: true,
    views_count: 45,
    created_at: '2025-01-15T10:00:00Z'
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
    is_approved: true,
    views_count: 32,
    created_at: '2025-01-10T10:00:00Z'
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
    status: 'pending',
    image_urls: ['/placeholder.svg'],
    is_featured: true,
    is_approved: false,
    views_count: 67,
    created_at: '2025-01-20T10:00:00Z'
  }
];

const mockInquiries: Inquiry[] = [
  {
    id: '1',
    property_id: '1',
    buyer_id: 'buyer-1',
    message: 'I am very interested in this apartment. Is it still available?',
    contact_email: 'buyer@example.com',
    contact_phone: '+1234567890',
    status: 'pending',
    created_at: '2025-01-22T10:00:00Z',
    response_message: '',
    properties: {
      title: 'Modern Downtown Apartment',
      price: 250000
    },
    profiles: {
      full_name: 'John Buyer',
      email: 'buyer@example.com'
    }
  },
  {
    id: '2',
    property_id: '2',
    buyer_id: 'buyer-2',
    message: 'Could I schedule a viewing for this property?',
    contact_email: 'jane@example.com',
    contact_phone: '+1234567891',
    status: 'responded',
    created_at: '2025-01-21T10:00:00Z',
    response_message: 'Yes, we can schedule a viewing for next Tuesday at 2 PM.',
    properties: {
      title: 'Spacious Family House',
      price: 450000
    },
    profiles: {
      full_name: 'Jane Smith',
      email: 'jane@example.com'
    }
  }
];

const mockUsers: User[] = [
  {
    id: '1',
    email: 'seller@example.com',
    full_name: 'Alice Seller',
    role: 'seller',
    is_active: true,
    created_at: '2025-01-01T10:00:00Z'
  },
  {
    id: '2',
    email: 'buyer@example.com',
    full_name: 'Bob Buyer',
    role: 'buyer',
    is_active: true,
    created_at: '2025-01-02T10:00:00Z'
  },
  {
    id: '3',
    email: 'agent@example.com',
    full_name: 'Charlie Agent',
    role: 'agent',
    is_active: true,
    created_at: '2025-01-03T10:00:00Z'
  }
];

export default function Dashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [wishlistProperties, setWishlistProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('properties');

  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const fetchUserProperties = async () => {
    if (!user) return;

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock user properties - filter based on role
      const userProperties = mockProperties.filter(p =>
        userProfile?.role === 'agent' ? p.owner_id === user.id : p.owner_id === user.id
      );

      setProperties(userProperties);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load properties.",
      });
    }
  };

  const fetchInquiries = async () => {
    if (!user) return;

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock inquiries - filter based on role
      let filteredInquiries = mockInquiries;

      if (userProfile?.role === 'buyer') {
        filteredInquiries = mockInquiries.filter(i => i.buyer_id === user.id);
      } else {
        filteredInquiries = mockInquiries.filter(i => i.properties.title.includes('Modern') || i.properties.title.includes('Spacious'));
      }

      setInquiries(filteredInquiries);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load inquiries.",
      });
    }
  };

  const fetchAllUsers = async () => {
    if (!user || userProfile?.role !== 'admin') return;

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      setUsers(mockUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchWishlistProperties = async () => {
    if (!user || userProfile?.role !== 'buyer') return;

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock wishlist properties - load from localStorage or use sample data
      const storedWishlist = localStorage.getItem('mock_wishlist_properties');
      if (storedWishlist) {
        setWishlistProperties(JSON.parse(storedWishlist));
      } else {
        // Use some sample properties for demo
        setWishlistProperties(mockProperties.slice(0, 2));
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load wishlist.",
      });
    }
  };

  const fetchAllProperties = async () => {
    if (!user || userProfile?.role !== 'admin') return;

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      setProperties(mockProperties);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load properties.",
      });
    }
  };

  useEffect(() => {
    if (user && userProfile) {
      setLoading(true);
      
      if (userProfile.role === 'buyer') {
        fetchInquiries();
        fetchWishlistProperties();
        setActiveTab('inquiries');
      } else if (userProfile.role === 'admin') {
        fetchAllProperties();
        fetchAllUsers();
        fetchInquiries();
        setActiveTab('all-properties');
      } else {
        fetchUserProperties();
        fetchInquiries();
        setActiveTab('properties');
      }
      
      setLoading(false);
    }
  }, [user, userProfile]);

  const handleApproveProperty = async (propertyId: string, approve: boolean) => {
    try {
      // Mock approval - update local state
      setProperties(prev =>
        prev.map(p =>
          p.id === propertyId
            ? { ...p, is_approved: approve }
            : p
        )
      );

      toast({
        title: approve ? "Property Approved" : "Property Rejected",
        description: `Property has been ${approve ? 'approved' : 'rejected'}.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      // Mock deletion - remove from local state
      setProperties(prev => prev.filter(p => p.id !== propertyId));

      toast({
        title: "Property Deleted",
        description: "Property has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleRespondToInquiry = async (inquiryId: string, response: string) => {
    try {
      // Mock response - update local state
      setInquiries(prev =>
        prev.map(i =>
          i.id === inquiryId
            ? { ...i, status: 'responded', response_message: response }
            : i
        )
      );

      toast({
        title: "Response Sent",
        description: "Your response has been sent successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  if (!user) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'sold':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getInquiryStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'responded':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            {userProfile?.role === 'admin' 
              ? 'Manage the entire platform' 
              : userProfile?.role === 'buyer'
              ? 'Manage your inquiries and wishlist'
              : 'Manage your property listings and inquiries'
            }
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            {(userProfile?.role === 'seller' || userProfile?.role === 'agent') && (
              <TabsTrigger value="properties">My Properties</TabsTrigger>
            )}
            {userProfile?.role === 'admin' && (
              <>
                <TabsTrigger value="all-properties">All Properties</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
              </>
            )}
            <TabsTrigger value="inquiries">
              {userProfile?.role === 'buyer' ? 'My Inquiries' : 'Inquiries'}
            </TabsTrigger>
            {userProfile?.role === 'buyer' && (
              <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            )}
          </TabsList>

          {/* My Properties (Sellers/Agents) */}
          {(userProfile?.role === 'seller' || userProfile?.role === 'agent') && (
            <TabsContent value="properties" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">My Properties</h2>
                <Button onClick={() => navigate('/list-property')}>
                  <Plus className="h-4 w-4 mr-2" />
                  List New Property
                </Button>
              </div>

              {loading ? (
                <div>Loading...</div>
              ) : properties.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Properties Listed</h3>
                    <p className="text-muted-foreground mb-4">
                      Start by listing your first property to attract potential buyers.
                    </p>
                    <Button onClick={() => navigate('/list-property')}>
                      <Plus className="h-4 w-4 mr-2" />
                      List Your First Property
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <div key={property.id} className="relative">
                      <PropertyCard property={property} />
                      <div className="absolute top-2 right-2 flex space-x-1">
                        {!property.is_approved && (
                          <Badge variant="outline" className="bg-warning text-warning-foreground">
                            Pending Review
                          </Badge>
                        )}
                      </div>
                      <div className="mt-2 flex justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteProperty(property.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          )}

          {/* All Properties (Admin) */}
          {userProfile?.role === 'admin' && (
            <TabsContent value="all-properties" className="space-y-6">
              <h2 className="text-xl font-semibold">All Properties</h2>
              
              {loading ? (
                <div>Loading...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <div key={property.id} className="relative">
                      <PropertyCard property={property} />
                      <div className="absolute top-2 right-2">
                        {property.is_approved ? (
                          <Badge className="bg-success text-success-foreground">
                            Approved
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-warning text-warning-foreground">
                            Pending
                          </Badge>
                        )}
                      </div>
                      <div className="mt-2 flex justify-end space-x-2">
                        {!property.is_approved && (
                          <Button 
                            size="sm"
                            onClick={() => handleApproveProperty(property.id, true)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteProperty(property.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          )}

          {/* Users (Admin) */}
          {userProfile?.role === 'admin' && (
            <TabsContent value="users" className="space-y-6">
              <h2 className="text-xl font-semibold">Users</h2>
              
              <div className="grid gap-4">
                {users.map((user) => (
                  <Card key={user.id}>
                    <CardContent className="flex justify-between items-center p-4">
                      <div>
                        <h3 className="font-semibold">{user.full_name || 'No name'}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="capitalize">
                            {user.role}
                          </Badge>
                          <Badge variant={user.is_active ? "default" : "secondary"}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Joined {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )}

          {/* Inquiries */}
          <TabsContent value="inquiries" className="space-y-6">
            <h2 className="text-xl font-semibold">
              {userProfile?.role === 'buyer' ? 'My Inquiries' : 'Property Inquiries'}
            </h2>
            
            {inquiries.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Inquiries</h3>
                  <p className="text-muted-foreground">
                    {userProfile?.role === 'buyer' 
                      ? 'You haven\'t made any inquiries yet.'
                      : 'No inquiries received for your properties.'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inquiry) => (
                  <Card key={inquiry.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold">{inquiry.properties.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {userProfile?.role === 'buyer' 
                              ? `Price: ৳${inquiry.properties.price.toLocaleString()}`
                              : `From: ${inquiry.profiles.full_name} (${inquiry.profiles.email})`
                            }
                          </p>
                        </div>
                        <Badge className={getInquiryStatusColor(inquiry.status)}>
                          {inquiry.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm">Message:</h4>
                          <p className="text-sm">{inquiry.message}</p>
                        </div>
                        
                        {inquiry.contact_email && (
                          <div>
                            <h4 className="font-medium text-sm">Contact:</h4>
                            <p className="text-sm">{inquiry.contact_email}</p>
                            {inquiry.contact_phone && (
                              <p className="text-sm">{inquiry.contact_phone}</p>
                            )}
                          </div>
                        )}
                        
                        {inquiry.response_message && (
                          <div>
                            <h4 className="font-medium text-sm">Response:</h4>
                            <p className="text-sm">{inquiry.response_message}</p>
                          </div>
                        )}
                        
                        {userProfile?.role !== 'buyer' && inquiry.status === 'pending' && (
                          <div className="flex space-x-2 pt-2">
                            <Button 
                              size="sm"
                              onClick={() => {
                                const response = prompt('Enter your response:');
                                if (response) {
                                  handleRespondToInquiry(inquiry.id, response);
                                }
                              }}
                            >
                              Respond
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-xs text-muted-foreground mt-4">
                        {new Date(inquiry.created_at).toLocaleDateString()} at{' '}
                        {new Date(inquiry.created_at).toLocaleTimeString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Wishlist (Buyers) */}
          {userProfile?.role === 'buyer' && (
            <TabsContent value="wishlist" className="space-y-6">
              <h2 className="text-xl font-semibold">My Wishlist</h2>
              
              {wishlistProperties.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Saved Properties</h3>
                    <p className="text-muted-foreground mb-4">
                      Save properties to your wishlist to easily find them later.
                    </p>
                    <Button onClick={() => navigate('/properties')}>
                      Browse Properties
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistProperties.map((property) => (
                    <PropertyCard 
                      key={property.id} 
                      property={property}
                      isInWishlist={true}
                      onWishlistToggle={fetchWishlistProperties}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}