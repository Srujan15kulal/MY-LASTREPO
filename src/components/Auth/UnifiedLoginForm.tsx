import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../Common/Button';
import { FormField } from '../Common/FormField';
import { Card } from '../Common/Card';
import { Toast, useToast } from '../Common/Toast';
import { Building2 } from 'lucide-react';

export const UnifiedLoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    role: ''
  });
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  const roleOptions = [
    'Doctor',
    'Patient', 
    'Receptionist',
    'Pharmacist',
    'Lab Technician'
  ];

  const roleConfig = {
    'Doctor': {
      dashboardPath: '/doctor/dashboard',
      role: 'doctor'
    },
    'Patient': {
      dashboardPath: '/patient/dashboard',
      role: 'patient'
    },
    'Receptionist': {
      dashboardPath: '/hospital/dashboard',
      role: 'receptionist'
    },
    'Pharmacist': {
      dashboardPath: '/pharmacy/dashboard',
      role: 'pharmacist'
    },
    'Lab Technician': {
      dashboardPath: '/lab/dashboard',
      role: 'labtech'
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey || 
        supabaseUrl === 'your_supabase_project_url' || 
        supabaseAnonKey === 'your_supabase_anon_key') {
      showToast('Please configure Supabase environment variables in your .env file', 'error');
      return;
    }
    
    if (!credentials.email || !credentials.password || !credentials.role) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    
    if (isSignUp && !fullName) {
      showToast('Please enter your full name', 'error');
      return;
    }

    setLoading(true);
    
    try {
      const config = roleConfig[credentials.role as keyof typeof roleConfig];
      
      if (isSignUp) {
        await signUp(credentials.email, credentials.password, {
          full_name: fullName,
          role: config.role
        });
        showToast('Account created successfully! Please check your email to verify your account.', 'success');
        setIsSignUp(false);
      } else {
        await signIn(credentials.email, credentials.password);
        navigate(config.dashboardPath);
      }
    } catch (error: any) {
      let errorMessage = 'Authentication failed';
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and click the verification link before signing in.';
      } else if (error.message?.includes('environment variables')) {
        errorMessage = 'Application not configured. Please contact support.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 border border-black flex items-center justify-center mx-auto mb-4">
            <Building2 size={32} className="text-black" />
          </div>
          <h1 className="text-2xl font-medium text-black mb-2">Hospital Management System</h1>
          <p className="text-gray-600">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <FormField
              label="Full Name"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          )}

          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={credentials.email}
            onChange={handleChange}
            required
          />

          <FormField
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={credentials.password}
            onChange={handleChange}
            required
          />

          <FormField
            label="Select Role"
            name="role"
            type="select"
            value={credentials.role}
            onChange={handleChange}
            options={roleOptions}
            required
          />

          <Button type="submit" fullWidth className="mt-6" loading={loading}>
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Button>
          
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-gray-600 hover:text-black transition-colors"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"
              }
            </button>
          </div>
        </form>
        
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />
      </Card>
    </div>
  );
};