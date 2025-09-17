import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { User, Building, Heart, FileText, Settings } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  price: number;
  city: string;
  state: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  status: string;
  is_approved: boolean;
  views_count: number;
  created_at: string;
}

interface Inquiry {
  id: string;
  message: string;
  status: string;
  created_at: string;
  response_message?: string;
  responded_at?: string;
  properties: {
    title: string;
    price: number;
  };
  profiles: {
    full_name: string;
    email: string;
  };
}

// Mock data for profile page
const mockUserProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Downtown Apartment',
    price: 250000,
    city: 'Dhaka',
    state: 'Dhaka',
    property_type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    status: 'available',
    is_approved: true,
    views_count: 45,
    created_at: '2025-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Spacious Family House',
    price: 450000,
    city: 'Dhaka',
    state: 'Dhaka',
    property_type: 'house',
    bedrooms: 4,
    bathrooms: 3,
    status: 'pending',
    is_approved: false,
    views_count: 32,
    created_at: '2025-01-10T10:00:00Z'
  }
];

const mockWishlistProperties: Property[] = [
  {
    id: '3',
    title: 'Luxury Condo with View',
    price: 380000,
    city: 'Dhaka',
    state: 'Dhaka',
    property_type: 'condo',
    bedrooms: 3,
    bathrooms: 2,
    status: 'available',
    is_approved: true,
    views_count: 67,
    created_at: '2025-01-20T10:00:00Z'
  }
];

