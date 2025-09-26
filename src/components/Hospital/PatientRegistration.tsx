import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/supabase';
import { Header } from '../Layout/Header';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { FormField } from '../Common/FormField';
import { Toast, useToast } from '../Common/Toast';

export const PatientRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patient_name: '',
    age: '',
    gender: 'Male',
    phone_number: '',
    dob: '',
    problem_description: ''
  });
  const [selectedDoctor, setSelectedDoctor] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) {
      showToast('Authentication required', 'error');
      return;
    }

    setLoading(true);
    
    try {
      const patient = await db.createPatient({
        display_name: formData.patient_name,
        phone: formData.phone_number,
        dob: formData.dob,
        gender: formData.gender
      });

      // Create appointment if doctor is selected
      if (selectedDoctor && formData.problem_description) {
        // In a real implementation, you'd need to get the doctor's profile ID
        // For now, we'll just show success
      }
      
      showToast(`Patient registered successfully! Patient ID: ${patient.id}`, 'success');
      
      // Reset form
      setFormData({
        patient_name: '',
        age: '',
        gender: 'Male',
        phone_number: '',
        dob: '',
        problem_description: ''
      });
      setSelectedDoctor('');
      
    } catch (error: any) {
      showToast(error.message || 'Failed to register patient', 'error');
    } finally {
      setLoading(false);
    }
  };

  const doctorOptions = [
    'Dr. Anita Sharma - Dermatologist',
    'Dr. Rajesh Kumar - Neurologist',
    'Dr. Priya Patel - Cardiologist',
    'Dr. Amit Singh - General Physician'
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header title="Patient Registration" showBackButton />
      
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <h2 className="text-lg font-semibold text-black mb-6">Register New Patient</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Patient Name"
                name="patient_name"
                type="text"
                placeholder="Enter patient name"
                value={formData.patient_name}
                onChange={handleInputChange}
                required
              />
              
              <FormField
                label="Age"
                name="age"
                type="number"
                placeholder="Enter age"
                value={formData.age}
                onChange={handleInputChange}
                required
              />
              
              <FormField
                label="Gender"
                name="gender"
                type="select"
                value={formData.gender}
                onChange={handleInputChange}
                options={['Male', 'Female', 'Other']}
                required
              />
              
              <FormField
                label="Phone Number"
                name="phone_number"
                type="tel"
                placeholder="+91 98XXXXXXXX"
                value={formData.phone_number}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <FormField
              label="Date of Birth"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleInputChange}
              required
            />
            
            <FormField
              label="Patient Problem"
              name="problem_description"
              type="textarea"
              placeholder="Briefly describe symptoms"
              value={formData.problem_description}
              onChange={handleInputChange}
            />
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign Doctor (Optional)
              </label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Doctor</option>
                {doctorOptions.map((doctor) => (
                  <option key={doctor} value={doctor}>
                    {doctor}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-4">
              <Button type="submit" className="flex-1" loading={loading}>
                Register Patient
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/hospital/dashboard')}
                disabled={loading}
              >
                Cancel
              </Button>
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
    </div>
  );
};