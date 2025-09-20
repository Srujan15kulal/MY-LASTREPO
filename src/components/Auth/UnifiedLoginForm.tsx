import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../Common/Button';
import { FormField } from '../Common/FormField';
import { Card } from '../Common/Card';
import { Building2 } from 'lucide-react';

export const UnifiedLoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    role: ''
  });
  const { login } = useAuth();
  const navigate = useNavigate();

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
      userData: { id: 'D-501', role: 'doctor' as const, name: 'Dr. Ramesh' }
    },
    'Patient': {
      dashboardPath: '/patient/dashboard',
      userData: { id: 'P-1001', role: 'patient' as const, name: 'Ravi Kumar' }
    },
    'Receptionist': {
      dashboardPath: '/hospital/dashboard',
      userData: { id: 'H-001', role: 'hospital' as const, name: 'Reception Staff' }
    },
    'Pharmacist': {
      dashboardPath: '/pharmacy/dashboard',
      userData: { id: 'PH-001', role: 'pharmacist' as const, name: 'Pharmacy Staff' }
    },
    'Lab Technician': {
      dashboardPath: '/lab/dashboard',
      userData: { id: 'LAB-001', role: 'lab_technician' as const, name: 'Lab Technician' }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.role) {
      alert('Please select a role');
      return;
    }
    
    const config = roleConfig[credentials.role as keyof typeof roleConfig];
    login(config.userData);
    navigate(config.dashboardPath);
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
          <p className="text-gray-600">Select your role and login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Username"
            name="username"
            type="text"
            placeholder="Enter your username"
            value={credentials.username}
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

          <Button type="submit" fullWidth className="mt-6">
            Login
          </Button>
        </form>
      </Card>
    </div>
  );
};