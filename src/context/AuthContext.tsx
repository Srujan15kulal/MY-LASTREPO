import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useEffect } from 'react';
import { auth } from '../lib/supabase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  signUp: (email: string, password: string, userData: { full_name: string; role: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const initializeAuth = async () => {
      try {
        const currentUser = await auth.getCurrentUser();
        if (currentUser) {
          const userProfile = await auth.getUserProfile();
          if (userProfile) {
            setUser({
              id: userProfile.id,
              role: userProfile.role as any,
              name: userProfile.full_name
            });
            setProfile(userProfile);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);
  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    setProfile(null);
  };

  const signUp = async (email: string, password: string, userData: { full_name: string; role: string }) => {
    try {
      await auth.signUp(email, password, userData);
      // User will need to verify email before they can sign in
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { user: authUser } = await auth.signIn(email, password);
      if (authUser) {
        const userProfile = await auth.getUserProfile();
        if (userProfile) {
          setUser({
            id: userProfile.id,
            role: userProfile.role as any,
            name: userProfile.full_name
          });
          setProfile(userProfile);
        }
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const isAuthenticated = !!user;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      login, 
      logout, 
      isAuthenticated, 
      loading, 
      signUp, 
      signIn 
    }}>
      {children}
    </AuthContext.Provider>
  );
};