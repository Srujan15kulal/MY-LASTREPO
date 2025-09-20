import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Layout/Header';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { FormField } from '../Common/FormField';

export const PatientRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patient_name: 'Ravi Kumar',
    age: '28',
    gender: 'Male',
    phone_number: '+91 9876543210',
    aadhar_number: '1234-5678-9012',
    problem_description: 'Severe headache and dizziness for 3 days'
  });
  const [selectedDoctor, setSelectedDoctor] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate registration process
    const patientId = `P-${Math.floor(Math.random() * 9000) + 1000}`;
    
    // Show success message and redirect
    alert(`Patient registered successfully!\nPatient ID: ${patientId}\nAssigned Doctor: ${selectedDoctor}`);
    navigate('/hospital/dashboard');
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
                placeholder="e.g. Ravi Kumar"
                value={formData.patient_name}
                onChange={handleInputChange}
                required
              />
              
              <FormField
                label="Age"
                name="age"
                type="number"
                placeholder="e.g. 28"
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
                placeholder="e.g. +91 98XXXXXXXX"
                value={formData.phone_number}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <FormField
              label="Aadhar Number"
              name="aadhar_number"
              type="text"
              placeholder="e.g. 1234-1234-1234"
              value={formData.aadhar_number}
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
              required
            />
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign Doctor <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
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
              <Button type="submit" className="flex-1">
                Register Patient
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/hospital/dashboard')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};