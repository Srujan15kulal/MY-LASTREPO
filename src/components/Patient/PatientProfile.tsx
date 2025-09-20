import React, { useState } from 'react';
import { Header } from '../Layout/Header';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { FormField } from '../Common/FormField';
import { User, Edit3, Save, X } from 'lucide-react';
import { mockPatients } from '../../data/mockData';

export const PatientProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [patientData, setPatientData] = useState(mockPatients[0]);

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
    setPatientData(mockPatients[0]); // Reset to original data
  };

  const handleInputChange = (field: string, value: string) => {
    setPatientData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      <Header title="Patient Profile" showBackButton />
      
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
              <div className="w-32 h-32 border border-black flex items-center justify-center bg-gray-100">
                <User size={64} className="text-gray-600" />
              </div>
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
                      value={patientData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-black focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                  ) : (
                    <p className="text-black font-medium">{patientData.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">Patient ID</label>
                  <p className="text-gray-600">{patientData.patient_id}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">Age</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={patientData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className="w-full px-3 py-2 border border-black focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                  ) : (
                    <p className="text-gray-600">{patientData.age} years</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">Gender</label>
                  {isEditing ? (
                    <select
                      value={patientData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full px-3 py-2 border border-black focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="text-gray-600">{patientData.gender}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={patientData.phone_number}
                      onChange={(e) => handleInputChange('phone_number', e.target.value)}
                      className="w-full px-3 py-2 border border-black focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                  ) : (
                    <p className="text-gray-600">{patientData.phone_number}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">Aadhar Number</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={patientData.aadhar_number}
                      onChange={(e) => handleInputChange('aadhar_number', e.target.value)}
                      className="w-full px-3 py-2 border border-black focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                  ) : (
                    <p className="text-gray-600">{patientData.aadhar_number}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-black mb-3">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Contact Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue="Sunita Kumar"
                      className="w-full px-3 py-2 border border-black focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                  ) : (
                    <p className="text-gray-600">Sunita Kumar</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Contact Phone</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue="+91 9876543211"
                      className="w-full px-3 py-2 border border-black focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                  ) : (
                    <p className="text-gray-600">+91 9876543211</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Relationship</label>
                  {isEditing ? (
                    <select
                      defaultValue="Spouse"
                      className="w-full px-3 py-2 border border-black focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      <option value="Spouse">Spouse</option>
                      <option value="Parent">Parent</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Child">Child</option>
                      <option value="Friend">Friend</option>
                    </select>
                  ) : (
                    <p className="text-gray-600">Spouse</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-black mb-3">Address Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Street Address</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue="123 MG Road, Sector 15"
                      className="w-full px-3 py-2 border border-black focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                  ) : (
                    <p className="text-gray-600">123 MG Road, Sector 15</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">City</label>
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue="Bangalore"
                        className="w-full px-3 py-2 border border-black focus:outline-none focus:ring-2 focus:ring-gray-500"
                      />
                    ) : (
                      <p className="text-gray-600">Bangalore</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">State</label>
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue="Karnataka"
                        className="w-full px-3 py-2 border border-black focus:outline-none focus:ring-2 focus:ring-gray-500"
                      />
                    ) : (
                      <p className="text-gray-600">Karnataka</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">PIN Code</label>
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue="560001"
                        className="w-full px-3 py-2 border border-black focus:outline-none focus:ring-2 focus:ring-gray-500"
                      />
                    ) : (
                      <p className="text-gray-600">560001</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-black mb-3">Medical Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Blood Group</label>
                  {isEditing ? (
                    <select
                      defaultValue="B+"
                      className="w-full px-3 py-2 border border-black focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  ) : (
                    <p className="text-gray-600">B+</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Insurance Provider</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue="Star Health Insurance"
                      className="w-full px-3 py-2 border border-black focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                  ) : (
                    <p className="text-gray-600">Star Health Insurance</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Policy Number</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue="SH123456789"
                      className="w-full px-3 py-2 border border-black focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                  ) : (
                    <p className="text-gray-600">SH123456789</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};