const mockInquiries: Inquiry[] = [
  {
    id: '1',
    message: 'I am very interested in this apartment. Is it still available?',
    status: 'pending',
    created_at: '2025-01-22T10:00:00Z',
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
    message: 'Could I schedule a viewing for this property?',
    status: 'responded',
    created_at: '2025-01-21T10:00:00Z',
    response_message: 'Yes, we can schedule a viewing for next Tuesday at 2 PM.',
    responded_at: '2025-01-21T14:00:00Z',
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

export default function Profile() {
  const { user, userProfile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [properties, setProperties] = useState<Property[]>(mockUserProperties);
  const [wishlist, setWishlist] = useState<Property[]>(mockWishlistProperties);
  const [inquiries, setInquiries] = useState<Inquiry[]>(mockInquiries);
  const [loading, setLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    full_name: '',
    phone: '',
    bio: '',
    avatar_url: '',
    role: 'buyer' as 'buyer' | 'seller' | 'agent' | 'admin'
  });

  useEffect(() => {
    if (userProfile) {
      setProfileData({
        full_name: userProfile.full_name || '',
        phone: userProfile.phone || '',
        bio: userProfile.bio || '',
        avatar_url: userProfile.avatar_url || '',
        role: userProfile.role || 'buyer'
      });
    }
  }, [userProfile]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user, userProfile]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Mock data loading with delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Set mock data based on user role
      if (userProfile?.role === 'seller' || userProfile?.role === 'agent') {
        setProperties(mockUserProperties);
        setInquiries(mockInquiries);
      } else {
        setInquiries(mockInquiries);
      }

      setWishlist(mockWishlistProperties);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Mock profile update - save to localStorage
      await new Promise(resolve => setTimeout(resolve, 1000));

      localStorage.setItem('mock_user_profile', JSON.stringify(profileData));

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });

      setIsEditing(false);
      refreshProfile();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
    setLoading(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price).replace('BDT', '৳');
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'agent': return 'bg-blue-500';
      case 'seller': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (!user || !userProfile) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profileData.avatar_url} />
                <AvatarFallback className="text-lg">
                  {getInitials(profileData.full_name || 'User')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">
                    {profileData.full_name || 'User'}
                  </h1>
                  <Badge className={`${getRoleBadgeColor(profileData.role)} text-white`}>
                    {profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground mb-2">{user.email}</p>
                {profileData.phone && (
                  <p className="text-muted-foreground mb-2">{profileData.phone}</p>
                )}
                {profileData.bio && (
                  <p className="text-sm">{profileData.bio}</p>
                )}
              </div>
              
              <Button 
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "outline" : "default"}
                className="gap-2"
              >
                <Settings className="h-4 w-4" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        {isEditing && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="avatar_url">Avatar URL</Label>
                <Input
                  id="avatar_url"
                  value={profileData.avatar_url}
                  onChange={(e) => setProfileData({...profileData, avatar_url: e.target.value})}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={profileData.role}
                  onValueChange={(value: 'buyer' | 'seller' | 'agent' | 'admin') =>
                    setProfileData({...profileData, role: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buyer">Buyer</SelectItem>
                    <SelectItem value="seller">Seller</SelectItem>
                    <SelectItem value="agent">Agent</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSaveProfile} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Role-based Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className={`grid w-full ${userProfile?.role === 'buyer' ? 'grid-cols-3' : 'grid-cols-4'}`}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {(userProfile?.role === 'seller' || userProfile?.role === 'agent') && (
              <TabsTrigger value="properties">Properties</TabsTrigger>
            )}
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            <TabsTrigger value="inquiries">
              {userProfile?.role === 'buyer' ? 'My Inquiries' : 'Inquiries Received'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(userProfile?.role === 'seller' || userProfile?.role === 'agent') && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Properties Listed</CardTitle>
                    <Building className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{properties.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {properties.filter(p => p.is_approved).length} approved
                    </p>
                  </CardContent>
                </Card>
              )}
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Wishlist Items</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{wishlist.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Saved properties
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {userProfile?.role === 'buyer' ? 'Inquiries Sent' : 'Inquiries Received'}
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{inquiries.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {inquiries.filter(i => i.status === 'pending').length} pending
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Properties Tab - Only for Sellers/Agents */}
          {(userProfile?.role === 'seller' || userProfile?.role === 'agent') && (
            <TabsContent value="properties" className="space-y-4">
              {properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <Card key={property.id}>
                      <CardContent className="pt-6">
                        <h3 className="font-semibold mb-2">{property.title}</h3>
                        <p className="text-2xl font-bold text-primary mb-2">
                          {formatPrice(property.price)}
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          {property.city}, {property.state}
                        </p>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>{property.bedrooms} bed • {property.bathrooms} bath</span>
                          <Badge variant={property.is_approved ? "default" : "secondary"}>
                            {property.is_approved ? "Approved" : "Pending"}
                          </Badge>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          Views: {property.views_count}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No properties listed yet</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          )}

          <TabsContent value="wishlist" className="space-y-4">
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((property) => (
                  <Card key={property.id}>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">{property.title}</h3>
                      <p className="text-2xl font-bold text-primary mb-2">
                        {formatPrice(property.price)}
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        {property.city}, {property.state}
                      </p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{property.bedrooms} bed • {property.bathrooms} bath</span>
                        <span>{property.property_type}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No properties in wishlist yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Inquiries Tab - Different content based on role */}
          <TabsContent value="inquiries" className="space-y-4">
            {inquiries.length > 0 ? (
              <div className="space-y-4">
                {inquiries.map((inquiry) => (
                  <Card key={inquiry.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold">{inquiry.properties?.title}</h3>
                          <p className="text-lg font-bold text-primary mb-1">
                            {formatPrice(inquiry.properties?.price || 0)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {userProfile?.role === 'buyer' 
                              ? `To: ${inquiry.profiles?.full_name} (${inquiry.profiles?.email})`
                              : `From: ${inquiry.profiles?.full_name} (${inquiry.profiles?.email})`
                            }
                          </p>
                        </div>
                        <Badge variant={inquiry.status === 'pending' ? "secondary" : "default"}>
                          {inquiry.status}
                        </Badge>
                      </div>
                      <p className="text-sm mb-4">{inquiry.message}</p>
                      {inquiry.response_message && (
                        <div className="bg-muted p-3 rounded-md mb-4">
                          <p className="text-sm font-medium mb-1">Response:</p>
                          <p className="text-sm">{inquiry.response_message}</p>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(inquiry.created_at).toLocaleDateString()}
                        {inquiry.responded_at && (
                          <span> • Responded: {new Date(inquiry.responded_at).toLocaleDateString()}</span>
                        )}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {userProfile?.role === 'buyer' 
                      ? 'No inquiries sent yet' 
                      : 'No inquiries received yet'
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}