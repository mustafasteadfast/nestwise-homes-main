import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  user_metadata?: any;
}

interface Session {
  user: User;
  access_token: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  userProfile: any;
  refreshProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { toast } = useToast();

  const fetchUserProfile = async (userId: string) => {
    // Get role from localStorage or determine from email
    let role = 'buyer';
    const storedProfile = localStorage.getItem('mock_user_profile');

    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile);
      role = parsedProfile.role || 'buyer';
    } else {
      // Determine role based on email for demo purposes
      const storedUser = localStorage.getItem('mock_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.email.includes('seller')) role = 'seller';
        else if (user.email.includes('agent')) role = 'agent';
        else if (user.email.includes('admin')) role = 'admin';
        else if (user.email.includes('buyer')) role = 'buyer';
      }
    }

    // Mock user profile data
    const mockProfile = {
      id: userId,
      email: 'demo@example.com',
      full_name: 'Demo User',
      role: role,
      bio: 'Demo user profile for frontend presentation',
      phone: '+1234567890',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setUserProfile(mockProfile);
  };

  const refreshProfile = () => {
    if (user?.id) {
      fetchUserProfile(user.id);
    }
  };

  useEffect(() => {
    // Mock auth state - check for stored session
    const storedSession = localStorage.getItem('mock_session');
    const storedUser = localStorage.getItem('mock_user');

    if (storedSession && storedUser) {
      const session = JSON.parse(storedSession);
      const user = JSON.parse(storedUser);
      setSession(session);
      setUser(user);
      fetchUserProfile(user.id);
    }

    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Mock sign in - accept any email/password combination
    if (email && password) {
      const mockUser: User = {
        id: 'mock-user-id',
        email: email,
        user_metadata: { full_name: 'Demo User' }
      };

      const mockSession: Session = {
        user: mockUser,
        access_token: 'mock-token'
      };

      setUser(mockUser);
      setSession(mockSession);

      // Store in localStorage for persistence
      localStorage.setItem('mock_user', JSON.stringify(mockUser));
      localStorage.setItem('mock_session', JSON.stringify(mockSession));

      fetchUserProfile(mockUser.id);

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      return { error: null };
    } else {
      toast({
        variant: "destructive",
        title: "Sign In Error",
        description: "Please enter valid credentials.",
      });

      return { error: { message: "Please enter valid credentials." } };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    // Mock sign up - accept any email/password combination
    if (email && password) {
      const mockUser: User = {
        id: 'mock-user-id',
        email: email,
        user_metadata: { ...userData }
      };

      const mockSession: Session = {
        user: mockUser,
        access_token: 'mock-token'
      };

      setUser(mockUser);
      setSession(mockSession);

      // Store in localStorage for persistence
      localStorage.setItem('mock_user', JSON.stringify(mockUser));
      localStorage.setItem('mock_session', JSON.stringify(mockSession));

      fetchUserProfile(mockUser.id);

      toast({
        title: "Account created!",
        description: "Welcome to NestWise Homes!",
      });

      return { error: null };
    } else {
      toast({
        variant: "destructive",
        title: "Sign Up Error",
        description: "Please enter valid information.",
      });

      return { error: { message: "Please enter valid information." } };
    }
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    setUserProfile(null);

    // Clear localStorage
    localStorage.removeItem('mock_user');
    localStorage.removeItem('mock_session');

    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    userProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}