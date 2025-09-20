import React, { useState } from 'react';
import { Header } from '../Layout/Header';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { User, Phone, Mail, MapPin, Award, Calendar, Clock, Edit3, Save, X } from 'lucide-react';
import { mockDoctors } from '../../data/mockData';

export const DoctorProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [doctorData, setDoctorData] = useState(mockDoctors[0]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setDoctorData(mockDoctors[0]); // Reset to original data
  };

  const handleInputChange = (field: string, value: string) => {
    setDoctorData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      <Header title="Doctor Profile" showBackButton />
      
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-medium text-black">Profile Information</h2>
            {!isEditing ? (
              <Button onClick={handleEdit} variant="outline">
                <Edit3 size={16} className="mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} variant="confirm">
                  <Save size={16} className="mr-2" />
                  Save
                </Button>
                <Button onClick={handleCancel} variant="cancel">
                  <X size={16} className="mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex-shrink-0">
              <img
                src={doctorData.photo_url}
                alt={doctorData.name}
                className="w-32 h-32 object-cover border border-black"
              />
              {isEditing && (
                <Button variant="outline" size="sm" className="mt-2 w-full">
                  Change Photo
                </Button>
              )}
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={doctorData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-black focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                  ) : (
                    <p className="text-black font-medium">{doctorData.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">Qualification</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={doctorData.qualification}
                      onChange={(e) => handleInputChange('qualification', e.target.value)}
                      className="w-full px-3 py-2 border border-black focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                  ) : (
                    <p className="text-gray-600">{doctorData.qualification}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">Department</label>
                  {isEditing ? (
                    <select
                      value={doctorData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full px-3 py-2 border border-black focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      <option value="Dermatology">Dermatology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="General Medicine">General Medicine</option>
                    </select>
                  ) : (
                    <p className="text-gray-600">{doctorData.department}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">Contact Number</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={doctorData.contact_number}
                      onChange={(e) => handleInputChange('contact_number', e.target.value)}
                      className="w-full px-3 py-2 border border-black focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                  ) : (
                    <p className="text-gray-600">{doctorData.contact_number}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 border border-black">
              <h3 className="text-2xl font-medium text-black">12+</h3>
              <p className="text-sm text-gray-600">Years Experience</p>
            </div>
            <div className="text-center p-4 border border-black">
              <h3 className="text-2xl font-medium text-black">1,500+</h3>
              <p className="text-sm text-gray-600">Patients Treated</p>
            </div>
            <div className="text-center p-4 border border-black">
              <h3 className="text-2xl font-medium text-black">4.9</h3>
              <p className="text-sm text-gray-600">Patient Rating</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-black mb-3">About</h3>
              {isEditing ? (
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-black focus:outline-none focus:ring-2 focus:ring-gray-500"
                  defaultValue="Dr. Ramesh is a highly experienced dermatologist with over 12 years of practice in treating various skin conditions. He specializes in cosmetic dermatology, acne treatment, and skin cancer screening."
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">
                  Dr. Ramesh is a highly experienced dermatologist with over 12 years of practice in treating various skin conditions. 
                  He specializes in cosmetic dermatology, acne treatment, and skin cancer screening. Dr. Ramesh is known for his 
                  patient-centered approach and commitment to providing the highest quality care.
                </p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium text-black mb-3">Education & Certifications</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-black" />
                  <span className="text-gray-700">MBBS - All India Institute of Medical Sciences (2011)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-black" />
                  <span className="text-gray-700">MD Dermatology - Post Graduate Institute (2014)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-black" />
                  <span className="text-gray-700">Fellowship in Cosmetic Dermatology (2015)</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-black mb-3">Working Hours</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-black" />
                  <span className="text-gray-700">Monday - Friday</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-black" />
                  <span className="text-gray-700">9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-black" />
                  <span className="text-gray-700">Saturday</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-black" />
                  <span className="text-gray-700">9:00 AM - 1:00 PM</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-black mb-3">Specializations</h3>
              <div className="flex flex-wrap gap-2">
                {['Acne Treatment', 'Skin Cancer Screening', 'Cosmetic Dermatology', 'Psoriasis', 'Eczema', 'Hair Loss Treatment'].map((specialization) => (
                  <span key={specialization} className="px-3 py-1 border border-black text-black text-sm">
                    {specialization}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};